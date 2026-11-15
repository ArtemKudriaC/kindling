import { expect, test } from 'claude-code/testing'

import { PALETTES } from '../hooks/palettes'
import { faultOf } from '../hooks/register'

type Set = { backdrop?: { scene?: string } }

const engine = (on: any, sets: Set[], store: Record<string, unknown> = {}, drawn: unknown = { isDrawn: true, requestId: 'theme' }) => {
  on('command.register', (_: unknown, e: any) => ({ value: { command: e.name } }))
  on('theme.set', (_: unknown, e: any) => {
    sets.push(e)
    return { value: drawn }
  })
  on('store.get', (_: unknown, e: any) => ({ value: store[e.key] ?? null }))
  on('store.set', (_: unknown, e: any) => {
    store[e.key] = e.value
    return { value: undefined }
  })
  on('session.start', (_: unknown, e: any) => ({ cwd: e.cwd }))
  on('turn.start', () => ({ turnId: 't1' }))
  on('turn.complete', () => ({ text: '' }))
}

const backdrop = (scene: string) => ({ plugin: 'looks', component: 'Backdrop', requestId: 'theme', surface: 'desktop', props: { plugin: 'looks', scene, glass: {} } }) as const

test('a new session wears Костёр, and a saved look wins', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(sets.at(-1)?.backdrop?.scene).toBe('koster')
})

test('a saved look is applied at start', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets, { state: { look: 'garden', garden: 6 } })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(sets.at(-1)?.backdrop?.scene).toBe('garden')
})

test('/look switches, stores, lists and refuses an unknown name', async ($, on) => {
  const sets: Set[] = []
  const store: Record<string, unknown> = {}
  engine(on, sets, store)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const switched = await $.command.run({ command: 'look', args: 'dark-side' })
  expect(sets.at(-1)?.backdrop?.scene).toBe('dark-side')
  expect((store.state as { look: string }).look).toBe('dark-side')
  expect(switched.text).toMatch(/Тёмная сторона/)

  expect((await $.command.run({ command: 'look', args: '' })).text).toMatch(/month-end/)
  expect((await $.command.run({ command: 'look', args: 'nope' })).text).toMatch(/Нет темы/)
})

test('/look set takes recovery 0..100 and garden 0..7 only', async ($, on) => {
  const store: Record<string, unknown> = {}
  engine(on, [], store)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'look', args: 'set recovery 72' })
  expect((store.state as { recovery: number }).recovery).toBe(72)
  expect((await $.command.run({ command: 'look', args: 'set garden 9' })).text).toMatch(/garden 0\.\.7/)
  expect((await $.command.run({ command: 'look', args: 'set mood 3' })).text).toMatch(/Так:/)
})

test('Костёр flares while Claude works and settles after', async ($, on) => {
  engine(on, [])
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const idle = await $.ui.mount(backdrop('koster'))
  const before = (await idle.find({ type: 'Svg' }))?.props.source
  await idle.unmount()

  await $.turn.start({ turnId: 't1' })
  const busy = await $.ui.mount(backdrop('koster'))
  const during = (await busy.find({ type: 'Svg' }))?.props.source
  await busy.unmount()

  await $.turn.complete({ turnId: 't1', answer: '', reason: 'done' })
  const after = await $.ui.mount(backdrop('koster'))
  const settled = (await after.find({ type: 'Svg' }))?.props.source
  await after.unmount()

  expect(typeof before).toBe('string')
  expect(during).not.toBe(before)
  expect(settled).toBe(before)
})

test('every look draws an svg on desktop and nothing in the terminal', async ($, on) => {
  engine(on, [])
  on('ui.render', ($: any, e: any) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })
  for (const id of ['koster', 'dark-side', 'terracotta', 'recovery', 'home', 'manuscript', 'training', 'garden', 'month-end', 'hacker', 'clay', 'raster', 'raster-ide', 'raster-code', 'glyph-lighthouse', 'glyph-balloons', 'glyph-dandelion', 'glyph-train', 'stipple-lake', 'gouache-autumn', 'ember-core', 'ivory']) {
    const ui = await $.ui.mount(backdrop(id))
    const svg = (await ui.find({ type: 'Svg' }))?.props.source
    expect(String(svg).startsWith('<svg')).toBe(true)
    expect(String(svg).length < 131072).toBe(true)
    await ui.unmount()
  }
  const term = await $.ui.mount({ ...backdrop('koster'), surface: 'terminal' })
  expect(await term.find({ type: 'Svg' })).toBe(undefined)
  await term.unmount()
})

test('/look stipple-lake wears Озеро: listed, two states, each under 120000 characters, no script', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect((await $.command.run({ command: 'look', args: 'stipple-lake' })).text).toMatch(/Озеро/)
  expect(sets.at(-1)?.backdrop?.scene).toBe('stipple-lake')
  expect((await $.command.run({ command: 'look', args: 'nope' })).text).toMatch(/stipple-lake/)

  const idle = await $.ui.mount(backdrop('stipple-lake'))
  const resting = String((await idle.find({ type: 'Svg' }))?.props.source)
  await idle.unmount()
  await $.turn.start({ turnId: 't1' })
  const busy = await $.ui.mount(backdrop('stipple-lake'))
  const working = String((await busy.find({ type: 'Svg' }))?.props.source)
  await busy.unmount()

  expect(working).not.toBe(resting)
  for (const svg of [resting, working]) {
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
  }
})

// The desktop app plays a mod's scene only when every element, attribute value and style passes its own lists; a scene
// that fails is drawn with all motion stripped. These are the app's rules, read from the build it loads, so a look that
// must move is held to them here.
const PLAYS = {
  tags: new Set('animate animateMotion animateTransform set circle clipPath defs desc ellipse feBlend feComposite feDropShadow feFlood feGaussianBlur feMerge feMergeNode feOffset filter g line linearGradient marker mask mpath path pattern polygon polyline radialGradient rect stop style svg symbol text textPath title tspan use'.split(' ')),
  fns: new Set('color color-mix hsl hsla hwb lab lch light-dark oklab oklch rgb rgba abs acos asin atan atan2 calc clamp cos exp hypot log max min mod pow rem round sign sin sqrt tan var matrix matrix3d perspective rotate rotate3d rotatex rotatey rotatez scale scale3d scalex scaley scalez skew skewx skewy translate translate3d translatex translatey translatez cubic-bezier linear steps blur drop-shadow grayscale hue-rotate invert opacity saturate sepia is not nth-child nth-last-child nth-last-of-type nth-of-type where'.split(' ')),
  ats: new Set(['keyframes', 'layer', 'media', 'supports']),
}
const cssPlays = (css: string): boolean => {
  if (css.includes('\\') || /(?:\d|\.)(?:[dsl]?v(?:w|h|i|b|min|max)|cq(?:w|h|i|b|min|max))(?![a-z0-9_-])/i.test(css) || /shape-rendering|vector-effect/i.test(css)) return false
  const plain = /\(\s*(?:prefers-reduced-motion(?:\s*:\s*(?:reduce|no-preference))?|prefers-color-scheme(?:\s*:\s*(?:dark|light))?)\s*\)/gi
  const media = [...css.matchAll(/@media([^{]*)(\{|$)/gi)]
  if (!media.every(([, q = '', open]) => open === '{' && /^(?:\s|,|all|and|not|only|or|screen)*$/i.test(q.replaceAll(plain, '')))) return false
  const bare = css.replaceAll(/[\s\p{Cc}]/gu, '').toLowerCase()
  if (bare.includes('data:') || bare.replaceAll(/url\(#[a-z_][\w.:-]*\)/g, '').includes('url(')) return false
  return (
    [...css.matchAll(/([^\s()[\]{}<>;:,'"`=+*/!@#$%^&|~?]{0,64})\(/g)].every(([, f = '']) => f === '' || f.toLowerCase() === 'url' || PLAYS.fns.has(f.toLowerCase())) &&
    [...css.matchAll(/@([^\s{};("'/]*)/g)].every(([, a = '']) => PLAYS.ats.has(a.toLowerCase()))
  )
}
const playsInApp = (svg: string): boolean =>
  [...svg.matchAll(/<([A-Za-z][\w:-]*)/g)].every(([, t]) => PLAYS.tags.has(t)) &&
  [...svg.matchAll(/\s[\w:-]+="([^"]*)"/g)].every(([, v]) => cssPlays(v)) &&
  [...svg.matchAll(/\shref="([^"]*)"/g)].every(([, h]) => /^#[A-Za-z_][\w.:-]*$/.test(h)) &&
  !/\son\w+=/i.test(svg) &&
  // the app reads these two words in attribute names too, and the port above reads double-quoted values only
  !/shape-rendering|vector-effect/i.test(svg) &&
  !/\s[\w:-]+='/.test(svg) &&
  // the app refuses an animation of href, media or style, and of the root's width or height: here, of any width or height
  [...svg.matchAll(/\sattributeName="([^"]*)"/g)].every(([, n]) => !['href', 'media', 'style', 'width', 'height'].includes(n.trim().toLowerCase().replace(/^.*:/s, ''))) &&
  // a style element holds text only
  [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)].every(([, css]) => !css.includes('<') && cssPlays(css))

test('/look gouache-autumn wears Осень: listed, light and dark, leaves fall down both sides at rest and more of them at work, they hang in the air for a client without motion, the lighthouse has its parts, clicks answer, no script', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect((await $.command.run({ command: 'look', args: 'gouache-autumn' })).text).toMatch(/Осень/)
  expect(sets.at(-1)?.backdrop?.scene).toBe('gouache-autumn')
  expect((await $.command.run({ command: 'look', args: 'nope' })).text).toMatch(/gouache-autumn/)

  const idle = await $.ui.mount(backdrop('gouache-autumn'))
  const resting = String((await idle.find({ type: 'Svg' }))?.props.source)
  await idle.unmount()
  await $.turn.start({ turnId: 't1' })
  const busy = await $.ui.mount(backdrop('gouache-autumn'))
  const working = String((await busy.find({ type: 'Svg' }))?.props.source)
  await busy.unmount()

  // a leaf in the air is a group of class "f" that the fall keyframes carry; its style holds the path and the timing
  const leaves = (svg: string) =>
    [...svg.matchAll(/<g class="f[ "][^>]*style="([^"]*)"/g)].map(m => Object.fromEntries(m[1].split(';').map(d => d.split(':'))) as Record<string, string>)
  const falling = (svg: string) => leaves(svg).length
  expect(falling(resting) > 0).toBe(true)
  expect(falling(working) > falling(resting)).toBe(true)
  for (const svg of [resting, working]) {
    const air = leaves(svg)
    // every leaf moves: it has a way down and a time to take it
    expect(air.every(l => parseFloat(l['animation-duration']) > 0 && parseFloat(l['--h']) > 0)).toBe(true)
    // the chat column covers the middle, so both side margins hold leaves. --bx and --by are where a leaf hangs when
    // a client draws the picture with all motion off (the desktop app does, on its own rule)
    // a leaf whose way never crosses a side lane is hidden while still (opacity:0), so none rests behind the chat
    const hang = air.filter(l => l.opacity !== '0').map(l => [parseFloat(l['--bx']), parseFloat(l['--by'])])
    expect(hang.every(([x, y]) => x > 12 && x < 1588 && (x < 420 || x > 1175) && y > 40 && y < 880)).toBe(true)
    expect(hang.filter(([x]) => x < 420).length >= 5).toBe(true)
    expect(hang.filter(([x]) => x > 1175).length >= 5).toBe(true)
    expect(svg).toMatch(/\.f\{transform:translate\(var\(--bx\),var\(--by\)\)/)
    // the lighthouse and the keeper's house stand in the strip that the app's sidebar (open, it covers the left 260 of
    // the picture) and the chat column (it starts near 430 with the sidebar closed) both leave clear
    const hx = Number(svg.match(/<g class="hl"><g transform="translate\((\d+) 0\)">/)?.[1])
    const at = Number(svg.match(/<g transform="translate\((\d+) 590\) scale\(1\.12\)">/)?.[1]) + hx
    expect(at - 96 * 1.12 >= 258 && at + 56 * 1.12 <= 432).toBe(true)
    // the lighthouse: a shaded tower with a red band, windows, a railed gallery, a glazed lamp room, and two beams at night
    const tower = svg.slice(svg.indexOf('<g transform="translate(142 590)'), svg.indexOf('id="lh"'))
    const parts = (cls: string) => tower.split(`class="${cls}"`).length - 1
    // white tower and its shade, red band and red cap, lit windows, lamp room, both beams
    for (const [cls, n] of [['lw', 1], ['ls', 1], ['lr', 2], ['wn', 2], ['ll', 1], ['D bm', 1]] as const) expect(parts(cls) >= n).toBe(true)
    // fine line work: the fence on the brow, the gallery rail, the lamp room's glazing bars, the vane
    expect(parts('lks') >= 4).toBe(true)
    expect(tower.includes('url(#beam)') && tower.includes('url(#beam2)')).toBe(true)
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
    expect(svg).toMatch(/@media \(prefers-color-scheme:dark\)/)
    // the app plays it: nothing in the scene is off the app's lists, and the two things that once were (a grain made with
    // feTurbulence, a re-composition under an aspect-ratio media rule) stop it again
    expect(playsInApp(svg)).toBe(true)
    expect(playsInApp(svg.replace('<defs>', '<defs><filter id="q"><feTurbulence/></filter>'))).toBe(false)
    expect(playsInApp(svg.replace('</style>', '@media (max-aspect-ratio:1/1){.f{opacity:1}}</style>'))).toBe(false)
    expect(playsInApp(svg.replace('</style>', '.f{offset-path:path("M0 0L9 9")}</style>'))).toBe(false)
    expect(playsInApp(svg.replace('attributeName="r"', 'attributeName="style"'))).toBe(false)
    expect(playsInApp(svg.replace('<path ', '<path shape-rendering="crispEdges" '))).toBe(false)
    // a window narrower than the picture keeps its left side, the edge the sidebar is on: the lighthouse, the moon and
    // the left lane of leaves stay in view; the lighthouse's long beam ends inside the strip an open sidebar leaves
    // clear (x below 572), so the chat's edge does not cut it
    expect(svg).toMatch(/^<svg [^>]*preserveAspectRatio="xMinYMid slice"/)
    const reach = Number(svg.match(/<path d="M0 -141L(\d+) [^"]*" fill="url\(#beam\)"\/>/)?.[1])
    expect(at + reach * 1.12 < 572).toBe(true)
    expect(svg).toMatch(/@keyframes fall\{/)
    expect(svg).toMatch(/\.f\{[^}]*animation:fall /)
    for (const zone of ['cr', 'lm', 'bn', 'mn', 'lh']) expect(svg.includes(`id="${zone}"`) && svg.includes(`begin="${zone}.click`)).toBe(true)
  }
})

test('an open chat follows the look another chat stored, and ignores one it does not have', async ($, on) => {
  const sets: Set[] = []
  const store: Record<string, unknown> = {}
  engine(on, sets, store)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(sets.at(-1)?.backdrop?.scene).toBe('koster')

  store.state = { look: 'garden', garden: 5 }
  await $.turn.start({ turnId: 't1' })
  expect(sets.at(-1)?.backdrop?.scene).toBe('garden')

  const count = sets.length
  await $.turn.complete({ turnId: 't1', answer: '', reason: 'done' })
  await $.turn.start({ turnId: 't2' })
  expect(sets.length).toBe(count)

  const drawn = async () => {
    const ui = await $.ui.mount(backdrop('garden'))
    const svg = (await ui.find({ type: 'Svg' }))?.props.source
    await ui.unmount()
    return svg
  }
  const five = await drawn()
  store.state = { look: 'garden', garden: 2 }
  await $.turn.start({ turnId: 't2b' })
  expect(await drawn()).not.toBe(five)
  expect(sets.length).toBe(count)

  store.state = { look: 'a-look-this-copy-lacks' }
  await $.turn.start({ turnId: 't3' })
  expect(sets.at(-1)?.backdrop?.scene).toBe('garden')
  expect(sets.length).toBe(count)
  expect((await $.command.run({ command: 'look', args: '' })).text).toMatch(/Сейчас: Сад привычек/)
})

test('a chat that has not followed yet does not write its old look back', async ($, on) => {
  const store: Record<string, unknown> = {}
  engine(on, [], store)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  store.state = { look: 'garden', garden: 3 }
  await $.command.run({ command: 'look', args: 'set recovery 50' })
  expect(store.state).toEqual({ look: 'garden', garden: 3, recovery: 50 })
})

test('an idle open chat follows too: the timer asked at start runs the same check', async ($, on) => {
  const sets: Set[] = []
  const store: Record<string, unknown> = {}
  engine(on, sets, store)
  const asked: number[] = []
  on('clock.every', (_: unknown, e: any) => {
    asked.push(e.ms)
    if (asked.length > 1) {
      return { deny: 'one period is enough' }
    }
    store.state = { look: 'terracotta' }
    return { value: undefined }
  })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await new Promise(done => setTimeout(done, 50))

  expect(asked).toEqual([4000, 4000])
  expect(sets.at(-1)?.backdrop?.scene).toBe('terracotta')
})

// What the engine answers where nothing draws a theme yet: a terminal chat, or the app before its window attaches.
const WAITS = { isDrawn: false, requestId: 'backdrop', reason: 'no attached desktop or mobile client draws themes yet; the theme stands and draws when one attaches' }

const notices = (on: any) => {
  const seen = { status: [] as unknown[], toasts: [] as string[] }
  on('ui.status', (_: unknown, e: any) => {
    seen.status.push(e.text)
    return { value: undefined }
  })
  on('ui.toast', (_: unknown, e: any) => {
    seen.toasts.push(e.text)
    return { value: undefined }
  })
  on('session.attach', (_: unknown, e: any) => ({ clientId: e.clientId }))
  return seen
}

test('a chat nothing draws in yet gets no warning: the look is set and stored, and /look says where it shows', async ($, on) => {
  const sets: Set[] = []
  const store: Record<string, unknown> = { state: { look: 'garden' } }
  engine(on, sets, store, WAITS)
  const seen = notices(on)
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  expect(sets.at(-1)?.backdrop?.scene).toBe('garden')
  expect(seen.status.length).toBe(0)

  const said = await $.command.run({ command: 'look', args: 'stipple-lake' })
  expect(sets.at(-1)?.backdrop?.scene).toBe('stipple-lake')
  expect((store.state as { look: string }).look).toBe('stipple-lake')
  expect(said.text).toMatch(/Озеро/)
  expect(said.text).toMatch(/рисует приложение на компьютере/)
  expect(/no attached|Не нарисовалась/.test(said.text)).toBe(false)
  expect(seen.status.length).toBe(0)
})

test('a theme the engine refuses is still reported, on the status line at start and in the /look answer', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets, { state: { look: 'garden' } }, { isDrawn: false, reason: 'themes are turned off here' })
  const seen = notices(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(seen.status.at(-1)).toBe('themes are turned off here')

  const said = await $.command.run({ command: 'look', args: 'clay' })
  expect(said.text).toMatch(/Не нарисовалась: themes are turned off here/)
})

// A test cannot hand the mod a palette the colour kit refuses (the mod loads its own copy of the palettes), so the rule is checked where it lives.
test("a palette the desktop app will not paint is reported whatever the engine answers", async () => {
  const refused = "Desktop won't paint this theme, because this text is under 3:1: text-primary on surface-0 is 1.00:1 in light mode"
  expect(faultOf(refused, WAITS)).toBe(refused)
  expect(faultOf(refused, { isDrawn: true, requestId: 'theme' })).toBe(refused)
  expect(faultOf(undefined, WAITS)).toBe(undefined)
  expect(faultOf(undefined, { isDrawn: true, requestId: 'theme' })).toBe(undefined)
  expect(faultOf(undefined, { isDrawn: false, reason: 'themes are turned off here' })).toBe('themes are turned off here')
})

test('Озеро keeps its indigo accent, and no other role moved', async () => {
  const lake = PALETTES['stipple-lake']
  expect(JSON.stringify(lake.roles)).toBe('{"accent":"#2747c9","danger":"#b3303f","success":"#2f7a56","warning":"#8f5a0c","pro":"#6a4fc0"}')
  expect(JSON.stringify(lake.dark.roles)).toBe('{"accent":"#8ea4ff","danger":"#e8707c","success":"#6fc08a","warning":"#e0a43c","pro":"#b39cf0"}')
})

test('a copy with no choice yet says once, when the app shows it, which look it wears and how to change it', async ($, on) => {
  const sets: Set[] = []
  const store: Record<string, unknown> = {}
  engine(on, sets, store, WAITS)
  const seen = notices(on)
  await $.session.start({ cwd: '/', surface: null, isInteractive: false })
  expect(sets.at(-1)?.backdrop?.scene).toBe('koster')
  expect(seen.toasts.length).toBe(0)

  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' })
  expect(seen.toasts.length).toBe(1)
  expect(seen.toasts[0]).toMatch(/Костёр/)
  expect(seen.toasts[0]).toMatch(/\/look/)
  expect(store.state).toBe(undefined)

  await $.session.attach({ surface: 'desktop', clientId: 'desktop:second' })
  expect(seen.toasts.length).toBe(1)
})

test('a copy that has a choice says nothing when the app shows it', async ($, on) => {
  const sets: Set[] = []
  const store: Record<string, unknown> = { state: { look: 'stipple-lake' } }
  engine(on, sets, store, WAITS)
  const seen = notices(on)
  await $.session.start({ cwd: '/', surface: null, isInteractive: false })
  expect(sets.at(-1)?.backdrop?.scene).toBe('stipple-lake')
  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' })
  expect(seen.toasts.length).toBe(0)
  expect(seen.status.length).toBe(0)
})

test('/look ember-core wears Тлеющее ядро in the dark and /look ivory wears Слоновая кость in the light: a spark of lettered tiles right of the chat, a small creature beside the input, a quiet middle, the app plays it, motion off leaves the whole picture, no script', async ($, on) => {
  const sets: any[] = []
  engine(on, sets)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  for (const [id, title, scheme] of [['ember-core', /Тлеющее ядро/, 'dark'], ['ivory', /Слоновая кость/, 'light']] as const) {
    expect((await $.command.run({ command: 'look', args: id })).text).toMatch(title)
    expect(sets.at(-1)?.backdrop?.scene).toBe(id)
    expect(sets.at(-1)?.overrideColorScheme).toBe(scheme)
  }
  const listed = (await $.command.run({ command: 'look', args: 'nope' })).text
  expect(listed).toMatch(/ember-core/)
  expect(listed).toMatch(/ivory/)

  const draw = async (id: string) => {
    const ui = await $.ui.mount(backdrop(id))
    const svg = String((await ui.find({ type: 'Svg' }))?.props.source)
    await ui.unmount()
    return svg
  }
  const resting = { ember: await draw('ember-core'), ivory: await draw('ivory') }
  await $.turn.start({ turnId: 't1' })
  const working = { ember: await draw('ember-core'), ivory: await draw('ivory') }

  const nums = (v: string) => v.trim().split(/\s+/).map(Number)
  // text elements of one family of classes, each with its x and y lists and its own opacity (1 when it has none)
  const texts = (svg: string, cls: RegExp) =>
    [...svg.matchAll(/<text([^>]*)>/g)].map(m => m[1] ?? '').filter(a => cls.test(/class="([^"]*)"/.exec(a)?.[1] ?? ''))
      .map(a => ({ x: nums(/\sx="([^"]*)"/.exec(a)?.[1] ?? ''), y: nums(/\sy="([^"]*)"/.exec(a)?.[1] ?? ''), op: parseFloat(/\sopacity="([^"]*)"/.exec(a)?.[1] ?? '1') }))
  // every corner a tile path reaches (tile paths are M, m, h, v and z only); m moves from the start of the last tile
  const corners = (d: string) => {
    const out: [number, number][] = []
    let sx = 0, sy = 0, x = 0, y = 0
    for (const [, c, a = '', b = ''] of d.matchAll(/([MmhvZz])\s*(-?[\d.]+)?\s*(-?[\d.]+)?/g)) {
      if (c === 'M') { sx = x = +a; sy = y = +b } else if (c === 'm') { sx = x = sx + +a; sy = y = sy + +b } else if (c === 'h') x += +a
      else if (c === 'v') y += +a
      else { x = sx; y = sy }
      out.push([x, y])
    }
    return out
  }

  for (const svg of [...Object.values(resting), ...Object.values(working)]) {
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
    // a narrow window keeps the right side of the picture, where the spark stands
    expect(svg).toMatch(/^<svg [^>]*preserveAspectRatio="xMaxYMid slice"/)

    // the spark: lettered tiles right of the chat column (it ends at x 1282 with the sidebar open, kindling.md), up high
    const spark = texts(svg, /^s[rc]t\d$/)
    const sx = spark.flatMap(t => t.x), sy = spark.flatMap(t => t.y)
    expect(sx.length >= 60).toBe(true)
    expect(sx.every(x => x >= 1290 && x <= 1600) && sy.every(y => y >= 40 && y <= 640)).toBe(true)

    // the creature stands in the strip both layouts leave clear (right of the open sidebar at 260, left of the chat at
    // 430 with the sidebar closed), low, where the input is
    const pet = /<g class="pet" transform="translate\(([\d.]+) ([\d.]+)\)">/.exec(svg)
    expect(pet).not.toBe(null)
    const [px, py] = [parseFloat(pet?.[1] ?? 'NaN'), parseFloat(pet?.[2] ?? 'NaN')]
    const body = svg.slice(svg.indexOf('<g class="pet"'))
    const pts = [...body.matchAll(/<path class="tb p[bfe]\d" [^>]*d="([^"]*)"/g)].flatMap(m => corners(m[1] ?? ''))
    expect(pts.length >= 40).toBe(true)
    expect(pts.every(([x, y]) => px + x >= 262 && px + x <= 430 && py + y >= 700 && py + y <= 990)).toBe(true)

    // the sparks around it and in the margins keep out of the chat column too
    const sparks = texts(svg, /^sp\b/)
    expect(sparks.length >= 3).toBe(true)
    expect(sparks.every(t => t.x.every(x => x < 430 || x > 1282))).toBe(true)
    // nothing behind the chat but the faint grid and a few faint glyphs
    expect(texts(svg, /.*/).filter(t => t.x.some(x => x > 430 && x < 1282)).every(t => t.op <= 0.08)).toBe(true)

    // the app plays it: nothing off its lists (no grain filter, no aspect-ratio media rule, no CSS path()), judged by
    // the port of the app's own check above
    expect(playsInApp(svg)).toBe(true)
    const css = [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1] ?? '').join('')

    // motion off (the app's own rule may strip it): every set of moving frames shows its first, whole frame
    const keys = new Set([...svg.matchAll(/class="q(\w+)_\d+"/g)].map(m => m[1]))
    for (const k of keys) expect(new RegExp(`\\.q${k}_0\\{opacity:1;`).test(css)).toBe(true)
  }

  // at work more of it moves than at rest, and something lives at rest too; light runs out along the spark's rays only
  // while Claude works
  const moving = (svg: string) => (svg.match(/class="q\w+_\d+"/g) ?? []).length
  const sparkMoving = (svg: string) => moving(svg.slice(svg.indexOf('<g class="spark">'), svg.indexOf('<g class="pet"')))
  for (const k of ['ember', 'ivory'] as const) {
    expect(moving(resting[k]) > 0).toBe(true)
    expect(moving(working[k]) > moving(resting[k])).toBe(true)
    expect(sparkMoving(working[k]) > 1).toBe(true)
    expect(sparkMoving(resting[k])).toBe(0)
  }
  // Тлеющее ядро is warm black with the owner's red, orange and acid green; Слоновая кость is ivory with terracotta and
  // lime. Judged on what is painted: the colours of the classes the tile paths use, and the fill of the lime marks
  const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const hsv = (h: string) => {
    const [r = 0, g = 0, b = 0] = rgb(h), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn || 1
    const hue = mx === r ? 60 * (g - b) / d : mx === g ? 60 * (2 + (b - r) / d) : 60 * (4 + (r - g) / d)
    return [(hue + 360) % 360, mx ? (mx - mn) / mx : 0, mx]
  }
  // painted colours of the tile paths whose class matches cls, looked up in the style block
  const painted = (svg: string, cls: RegExp) => {
    const css = [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1] ?? '').join('')
    return [...new Set([...svg.matchAll(/<path class="tb (\w+)"/g)].map(m => m[1] ?? ''))].filter(c => cls.test(c))
      .map(c => new RegExp(`\\.${c}\\{color:(#[0-9a-fA-F]{6})\\}`).exec(css)?.[1] ?? '#000000').map(hsv)
  }
  // the ground's vertical gradient: every stop of the sky behind the scene
  const sky = (svg: string) => [...svg.matchAll(/<linearGradient id="gg[LD]\d+"[^>]*>([\s\S]*?)<\/linearGradient>/g)]
    .flatMap(m => [...(m[1] ?? '').matchAll(/stop-color="(#[0-9a-fA-F]{6})"/g)].map(c => hsv(c[1] ?? '#000000')))
  const warm = ([h]: number[]) => (h ?? 0) <= 40 || (h ?? 0) >= 345
  for (const svg of [...Object.values(resting), ...Object.values(working)]) {
    expect(painted(svg, /^s[rc]\d$/).length > 0 && painted(svg, /./).every(warm)).toBe(true) // no cold tile anywhere
  }
  for (const svg of [resting.ember, working.ember]) {
    expect(sky(svg).length >= 3 && sky(svg).every(([h = 0, , v = 0]) => h <= 40 && v <= 40)).toBe(true) // warm black
    expect(painted(svg, /^s[rc]\d$/).some(([h = 0, s = 0]) => h <= 15 && s >= 0.65)).toBe(true) // red in the spark
    expect(painted(svg, /^s[rc]\d$/).some(([h = 0, s = 0, v = 0]) => h >= 18 && h <= 40 && s >= 0.5 && v >= 200)).toBe(true) // and orange
    expect(svg).toMatch(/\.sp\{fill:#B8FF3C\}/) // acid green marks
  }
  for (const svg of [resting.ivory, working.ivory]) {
    expect(sky(svg).length >= 3 && sky(svg).every(([h = 0, , v = 0]) => h <= 60 && v >= 220)).toBe(true) // ivory
    expect(painted(svg, /^s[rc]\d$/).some(([h = 0, s = 0, v = 0]) => h <= 20 && s >= 0.6 && v >= 180)).toBe(true) // terracotta in the spark
    const [r = 0, g = 0, b = 0] = rgb(/\.sp\{fill:(#[0-9a-fA-F]{6})\}/.exec(svg)?.[1] ?? '#000000')
    expect(g >= 150 && g > r + 40 && g > b + 80).toBe(true) // bright lime marks
  }
})

