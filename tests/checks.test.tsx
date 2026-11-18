// @ts-nocheck ponytail: the harness fakes partial engine inputs; checked by running, not by tsc
import { expect, test } from 'claude-code/testing'

import { PALETTES } from '../hooks/palettes'
import { faultOf, settle } from '../hooks/register'
import { playsInApp } from './plays'

const STILL = new Set(['koster', 'dark-side', 'terracotta', 'recovery', 'home', 'manuscript', 'training', 'garden',
  'month-end', 'hacker', 'clay', 'raster', 'raster-ide', 'raster-code', 'glyph-lighthouse', 'glyph-balloons',
  'glyph-dandelion', 'glyph-train', 'stipple-lake'])

const engine = (on: any, store: Record<string, unknown> = {}) => {
  on('command.register', (_: unknown, e: any) => ({ value: { command: e.name } }))
  on('theme.set', () => ({ value: { isDrawn: true, requestId: 'theme' } }))
  on('store.get', (_: unknown, e: any) => ({ value: store[e.key] ?? null }))
  on('store.set', (_: unknown, e: any) => {
    store[e.key] = e.value
    return { value: undefined }
  })
  on('session.start', (_: unknown, e: any) => ({ cwd: e.cwd }))
  on('turn.start', () => ({ turnId: 't1' }))
  on('clock.every', () => ({ value: undefined }))
}
const backdrop = (scene: string) => ({ plugin: 'kindling', component: 'Backdrop', requestId: 'theme', surface: 'desktop', props: { plugin: 'kindling', scene, glass: {} } }) as const
const draw = async ($: any, id: string) => {
  const ui = await $.ui.mount(backdrop(id))
  const svg = String((await ui.find({ type: 'Svg' }))?.props.source)
  await ui.unmount()
  return svg
}
const problems = (id: string, svg: string, why: string): string[] => [
  ...(svg.startsWith('<svg') ? [] : [`${why} does not start with <svg`]),
  ...(svg.length < 120000 ? [] : [`${why} is ${svg.length} characters (max 119999): draw less or reuse defs`]),
  ...(/<script|javascript:|\son\w+=/i.test(svg) ? [`${why} holds a script: SMIL and CSS only`] : []),
  ...(playsInApp(svg) === !STILL.has(id) ? [] : [STILL.has(id) ? `${why} plays in the app: take it off STILL` : `${why} is refused by the app: remove what is off its lists (tests/plays.ts) or list it in STILL`]),
]
const ids = async ($: any) => [...(await $.command.run({ command: 'look', args: 'list' })).text.matchAll(/^([\w-]+): /gm)].map(m => m[1])

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0
  let t = seed
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const forAll = async (n: number, seed: number, body: (r: () => number, i: number) => unknown) => {
  const r = rng(seed)
  for (let i = 0; i < n; i++) {
    try {
      await body(r, i)
    } catch (e) {
      throw new Error(`case ${i} of seed ${seed}: ${(e as Error).message}`)
    }
  }
}
const pick = <T,>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length)] as T

test('every look, at rest and at work: an svg under 120000 characters, no script, the same picture twice, a palette, and it plays in the app unless it is listed still', async ($, on) => {
  engine(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const all = await ids($)
  expect([...all].sort()).toEqual(Object.keys(PALETTES).sort())
  expect([...STILL].filter(id => !all.includes(id))).toEqual([])
  for (const busy of [false, true]) {
    if (busy) await $.turn.start({ turnId: 't1' })
    for (const id of all) {
      const svg = await draw($, id)
      expect(problems(id, svg, `${id} ${busy ? 'at work' : 'at rest'}`)).toEqual([])
      expect(await draw($, id)).toBe(svg)
      expect(`${id} palette: ${PALETTES[id] !== undefined}`).toBe(`${id} palette: true`)
    }
  }
})

test('the all-looks check is red on an oversized, scripted, refused or wrongly listed scene', () => {
  const ok = '<svg viewBox="0 0 10 10"><rect width="1" height="1"/></svg>'
  expect(problems('sakura', ok, 'x')).toEqual([])
  expect(problems('koster', ok, 'x')).toEqual(['x plays in the app: take it off STILL'])
  expect(problems('sakura', ok.replace('<rect', `<rect class="${'a'.repeat(120000)}"`), 'x')).toEqual(['x is 120068 characters (max 119999): draw less or reuse defs'])
  expect(problems('sakura', ok.replace('<rect', '<rect onclick="x()"'), 'x')).toContain('x holds a script: SMIL and CSS only')
  expect(problems('sakura', ok.replace('</svg>', '<script>x()</script></svg>'), 'x')).toContain('x holds a script: SMIL and CSS only')
  expect(problems('sakura', ok.replace('<rect', '<filter id="g"><feTurbulence/></filter><rect'), 'x')).toEqual(['x is refused by the app: remove what is off its lists (tests/plays.ts) or list it in STILL'])
  expect(problems('sakura', `<g>${ok}</g>`, 'x')).toContain('x does not start with <svg')
})

test('property: faultOf shows the colour kit refusal first, else the reason of a refusal with no request id', async () => {
  await forAll(500, 11, r => {
    const unpainted = r() < 0.4 ? `Desktop won't paint ${Math.floor(r() * 99)}` : undefined
    const set = { isDrawn: r() < 0.5, ...(r() < 0.5 ? { requestId: 'theme' } : {}), ...(r() < 0.7 ? { reason: `r${Math.floor(r() * 99)}` } : {}) }
    const want = unpainted ?? (set.isDrawn || set.requestId !== undefined ? undefined : set.reason)
    expect(faultOf(unpainted, set)).toBe(want)
    if (unpainted !== undefined) expect(faultOf(unpainted, set)).toBe(unpainted)
    if (set.requestId !== undefined) expect(faultOf(undefined, set)).toBe(undefined)
  })
})

test('property: settle zeroes exactly the windows past their reset, keeps the rest, and is idempotent', async () => {
  const now = Date.parse('2026-11-16T12:00:00Z')
  await forAll(500, 23, r => {
    const limit = () => {
      if (r() < 0.2) return undefined
      const at = r() < 0.2 ? undefined : new Date(now + Math.round((r() - 0.5) * 2 * 864e5)).toISOString()
      return { used: Math.floor(r() * 101), ...(at === undefined ? {} : { resetsAt: at }) }
    }
    const m: any = {}
    for (const k of ['fiveHour', 'sevenDay']) {
      const l = limit()
      if (l !== undefined) m[k] = l
    }
    if (r() < 0.5) m.cache = Math.floor(r() * 101)
    const before = JSON.stringify(m)
    const out: any = settle(m, now)
    expect(JSON.stringify(m)).toBe(before)
    for (const k of ['fiveHour', 'sevenDay']) {
      const passed = m[k]?.resetsAt !== undefined && Date.parse(m[k].resetsAt) <= now
      expect(out[k]).toEqual(passed ? { used: 0 } : m[k])
    }
    expect(out.cache).toBe(m.cache)
    expect(settle(out, now)).toEqual(out)
  })
})

test('property: /look set stores a whole number only for recovery 0..100 and garden 0..7', async ($, on) => {
  const store: Record<string, unknown> = {}
  engine(on, store)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await forAll(300, 37, async r => {
    const field = pick(r, ['recovery', 'garden', 'mood', ''])
    const value = pick(r, [String(Math.round((r() * 200 - 50) * 10) / 10), String(Math.floor(r() * 120)), 'NaN', '1e1', 'abc', '', '-0', '0', '7', '8', '100', '101', '-1', '6.6', '99.5'])
    const was = JSON.stringify(store.state ?? {})
    const said = (await $.command.run({ command: 'look', args: `set ${field} ${value}` })).text
    const range = field === 'recovery' ? 100 : field === 'garden' ? 7 : undefined
    const n = value === '' ? NaN : Number(value)
    if (range !== undefined && field !== '' && Number.isFinite(n) && n >= 0 && n <= range) {
      expect(Object.is((store.state as any)[field], Math.round(n) || 0)).toBe(true)
      expect(said).toBe(`${field} = ${Math.round(n) || 0}.`)
    } else {
      expect(JSON.stringify(store.state ?? {})).toBe(was)
      expect(said).toMatch(/^Так:/)
    }
  })
})
