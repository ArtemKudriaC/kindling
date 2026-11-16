import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const CODE = /\.([cm]?js|[cm]?ts|[jt]sx)$/
const TEXT = /\.([cm]?js|[cm]?ts|[jt]sx|json|md|txt)$/
const SKIP = new Set(['.git', 'node_modules'])
const SKIP_PATHS = new Set(['.claude-plugin/types', 'target', '.claude', '.wt'])
export const VENDORED = new Set(['hooks/make-colors.js', 'hooks/make-colors.d.ts'])
const VENDOR_HEAD = '// make-colors.js: copy this file into your mod\'s hooks folder, and leave it as it is.'

export const HOME_SHA = '5f307471a51ab5c82603e0f41f40f9108f498a0b527ce1990947fc775d195ee1'

const MAX_COMMENT_CHARS = 100
const MAX_LINE = 600
export const ALLOWED_COMMENT = /^\/\/ (@ts-(nocheck|check)( ponytail: \S.*)?|ponytail: \S.*)$/

const REGEX_BEFORE = /(^|[=(,:[!&|?{};*%>~^]|(?<![+-])[+-]|\breturn|\btypeof|\bcase|\bdo|\belse|\bin|\bof)\s*$/

export function lex(src) {
  const comments = []
  let code = ''
  let notes = ''
  let prog = ''
  let i = 0
  let line = 1
  const stack = []
  const blank = s => s.replace(/[^\n]/g, ' ')
  const push = (s, keep, note = false) => {
    code += keep ? s : blank(s)
    notes += note ? s : blank(s)
    prog += note ? blank(s) : s
    line += (s.match(/\n/g) ?? []).length
  }
  while (i < src.length) {
    const c = src[i]
    const n = src[i + 1]
    if (c === '/' && n === '/') {
      const end = src.indexOf('\n', i)
      const text = src.slice(i, end === -1 ? src.length : end)
      const own = /^\s*$/.test(code.slice(code.lastIndexOf('\n') + 1))
      comments.push({ line, lines: [text], own, block: false })
      push(text, false, true)
      i += text.length
    } else if (c === '/' && n === '*') {
      const end = src.indexOf('*/', i + 2)
      const text = src.slice(i, end === -1 ? src.length : end + 2)
      const own = /^\s*$/.test(code.slice(code.lastIndexOf('\n') + 1))
      comments.push({ line, lines: text.split('\n'), own, block: true })
      push(text, false, true)
      i += text.length
    } else if (c === '\'' || c === '"') {
      let j = i + 1
      while (j < src.length && src[j] !== c && src[j] !== '\n') j += src[j] === '\\' ? 2 : 1
      if (src[j] !== c) {
        push(c, true)
        i++
        continue
      }
      push(c, true)
      push(src.slice(i + 1, j), false)
      push(src[j] ?? '', true)
      i = j + 1
    } else if (c === '`' || (c === '}' && stack.at(-1) === 0)) {
      if (c === '}') stack.pop()
      let j = i + 1
      while (j < src.length && src[j] !== '`' && !(src[j] === '$' && src[j + 1] === '{')) j += src[j] === '\\' ? 2 : 1
      push(c, true)
      push(src.slice(i + 1, j), false)
      if (src[j] === '$') {
        stack.push(0)
        push('${', true)
        i = j + 2
      } else {
        push(src[j] ?? '', true)
        i = j + 1
      }
    } else if (c === '/' && REGEX_BEFORE.test(code.slice(Math.max(0, code.length - 12)))) {
      let j = i + 1
      let cls = false
      while (j < src.length && src[j] !== '\n' && (cls || src[j] !== '/')) {
        if (src[j] === '\\') j++
        else if (src[j] === '[') cls = true
        else if (src[j] === ']') cls = false
        j++
      }
      if (src[j] !== '/' || src[j + 1] === '/' || src[j + 1] === '*') {
        push('/', true)
        i++
        continue
      }
      push('/', true)
      push(src.slice(i + 1, j), false)
      push(src[j] ?? '', true)
      i = j + 1
    } else {
      if (c === '{' && stack.length) stack[stack.length - 1]++
      if (c === '}' && stack.length) stack[stack.length - 1]--
      push(c, true)
      i++
    }
  }
  return { comments, code, notes, prog }
}

const LOOKS_LIKE_CODE = [
  /^(const|let|var)\s+[\w${}[\], ]+=\s*\S/,
  /^[\w$.[\]]+\s*[-+*/]?=\s*[^=\s]\S*;?$/,
  /^[\w$.[\]]+\s*[-+*/]?=.*;$/,
  /^(if|for|while|switch)\s*\(.*\)\s*\{?$/,
  /^(return|throw)\s.*;$/,
  /^(import|export)\s.*\bfrom\s+['"]/,
  /^(async\s+)?function\s*[\w$]*\s*\(/,
  /^(await\s+)?[\w$.]+\(.*\);?$/,
  /^[})\]];?$/,
  /\)\s*=>\s*[{(\w]/,
]

const at = (code, index) => code.slice(0, index).split('\n').length

const bans = [
  {
    rule: 'raw-timer',
    where: f => f.startsWith('hooks/'),
    on: 'prog',
    re: /\b(setTimeout|setInterval|setImmediate|queueMicrotask|requestAnimationFrame)\b|\b(globalThis|window|self|global)\s*\[/g,
    fix: 'use $.clock.after or $.clock.every: the engine owns those timers and drops them on a hot reload; re-arm at session.start (see arm in hooks/register.tsx)',
  },
  {
    rule: 'impure-scene',
    where: f => f.startsWith('hooks/scenes/'),
    on: 'prog',
    re: /\bMath\b(?!\s*\.\s*(?!random\b)[A-Za-z_$])|\brandom\s*\(|\{[^}]*\brandom\b[^}]*\}\s*=\s*Math\b|\bDate\s*(\.|\[\s*['"`]?)\s*now\b|\bnew\s+Date\s*\(\s*\)|\bperformance\s*\.\s*now\b/g,
    fix: 'a scene is a pure function of its arguments: take the time from the `now` the look passes in, and draw random numbers from lcg(seed) in glyph-kit.ts',
  },
  {
    rule: 'scene-import',
    where: f => f.startsWith('hooks/scenes/'),
    on: 'prog',
    re: /\bfrom\s+(['"])(?!\.\/[\w-]+\1|\.\.\/\.\.\/types\1)[^'"]*\1|\bimport\s*(\(|['"])|\brequire\s*\(/g,
    fix: 'a scene imports only sibling scenes (./glyph-kit) and types (../../types): pass anything else in from hooks/register.tsx as an argument',
  },
  {
    rule: 'type-escape',
    where: () => true,
    re: /@ts-(ignore|expect-error)\b/g,
    on: 'notes',
    fix: 'fix the type at its source (a narrower type, a guard) instead of silencing the checker',
  },
  {
    rule: 'type-escape',
    where: f => !f.startsWith('hooks/scenes/') && !f.startsWith('tests/'),
    re: /@ts-nocheck\b/g,
    on: 'notes',
    fix: 'only scene string builders and tests may skip tsc; type this file',
  },
  {
    rule: 'rule-switch',
    where: () => true,
    re: /\b(eslint-disable|eslint-enable|biome-ignore|prettier-ignore|jshint|jscs:disable)\b|\/\*\s*(eslint|global)\s/g,
    on: 'notes',
    fix: 'rules have no inline switch: change the code so the rule holds',
  },
  {
    rule: 'atom-literal',
    where: f => f.startsWith('hooks/'),
    on: 'prog',
    re: /\batom\s*\(\s*(?!\{\s*plugin\s*:\s*['"][\w-]+['"]\s*,\s*key\s*:\s*['"][\w-]+['"])/g,
    fix: "write atom({ plugin: 'kindling', key: '<name>' }) with string literals: the plugin directory's scan refuses any other form (kindling-DOM-004)",
  },
  {
    rule: 'colour-by-text',
    where: f => f.startsWith('tests/'),
    on: 'prog',
    re: /\.(includes|indexOf|toContain)\s*\(\s*(['"`]#[0-9a-fA-F]{3,8}\b|[\w$.]*(hex|Hex|colou?r|Colou?r)[\w$.]*\s*\)|[^)\n]*\bPALETTES\b)|\.toMatch\s*\(\s*\/[^/\n]*#[0-9a-fA-F]{3,8}/g,
    fix: 'a colour found in the SVG text may be paint nobody sees: resolve the fill of the element the claim names (its class in the style block, gradient stops above 0 opacity) and add a mutation that recolours only that element (kindling-MIS-008)',
  },
]

const PERSONAL = [
  { re: /\/(Users|home)\/[A-Za-z][\w.-]*\//g, what: 'a home-folder path' },
  { re: /[\w.+-]+@(?!users\.noreply\.github\.com\b|example\.(com|org)\b)[A-Za-z0-9-]+\.[A-Za-z]{2,}\b/g, what: 'an email address' },
]

export function scan(file, src) {
  const out = []
  const add = (line, rule, message) => out.push({ file, line, rule, message })
  if (TEXT.test(file) && !file.endsWith('checks/rules.mjs') && !file.endsWith('checks/rules.test.mjs')) {
    for (const p of PERSONAL) {
      for (const m of src.matchAll(p.re)) {
        add(at(src, m.index), 'personal-data', `${file}:${at(src, m.index)}: ${p.what} in a public repo: remove it; commits use the GitHub noreply address`)
      }
    }
  }
  if (!CODE.test(file)) return out
  if (VENDORED.has(file)) {
    if (file.endsWith('.js') && !src.startsWith(VENDOR_HEAD)) add(1, 'vendored', `${file}: the colour kit is copied from the engine and left as it is: restore its header or copy it fresh`)
    return out
  }
  const { comments, code, notes, prog } = lex(src)
  for (const c of comments) {
    const text = c.lines.map(l => l.trim()).join(' ')
    const allowed = c.lines.length === 1 && ALLOWED_COMMENT.test(text) && text.length <= MAX_COMMENT_CHARS
    if (allowed) continue
    const body = c.lines.map(l => l.trim().replace(/^(\/\/+|\/\*+|\*+\/?)\s?/, '').replace(/\*\/$/, '').trim())
    const shaped = body.some(b => b && LOOKS_LIKE_CODE.some(re => re.test(b)))
    add(c.line, 'comment', shaped
      ? `${file}:${c.line}: commented-out code: delete it, git keeps the history`
      : `${file}:${c.line}: a comment explains what the code should say. Fix the cause in the code (a name, a type, a test, a check whose message names the fix) instead of justifying it here; a durable why goes to docs/ or kindling.md. Allowed: \`// @ts-nocheck\` and \`// ponytail: <ceiling>\`, one line of ${MAX_COMMENT_CHARS} characters`)
  }
  for (const b of bans) {
    if (!b.where(file)) continue
    const hay = { notes, prog, code }[b.on ?? 'code']
    for (const m of hay.matchAll(b.re)) {
      add(at(hay, m.index), b.rule, `${file}:${at(hay, m.index)}: ${b.rule}: ${b.fix}`)
    }
  }
  src.split('\n').forEach((l, k) => {
    if (l.length > MAX_LINE) {
      add(k + 1, 'long-line', `${file}:${k + 1}: a line of ${l.length} characters (max ${MAX_LINE}): the plugin directory reads it as minified (kindling-DOM-005); break it into joined parts`)
    }
  })
  if (file === 'hooks/scenes/home.ts') {
    const sha = createHash('sha256').update(src).digest('hex')
    if (sha !== HOME_SHA) {
      add(1, 'home-plan', `${file}: home.ts changed (sha256 ${sha}). It must draw an INVENTED flat, never the owner's real plan (kindling-MIS-001): read its data constants and header, then set HOME_SHA in checks/rules.mjs`)
    }
  }
  return out
}

export function files(root) {
  const out = []
  const walk = dir => {
    for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
      const rel = dir ? `${dir}/${e.name}` : e.name
      if (SKIP.has(e.name) || SKIP_PATHS.has(rel)) continue
      if (e.isDirectory()) walk(rel)
      else if (TEXT.test(e.name)) out.push(rel)
    }
  }
  walk('')
  return out.sort()
}

export const scanTree = root => files(root).flatMap(f => scan(f, readFileSync(join(root, f), 'utf8')))

export const SHIPPED = /^(hooks\/|types\/|\.claude-plugin\/(?!plugin\.json$))/

export function needsBump(changed, before, after) {
  const shipped = changed.filter(f => SHIPPED.test(f))
  if (shipped.length === 0 || before !== after) return undefined
  return `${shipped.length} shipped file(s) changed (${shipped.slice(0, 3).join(', ')}) but .claude-plugin/plugin.json stays at ${after}: bump the version, an installed copy updates only when it differs (kindling-MIS-002)`
}

