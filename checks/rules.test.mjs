import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { needsBump, scan, scanTree } from './rules.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const rules = (file, src) => scan(file, src).map(x => x.rule)
const fails = (file, src, rule, fix) => {
  const hit = scan(file, src).filter(x => x.rule === rule)
  assert.ok(hit.length > 0, `${rule} should fire on ${file}:\n${src}`)
  assert.match(hit[0].message, fix)
  assert.match(hit[0].message, new RegExp(`^${file.replaceAll('.', '\\.')}`))
}
const passes = (file, src) => assert.deepEqual(scan(file, src).map(x => x.message), [])

test('the tree breaks no rule', () => {
  assert.deepEqual(scanTree(root).map(x => x.message), [])
})

test('comments are banned: only a ts directive and a one-line ponytail marker are allowed', () => {
  fails('hooks/a.ts', '// This is needed because the engine drops timers.\nconst a = 1\n', 'comment', /Fix the cause in the code/)
  fails('hooks/a.ts', 'const a = 1 // why: a short note\n', 'comment', /instead of justifying it here/)
  fails('hooks/a.ts', '/* a */\nconst a = 1\n', 'comment', /Fix the cause/)
  fails('hooks/a.ts', '/** Docs for a. */\nexport const a = 1\n', 'comment', /Fix the cause/)
  fails('hooks/a.jsx', '// a\n', 'comment', /Fix the cause/)
  fails('hooks/a.mts', '// a\n', 'comment', /Fix the cause/)
  fails('hooks/a.cjs', '// a\n', 'comment', /Fix the cause/)
  fails('hooks/scenes/a.ts', '// @ts-nocheck because tsc is slow\n', 'comment', /Fix the cause/)
  fails('hooks/a.ts', `// ponytail: ${'x'.repeat(90)}\n`, 'comment', /one line of 100 characters/)
  fails('hooks/a.ts', '/* ponytail: a\n   ceiling */\n', 'comment', /Fix the cause/)
  fails('hooks/a.ts', '// ponytail:\n', 'comment', /Fix the cause/)
  passes('hooks/scenes/a.ts', '// @ts-nocheck\nconst a = 1\n')
  passes('hooks/scenes/a.ts', '// @ts-nocheck ponytail: string builders, checked by render tests not tsc\n')
  passes('hooks/a.ts', 'const a = f() // ponytail: one pass only, a second pass when a look needs it\n')
  passes('checks/a.mjs', 'const a = 1\n')
})

test('comment markers inside strings, templates, regexes and JSX text are read right', () => {
  passes('hooks/a.ts', "const u = 'http://a/b'\nconst t = `<a href=\"http://x\">${'//'}</a>`\n")
  passes('hooks/a.ts', 'const r = /\\/\\/ not a comment/\nconst s = "/* no */"\n')
  passes('hooks/a.ts', 'const t = `${a ? `//one` : "//two"} //three\n//four\n//five`\n')
  fails('hooks/a.ts', 'i++ / 2 // note\n', 'comment', /Fix the cause/)
  fails('hooks/a.tsx', "const a = <p>don't</p> // note\n", 'comment', /Fix the cause/)
  fails('hooks/a.ts', "if (x) /'/.test(s) // note\n", 'comment', /Fix the cause/)
})

test('commented-out code gets its own message', () => {
  fails('hooks/a.ts', '// const x = load(a)\n', 'comment', /commented-out code: delete it/)
  fails('hooks/a.ts', '// render(svg)\n', 'comment', /git keeps the history/)
  fails('hooks/a.ts', '/* if (busy) { */\n', 'comment', /commented-out code/)
  assert.doesNotMatch(scan('hooks/a.ts', '// while Claude works the light runs\n')[0].message, /commented-out/)
})

test('raw timers are banned in the mod, aliased and qualified forms too', () => {
  fails('hooks/register.tsx', 'setTimeout(f, 10)\n', 'raw-timer', /\$\.clock\.after/)
  fails('hooks/register.tsx', 'globalThis.setInterval(f, 10)\n', 'raw-timer', /\$\.clock/)
  fails('hooks/scenes/a.ts', 'const later = setTimeout\n', 'raw-timer', /re-arm at session\.start/)
  fails('hooks/register.tsx', 'const { setTimeout: t } = globalThis\n', 'raw-timer', /\$\.clock/)
  fails('hooks/register.tsx', "globalThis['set' + 'Timeout'](f, 1)\n", 'raw-timer', /\$\.clock/)
  fails('hooks/register.tsx', 'window["setTimeout"](f, 1)\n', 'raw-timer', /\$\.clock/)
  passes('hooks/register.tsx', 'void $.clock.after(10, f)\n')
})

test('a scene is pure: no clock, no unseeded random', () => {
  fails('hooks/scenes/a.ts', 'const r = Math.random()\n', 'impure-scene', /lcg\(seed\)/)
  fails('hooks/scenes/a.ts', "const r = Math['random']()\n", 'impure-scene', /lcg/)
  fails('hooks/scenes/a.ts', 'const { random } = Math\n', 'impure-scene', /lcg/)
  fails('hooks/scenes/a.ts', 'const t = Date.now()\n', 'impure-scene', /`now` the look passes in/)
  fails('hooks/scenes/a.ts', 'const d = new Date()\n', 'impure-scene', /`now`/)
  fails('hooks/scenes/a.ts', 'const M = Math\nconst r = M.random()\n', 'impure-scene', /lcg/)
  passes('hooks/scenes/a.ts', 'const d = new Date(iso)\nconst r = lcg(7)()\nconst x = Math.sin(Math.PI)\n')
  passes('hooks/register.tsx', 'const now = new Date()\n')
})

test('a scene imports only sibling scenes and types, relative climbs included', () => {
  fails('hooks/scenes/a.ts', "import { faultOf } from '../register'\n", 'scene-import', /pass anything else in/)
  fails('hooks/scenes/a.ts', "import { read } from 'claude-code'\n", 'scene-import', /sibling scenes/)
  fails('hooks/scenes/a.ts', "import { x } from './../palettes'\n", 'scene-import', /sibling scenes/)
  fails('hooks/scenes/a.ts', "const m = await import('./glyph-kit')\n", 'scene-import', /sibling scenes/)
  fails('hooks/scenes/a.ts', "import 'node:fs'\n", 'scene-import', /sibling scenes/)
  passes('hooks/scenes/a.ts', "import { tiles } from './glyph-kit'\nimport type { Meter } from '../../types'\n")
})

test('type checks and rules have no inline off switch', () => {
  fails('hooks/palettes.ts', 'export const P: Record<string, any> = {}\n', 'type-any', /name the type/)
  fails('hooks/register.tsx', 'const a: any = 1\n', 'type-any', /unknown with a guard/)
  fails('hooks/register.tsx', 'f(x as any)\n', 'type-any', /turns the checker off/)
  fails('hooks/register.tsx', 'const f = (a: string | any) => a\n', 'type-any', /name the type/)
  fails('hooks/register.tsx', 'type Loose = any\n', 'type-any', /name the type/)
  fails('hooks/register.tsx', 'const f = (x: number): Promise<any> => g(x)\n', 'type-any', /name the type/)
  fails('hooks/register.tsx', 'type F = (x: number) => any\n', 'type-any', /name the type/)
  fails('hooks/register.tsx', 'type T<X extends any> = X\n', 'type-any', /name the type/)
  fails('hooks/register.tsx', 'type P = [any, number]\n', 'type-any', /name the type/)
  fails('hooks/register.tsx', 'const y = x satisfies any\n', 'type-any', /name the type/)
  passes('hooks/register.tsx', "const many = 1\nconst t = 'pick any look: any'\nconst u: unknown = many\n")
  passes('hooks/scenes/a.ts', '// @ts-nocheck\nconst a: any = 1\n')
  passes('tests/a.test.tsx', 'const a: any = 1\n')
  fails('hooks/register.tsx', '// @ts-ignore\nconst a: number = "x"\n', 'type-escape', /fix the type at its source/)
  fails('hooks/register.tsx', 'const a = 1 // @ts-expect-error\n', 'type-escape', /fix the type/)
  fails('tests/a.test.tsx', '/* @ts-expect-error */\n', 'type-escape', /fix the type/)
  fails('hooks/register.tsx', '// @ts-nocheck\n', 'type-escape', /type this file/)
  fails('hooks/register.tsx', '// eslint-disable-next-line\n', 'rule-switch', /no inline switch/)
  fails('hooks/register.tsx', '/* global foo */\n', 'rule-switch', /no inline switch/)
  fails('hooks/register.tsx', '/* eslint no-undef: 0 */\n', 'rule-switch', /change the code/)
  passes('hooks/scenes/a.ts', '// @ts-nocheck\n')
})

test('atom takes the plugin and key as string literals', () => {
  fails('hooks/register.tsx', "const a = atom({ plugin: PLUGIN, key: 'state' }, 1)\n", 'atom-literal', /kindling-DOM-004/)
  fails('hooks/register.tsx', "const a = atom(spec, 1)\n", 'atom-literal', /string literals/)
  passes('hooks/register.tsx', "const a = atom({ plugin: 'kindling', key: 'state' } as const, 1)\n")
})

test('a test asserts a colour on the painted element, never on the svg text', () => {
  fails('tests/a.test.tsx', "expect(svg.includes('#1B1A18')).toBe(true)\n", 'colour-by-text', /resolve the fill/)
  fails('tests/a.test.tsx', 'expect(svg.includes(hex)).toBe(true)\n', 'colour-by-text', /mutation/)
  fails('tests/a.test.tsx', 'expect(svg).toMatch(/fill="#a1b2c3"/)\n', 'colour-by-text', /kindling-MIS-008/)
  fails('tests/a.test.tsx', 'expect(svg).toContain(accentColour)\n', 'colour-by-text', /resolve the fill/)
  fails('tests/a.test.tsx', 'expect(svg.includes(PALETTES[id].bg)).toBe(true)\n', 'colour-by-text', /resolve the fill/)
  passes('tests/a.test.tsx', "expect(fillOf(svg, 'sr1')).toBe('#1B1A18')\n")
})

test('the public repo holds no home path and no personal email', () => {
  fails('README.md', 'see /Users/someone/kindling\n', 'personal-data', /home-folder path/)
  fails('hooks/a.ts', "const m = 'someone@gmail.com'\n", 'personal-data', /noreply/)
  passes('README.md', 'Commit as 1+someone@users.noreply.github.com\n')
})

test('no line reads as minified', () => {
  fails('hooks/palettes.ts', `const a = '${'x'.repeat(600)}'\n`, 'long-line', /kindling-DOM-005/)
  passes('hooks/palettes.ts', `const a = '${'x'.repeat(586)}'\n`)
})

test('home.ts is pinned: any change is read for real data first', () => {
  const home = readFileSync(new URL('../hooks/scenes/home.ts', import.meta.url), 'utf8')
  passes('hooks/scenes/home.ts', home)
  fails('hooks/scenes/home.ts', home.replace(/\d/, '9'), 'home-plan', /INVENTED flat/)
})

test('the vendored colour kit is left as copied', () => {
  const kit = readFileSync(new URL('../hooks/make-colors.js', import.meta.url), 'utf8')
  passes('hooks/make-colors.js', kit)
  fails('hooks/make-colors.js', kit.slice(kit.indexOf('\n') + 1), 'vendored', /copy it fresh/)
  assert.deepEqual(rules('hooks/make-colors.js', `${kit}\n// a\n// b\n// c\n`), [])
})

test('a shipped change needs a version bump', () => {
  assert.match(needsBump(['hooks/scenes/a.ts'], '0.8.0', '0.8.0'), /bump the version.*kindling-MIS-002/)
  assert.match(needsBump(['.claude-plugin/icon.png'], '0.8.0', '0.8.0'), /bump/)
  assert.equal(needsBump(['hooks/scenes/a.ts'], '0.8.0', '0.8.1'), undefined)
  assert.equal(needsBump(['README.md', 'tests/looks.test.tsx', 'checks/rules.mjs'], '0.8.0', '0.8.0'), undefined)
})

test('this branch bumps the version if it changes shipped files', () => {
  const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8' }).trim()
  let base
  try {
    base = git('merge-base', 'HEAD', 'origin/main')
  } catch {
    assert.fail('no origin/main to compare with: run git fetch origin')
  }
  const changed = [...git('diff', '--name-only', base).split('\n'), ...git('ls-files', '--others', '--exclude-standard').split('\n')].filter(Boolean)
  const version = s => JSON.parse(s).version
  const before = version(git('show', `${base}:.claude-plugin/plugin.json`))
  const after = version(readFileSync(new URL('../.claude-plugin/plugin.json', import.meta.url), 'utf8'))
  assert.equal(needsBump(changed, before, after), undefined)
})

test('every look has its preview and README row', () => {
  const reg = readFileSync(new URL('../hooks/register.tsx', import.meta.url), 'utf8')
  const table = reg.slice(reg.indexOf('const LOOKS = {'), reg.indexOf('} satisfies Record'))
  const ids = [...table.matchAll(/^ {2}'?([\w-]+)'?: \{$/gm)].map(m => m[1])
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
  const shots = readdirSync(new URL('../previews', import.meta.url))
  assert.equal(ids.length, 24)
  const missing = ids.flatMap(id => [
    ...(shots.some(f => f === `${id}.jpg` || f === `${id}-light.jpg`) ? [] : [`${id}: no previews/${id}.jpg; render the look and save it there`]),
    ...(readme.includes(`\`${id}\``) ? [] : [`${id}: no README row; add one naming \`${id}\``]),
  ])
  assert.deepEqual(missing, [])
})

test('a /look command catches up with other chats before it writes, and every chat follows on a timer, as checks/follow/Follow.tla assumes', () => {
  const src = readFileSync(new URL('../hooks/register.tsx', import.meta.url), 'utf8')
  const run = src.slice(src.indexOf("on('command.run'"), src.indexOf("on('session.attach'"))
  const follows = run.indexOf('await follow($)')
  assert.ok(src.includes('void $.clock.every(FOLLOW_MS, () => follow($))'), 'session.start must arm follow on $.clock.every: Follow.tla proves convergence only with that timer (NoTimer.cfg)')
  assert.ok(follows !== -1 && follows < run.indexOf('await read($, state)') && follows < run.indexOf('$.store.set'), 'command.run must await follow($) before it reads or writes the stored look, or a chat writes its old look over a newer choice (the NoCatchUp.cfg trace)')
})
