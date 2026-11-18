// @ts-nocheck ponytail: the harness fakes partial engine inputs; checked by running, not tsc
import { expect, mock, test } from 'claude-code/testing'

import { PALETTES } from '../hooks/palettes'
import { faultOf } from '../hooks/register'
import { playsInApp } from './plays'

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
  on('session.measure', (_: unknown, e: any) => ({ changed: e.changed }))
}

const backdrop = (scene: string) => ({ plugin: 'kindling', component: 'Backdrop', requestId: 'theme', surface: 'desktop', props: { plugin: 'kindling', scene, glass: {} } }) as const

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
  for (const id of ['koster', 'dark-side', 'terracotta', 'recovery', 'home', 'manuscript', 'training', 'garden', 'month-end', 'hacker', 'clay', 'raster', 'raster-ide', 'raster-code', 'glyph-lighthouse', 'glyph-balloons', 'glyph-dandelion', 'glyph-train', 'stipple-lake', 'gouache-autumn', 'ember-core', 'ivory', 'sakura', 'ukiyo-e', 'cyberpunk']) {
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

  const leaves = (svg: string) =>
    [...svg.matchAll(/<g class="f[ "][^>]*style="([^"]*)"/g)].map(m => Object.fromEntries(m[1].split(';').map(d => d.split(':'))) as Record<string, string>)
  const falling = (svg: string) => leaves(svg).length
  expect(falling(resting) > 0).toBe(true)
  expect(falling(working) > falling(resting)).toBe(true)
  for (const svg of [resting, working]) {
    const air = leaves(svg)
    expect(air.every(l => parseFloat(l['animation-duration']) > 0 && parseFloat(l['--h']) > 0)).toBe(true)
    const hang = air.filter(l => l.opacity !== '0').map(l => [parseFloat(l['--bx']), parseFloat(l['--by'])])
    expect(hang.every(([x, y]) => x > 12 && x < 1588 && (x < 420 || x > 1175) && y > 40 && y < 880)).toBe(true)
    expect(hang.filter(([x]) => x < 420).length >= 5).toBe(true)
    expect(hang.filter(([x]) => x > 1175).length >= 5).toBe(true)
    expect(svg).toMatch(/\.f\{transform:translate\(var\(--bx\),var\(--by\)\)/)
    const hx = Number(svg.match(/<g class="hl"><g transform="translate\((\d+) 0\)">/)?.[1])
    const at = Number(svg.match(/<g transform="translate\((\d+) 590\) scale\(1\.12\)">/)?.[1]) + hx
    expect(at - 96 * 1.12 >= 258 && at + 56 * 1.12 <= 432).toBe(true)
    const tower = svg.slice(svg.indexOf('<g transform="translate(142 590)'), svg.indexOf('id="lh"'))
    const parts = (cls: string) => tower.split(`class="${cls}"`).length - 1
    for (const [cls, n] of [['lw', 1], ['ls', 1], ['lr', 2], ['wn', 2], ['ll', 1], ['D bm', 1]] as const) expect(parts(cls) >= n).toBe(true)
    expect(parts('lks') >= 4).toBe(true)
    expect(tower.includes('url(#beam)') && tower.includes('url(#beam2)')).toBe(true)
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
    expect(svg).toMatch(/@media \(prefers-color-scheme:dark\)/)
    expect(playsInApp(svg)).toBe(true)
    expect(playsInApp(svg.replace('<defs>', '<defs><filter id="q"><feTurbulence/></filter>'))).toBe(false)
    expect(playsInApp(svg.replace('</style>', '@media (max-aspect-ratio:1/1){.f{opacity:1}}</style>'))).toBe(false)
    expect(playsInApp(svg.replace('</style>', '.f{offset-path:path("M0 0L9 9")}</style>'))).toBe(false)
    expect(playsInApp(svg.replace('attributeName="r"', 'attributeName="style"'))).toBe(false)
    expect(playsInApp(svg.replace('<path ', '<path shape-rendering="crispEdges" '))).toBe(false)
    expect(svg).toMatch(/^<svg [^>]*preserveAspectRatio="xMinYMid slice"/)
    const reach = Number(svg.match(/<path d="M0 -141L(\d+) [^"]*" fill="url\(#beam\)"\/>/)?.[1])
    expect(at + reach * 1.12 < 572).toBe(true)
    expect(svg).toMatch(/@keyframes fall\{/)
    expect(svg).toMatch(/\.f\{[^}]*animation:fall /)
    for (const zone of ['cr', 'lm', 'bn', 'mn', 'lh']) expect(svg.includes(`id="${zone}"`) && svg.includes(`begin="${zone}.click`)).toBe(true)
  }
})

test('/look sakura wears Сакура: a shogun-era castle and cherry tree in ink in light and dark, petals fall down both sides at rest and the wind carries more at work, they hang beside the chat for a client without motion, the app plays it, no script', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect((await $.command.run({ command: 'look', args: 'sakura' })).text).toMatch(/Сакура/)
  expect(sets.at(-1)?.backdrop?.scene).toBe('sakura')

  const idle = await $.ui.mount(backdrop('sakura'))
  const resting = String((await idle.find({ type: 'Svg' }))?.props.source)
  await idle.unmount()
  await $.turn.start({ turnId: 't1' })
  const busy = await $.ui.mount(backdrop('sakura'))
  const working = String((await busy.find({ type: 'Svg' }))?.props.source)
  await busy.unmount()

  const petals = (svg: string) =>
    [...svg.matchAll(/<g class="f[ "][^>]*style="([^"]*)"/g)].map(m => Object.fromEntries(m[1].split(';').map(d => d.split(':'))) as Record<string, string>)
  expect(petals(resting).length > 0).toBe(true)
  expect(petals(working).length > petals(resting).length).toBe(true)
  for (const svg of [resting, working]) {
    const air = petals(svg)
    expect(air.every(p => parseFloat(p['animation-duration']) > 0 && parseFloat(p['--h']) > 0)).toBe(true)
    const hang = air.filter(p => p.opacity !== '0').map(p => [parseFloat(p['--bx']), parseFloat(p['--by'])])
    expect(hang.every(([x, y]) => x > 12 && x < 1588 && (x < 420 || x > 1175) && y > 40 && y < 880)).toBe(true)
    expect(hang.filter(([x]) => x < 420).length >= 5).toBe(true)
    expect(hang.filter(([x]) => x > 1175).length >= 5).toBe(true)
    expect(svg).toMatch(/\.f\{transform:translate\(var\(--bx\),var\(--by\)\)/)
    expect(svg).toMatch(/@keyframes fall\{/)
    expect(svg).toMatch(/@media \(prefers-color-scheme:dark\)/)
    expect(svg.includes('class="L sun"') && svg.includes('class="D moon"') && svg.includes('class="D glow"')).toBe(true)
    const keep = Number(svg.match(/<g class="castle" transform="translate\((\d+) /)?.[1])
    const poles = [...svg.matchAll(/<g class="pole" transform="translate\((-?\d+) 0\)">.*?d="M(-?\d+) -\d+h(\d+)/g)].map(m => [Number(m[1]) + Number(m[2]), Number(m[1]) + Number(m[2]) + Number(m[3])])
    expect(poles.length).toBe(2)
    const left = Math.min(-84, ...poles.map(p => p[0]))
    const right = Math.max(84, ...poles.map(p => p[1]))
    expect(keep + left >= 260 && keep + right <= 430).toBe(true)
    const trunk = Number(svg.match(/<g class="tree" transform="translate\((\d+) /)?.[1])
    expect(trunk >= 1282 && trunk <= 1600).toBe(true)
    expect(svg).toMatch(/^<svg [^>]*preserveAspectRatio="xMinYMid slice"/)
    expect(playsInApp(svg)).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
  }
})

test('/look ukiyo-e wears Укиё-э: a woodblock print of a bay, a gate in the water, a pine and a lantern on a rock, in light and dark; the wind raises crests and spray at work and rocks the boats faster; nothing stands behind the chat, the app plays it, no script', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect((await $.command.run({ command: 'look', args: 'ukiyo-e' })).text).toMatch(/Укиё-э/)
  expect(sets.at(-1)?.backdrop?.scene).toBe('ukiyo-e')

  const idle = await $.ui.mount(backdrop('ukiyo-e'))
  const resting = String((await idle.find({ type: 'Svg' }))?.props.source)
  await idle.unmount()
  await $.turn.start({ turnId: 't1' })
  const busy = await $.ui.mount(backdrop('ukiyo-e'))
  const working = String((await busy.find({ type: 'Svg' }))?.props.source)
  await busy.unmount()

  const count = (svg: string, cls: string) => svg.split(`class="${cls}"`).length - 1
  expect(count(working, 'cr') > count(resting, 'cr')).toBe(true)
  expect(count(resting, 'sp')).toBe(0)
  expect(count(working, 'sp') > 0).toBe(true)
  const rock = (svg: string) => Number(svg.match(/\.bt\{animation:rock ([\d.]+)s/)?.[1])
  expect(rock(working) < rock(resting)).toBe(true)

  const xs = (d: string) => [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map(m => Number(m[1]))
  for (const svg of [resting, working]) {
    expect(svg).toMatch(/@media \(prefers-color-scheme:dark\)/)
    expect(['class="L sun"', 'class="D moon"', 'class="D glow"', 'class="D lamp"'].every(c => svg.includes(c))).toBe(true)
    for (const t of ['L tt', 'D tt']) expect(svg.match(new RegExp(`class="${t}"[^>]*>(.*?)</text>`))?.[1]).toMatch(/[぀-ヿ一-鿿]/)
    const gate = xs(svg.match(/<g id="tg">(.*?)<\/g>/)?.[1] ?? '')
    expect(gate.length > 8 && Math.min(...gate) >= 260 && Math.max(...gate) <= 430).toBe(true)
    for (const [cls, inner] of [['pine', '<g class="sw">'], ['lantern', '']]) {
      const m = svg.match(new RegExp(`<g class="${cls}" transform="translate\\((-?\\d+) (-?\\d+)\\)">${inner}(.*?)</g>`))
      const x = xs(m?.[3] ?? '').map(v => v + Number(m?.[1]))
      expect(x.length > 8 && Math.min(...x) >= 1282 && Math.max(...x) <= 1600).toBe(true)
    }
    const half = (id: string) => Math.max(...xs(svg.match(new RegExp(`<g id="${id}">(.*?)</g>`))?.[1] ?? '').map(Math.abs))
    const put = [...svg.matchAll(/<g class="(crest|boat)" transform="translate\((-?\d+) (-?\d+)\) scale\(([\d.]+)\)">/g)]
    expect(put.filter(p => p[1] === 'boat').length >= 2 && put.filter(p => p[1] === 'crest').length >= 2).toBe(true)
    const surge = svg.match(/@keyframes cb\{from\{transform:scale\(1\)\}to\{transform:translate\((-?[\d.]+)px,-?[\d.]+px\) scale\(([\d.]+)\)\}\}/)
    expect(surge).toBeTruthy()
    for (const [, k, x, , s] of put) {
      const w = half(k === 'crest' ? 'cw' : 'bh') * Number(s)
      for (const [dx, sc] of k === 'crest' ? [[0, 1], [Number(surge?.[1]), Number(surge?.[2])]] : [[0, 1]]) {
        const [l, r] = [Number(x) + dx - w * sc, Number(x) + dx + w * sc]
        expect(w > 20 && (r <= 430 || l >= 1282)).toBe(true)
      }
    }
    expect(svg).toMatch(/^<svg [^>]*preserveAspectRatio="xMinYMid slice"/)
    expect(playsInApp(svg)).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
  }
})

const labels = (svg: string) => [...svg.matchAll(/<text class="tl"[^>]*>(.*?)<\/text>/g)].map(m => m[1].replaceAll(/<[^>]*>/g, ''))
const figures = (svg: string) => [...svg.matchAll(/<text class="tf( hot)?"[^>]*>(\d+)<\/text>/g)].map(m => [m[2], m[1] === ' hot'])
const reset = (svg: string) => svg.match(/<circle class="seal"[^>]*\/><text class="sk"[^>]*>([^<]*)<\/text>/)?.[1]
const seal = (svg: string) => svg.match(/<rect class="seal"[^>]*\/><text class="sk"[^>]*>([^<]*)<\/text>/)?.[1]
const hhmm = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
const contrast = (a: number[], b: number[]) => {
  const lum = (c: number[]) => {
    const [r = 0, g = 0, bl = 0] = c.map(v => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const painted = (css: string, classes: string[]) => {
  let fill: string | undefined
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const f = body.match(/(?:^|;)fill:([^;]+)/)?.[1]
    if (f !== undefined && sel.split(',').some(s => classes.includes(s.trim().replace(/^\./, '')))) fill = f
  }
  return fill
}

test('Укиё-э prints Claude\'s limits in a cartouche beside the title, the five-hour reset in a round seal and the last turn\'s cache in the red seal; a passed reset reads 0, also with no new reading; subagents and other looks leave the figures alone', async ($, on) => {
  engine(on, [])
  const clock = mock.clock(on, { now: Date.now() })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'look', args: 'ukiyo-e' })

  const draw = async (scene = 'ukiyo-e') => {
    const ui = await $.ui.mount(backdrop(scene))
    const svg = String((await ui.find({ type: 'Svg' }))?.props.source)
    await ui.unmount()
    return svg
  }
  const usage = (input: number, read: number, written: number) => ({ input_tokens: input, output_tokens: 40, cache_read_input_tokens: read, cache_creation_input_tokens: written, model: 'claude-opus-5-5' })

  const resting0 = await draw()
  await $.turn.start({ turnId: 't0' })
  const working0 = await draw()
  for (const svg of [resting0, working0]) {
    expect(labels(svg)).toEqual([])
    expect(figures(svg)).toEqual([])
    expect(reset(svg)).toBe(undefined)
    expect(seal(svg)).toBe('絵')
  }

  const koster = await draw('koster')
  const fiveResets = new Date(Date.now() + 60_000).toISOString()
  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [
      { kind: 'five_hour', percentUsed: 23.4, resetsAt: fiveResets },
      { kind: 'seven_day', percentUsed: 86, resetsAt: new Date(Date.now() + 5 * 864e5).toISOString() },
      { kind: 'spend_limit', percentUsed: 40 },
    ],
    changed: ['rateLimits'],
  })
  expect(await draw('koster')).toBe(koster)
  await $.turn.complete({ turnId: 't0', answer: '', reason: 'answer', usage: usage(100, 9200, 700) })
  await $.turn.complete({ turnId: 'a0', answer: '', reason: 'answer', agentId: 'a1', usage: usage(5000, 0, 5000) })

  const resting = await draw()
  await $.turn.start({ turnId: 't1' })
  const working = await draw()
  await $.turn.complete({ turnId: 't1', answer: '', reason: 'aborted' })
  for (const svg of [resting, working]) {
    expect(labels(svg)).toEqual(['五時間', '七日'])
    expect(figures(svg)).toEqual([['23', false], ['86', true]])
    expect(reset(svg)).toBe(hhmm(fiveResets))
    expect(seal(svg)).toBe('92')
    const css = svg.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? ''
    const [day, night = ''] = css.split('@media (prefers-color-scheme:dark)')
    expect(night.length > 0).toBe(true)
    for (const scheme of [day, day + night]) {
      const [hot, plain, paper] = [painted(scheme, ['tf', 'hot']), painted(scheme, ['tf']), painted(scheme, ['ct'])].map(c => rgb(c ?? ''))
      expect(hot[0] > 2 * hot[1] && hot[0] > 2 * hot[2]).toBe(true)
      expect(plain[0] > 2 * plain[1]).toBe(false)
      expect(contrast(hot, paper) >= 4.5 && contrast(plain, paper) >= 4.5).toBe(true)
    }
    const boxes = [...svg.matchAll(/<rect class="ct" x="(\d+)" y="\d+" width="(\d+)"/g)].map(m => [Number(m[1]), Number(m[1]) + Number(m[2])])
    expect(boxes.length).toBe(2)
    expect(boxes.every(([l, r]) => l >= 260 && r <= 430)).toBe(true)
    const strip = boxes.reduce((a, b) => (b[0] > a[0] ? b : a))
    const xs = [...svg.matchAll(/<text class="t[lf][^"]*"[^>]*>(.*?)<\/text>/g)].flatMap(m => [...m[0].matchAll(/\sx="(\d+)"/g)].map(x => Number(x[1])))
    expect(xs.length >= 7 && xs.every(x => x > strip[0] && x < strip[1])).toBe(true)
    const round = svg.match(/<g transform="translate\((\d+) \d+\)"><circle class="seal" r="(\d+)"/)
    expect(Number(round?.[1]) - Number(round?.[2]) >= 260 && Number(round?.[1]) + Number(round?.[2]) <= 430).toBe(true)
    expect(playsInApp(svg)).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
  }

  await clock.advance(61_000)
  const spent = await draw()
  expect(figures(spent)).toEqual([['0', false], ['86', true]])
  expect(reset(spent)).toBe(undefined)
  expect(seal(spent)).toBe('92')

  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [
      { kind: 'five_hour', percentUsed: 64, resetsAt: new Date(Date.now() - 60_000).toISOString() },
      { kind: 'seven_day', percentUsed: 12 },
    ],
    changed: ['rateLimits'],
  })
  const passed = await draw()
  expect(figures(passed)).toEqual([['0', false], ['12', false]])
  expect(reset(passed)).toBe(undefined)

  await $.session.measure({ context: { window: 200000 }, rateLimits: [], changed: ['rateLimits'] })
  const none = await draw()
  expect(labels(none)).toEqual([])
  expect(reset(none)).toBe(undefined)
  expect(seal(none)).toBe('92')
})

test('after a reload Укиё-э still draws a passed five-hour reset as 0: the reading survives the reload, its timer does not, and start sets it again', async ($, on) => {
  engine(on, [])
  const clock = mock.clock(on, { now: Date.now() })
  const resetsAt = new Date(Date.now() + 60_000).toISOString()
  let written = false
  on('state.set', (_: unknown, e: any, next: any) => {
    if (e.key === 'meter') written = true
    return next(e)
  })
  on('state.get', async (_: unknown, e: any, next: any) => {
    const r = await next(e)
    return e.key === 'meter' && !written ? { value: { value: { fiveHour: { used: 40, resetsAt }, sevenDay: { used: 10 } }, version: r.value.version } } : r
  })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run({ command: 'look', args: 'ukiyo-e' })
  const draw = async () => {
    const ui = await $.ui.mount(backdrop('ukiyo-e'))
    const svg = String((await ui.find({ type: 'Svg' }))?.props.source)
    await ui.unmount()
    return svg
  }

  const before = await draw()
  expect(figures(before)).toEqual([['40', false], ['10', false]])
  expect(reset(before)).toBe(hhmm(resetsAt))
  await clock.advance(61_000)
  const after = await draw()
  expect(figures(after)).toEqual([['0', false], ['10', false]])
  expect(reset(after)).toBe(undefined)
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
  const texts = (svg: string, cls: RegExp) =>
    [...svg.matchAll(/<text([^>]*)>/g)].map(m => m[1] ?? '').filter(a => cls.test(/class="([^"]*)"/.exec(a)?.[1] ?? ''))
      .map(a => ({ x: nums(/\sx="([^"]*)"/.exec(a)?.[1] ?? ''), y: nums(/\sy="([^"]*)"/.exec(a)?.[1] ?? ''), op: parseFloat(/\sopacity="([^"]*)"/.exec(a)?.[1] ?? '1') }))
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
    expect(svg).toMatch(/^<svg [^>]*preserveAspectRatio="xMaxYMid slice"/)

    const spark = texts(svg, /^s[rc]t\d$/)
    const sx = spark.flatMap(t => t.x), sy = spark.flatMap(t => t.y)
    expect(sx.length >= 60).toBe(true)
    expect(sx.every(x => x >= 1290 && x <= 1600) && sy.every(y => y >= 40 && y <= 640)).toBe(true)

    const pet = /<g class="pet" transform="translate\(([\d.]+) ([\d.]+)\)">/.exec(svg)
    expect(pet).not.toBe(null)
    const [px, py] = [parseFloat(pet?.[1] ?? 'NaN'), parseFloat(pet?.[2] ?? 'NaN')]
    const body = svg.slice(svg.indexOf('<g class="pet"'))
    const pts = [...body.matchAll(/<path class="tb p[bfe]\d" [^>]*d="([^"]*)"/g)].flatMap(m => corners(m[1] ?? ''))
    expect(pts.length >= 40).toBe(true)
    expect(pts.every(([x, y]) => px + x >= 262 && px + x <= 430 && py + y >= 700 && py + y <= 990)).toBe(true)

    const sparks = texts(svg, /^sp\b/)
    expect(sparks.length >= 3).toBe(true)
    expect(sparks.every(t => t.x.every(x => x < 430 || x > 1282))).toBe(true)
    expect(texts(svg, /.*/).filter(t => t.x.some(x => x > 430 && x < 1282)).every(t => t.op <= 0.08)).toBe(true)

    expect(playsInApp(svg)).toBe(true)
    const css = [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1] ?? '').join('')

    const keys = new Set([...svg.matchAll(/class="q(\w+)_\d+"/g)].map(m => m[1]))
    for (const k of keys) expect(new RegExp(`\\.q${k}_0\\{opacity:1;`).test(css)).toBe(true)
  }

  const moving = (svg: string) => (svg.match(/class="q\w+_\d+"/g) ?? []).length
  const sparkMoving = (svg: string) => moving(svg.slice(svg.indexOf('<g class="spark">'), svg.indexOf('<g class="pet"')))
  for (const k of ['ember', 'ivory'] as const) {
    expect(moving(resting[k]) > 0).toBe(true)
    expect(moving(working[k]) > moving(resting[k])).toBe(true)
    expect(sparkMoving(working[k]) > 1).toBe(true)
    expect(sparkMoving(resting[k])).toBe(0)
  }
  const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const hsv = (h: string) => {
    const [r = 0, g = 0, b = 0] = rgb(h), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn || 1
    const hue = mx === r ? 60 * (g - b) / d : mx === g ? 60 * (2 + (b - r) / d) : 60 * (4 + (r - g) / d)
    return [(hue + 360) % 360, mx ? (mx - mn) / mx : 0, mx]
  }
  const painted = (svg: string, cls: RegExp) => {
    const css = [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1] ?? '').join('')
    return [...new Set([...svg.matchAll(/<path class="tb (\w+)"/g)].map(m => m[1] ?? ''))].filter(c => cls.test(c))
      .map(c => new RegExp(`\\.${c}\\{color:(#[0-9a-fA-F]{6})\\}`).exec(css)?.[1] ?? '#000000').map(hsv)
  }
  const sky = (svg: string) => [...svg.matchAll(/<linearGradient id="gg[LD]\d+"[^>]*>([\s\S]*?)<\/linearGradient>/g)]
    .flatMap(m => [...(m[1] ?? '').matchAll(/stop-color="(#[0-9a-fA-F]{6})"/g)].map(c => hsv(c[1] ?? '#000000')))
  const warm = ([h]: number[]) => (h ?? 0) <= 40 || (h ?? 0) >= 345
  for (const svg of [...Object.values(resting), ...Object.values(working)]) {
    expect(painted(svg, /^s[rc]\d$/).length > 0 && painted(svg, /./).every(warm)).toBe(true)
  }
  for (const svg of [resting.ember, working.ember]) {
    expect(sky(svg).length >= 3 && sky(svg).every(([h = 0, , v = 0]) => h <= 40 && v <= 40)).toBe(true)
    expect(painted(svg, /^s[rc]\d$/).some(([h = 0, s = 0]) => h <= 15 && s >= 0.65)).toBe(true)
    expect(painted(svg, /^s[rc]\d$/).some(([h = 0, s = 0, v = 0]) => h >= 18 && h <= 40 && s >= 0.5 && v >= 200)).toBe(true)
    expect(/\.sp\{fill:(#[0-9a-fA-F]{6})\}/.exec(svg)?.[1]).toBe('#B8FF3C')
    expect(svg).toMatch(/class="sp[ "]/)
  }
  for (const svg of [resting.ivory, working.ivory]) {
    expect(sky(svg).length >= 3 && sky(svg).every(([h = 0, , v = 0]) => h <= 60 && v >= 220)).toBe(true)
    expect(painted(svg, /^s[rc]\d$/).some(([h = 0, s = 0, v = 0]) => h <= 20 && s >= 0.6 && v >= 180)).toBe(true)
    const [r = 0, g = 0, b = 0] = rgb(/\.sp\{fill:(#[0-9a-fA-F]{6})\}/.exec(svg)?.[1] ?? '#000000')
    expect(g >= 150 && g > r + 40 && g > b + 80).toBe(true)
  }
})

test('/look cyberpunk wears Киберпанк: a neon city in English with a car and a billboard right of the chat; its battery is what is left of the tightest limit, with a mood and the reset time, and no reading says so; the app plays it, no script', async ($, on) => {
  const sets: Set[] = []
  engine(on, sets)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect((await $.command.run({ command: 'look', args: 'cyberpunk' })).text).toMatch(/^Киберпанк: /)
  expect(sets.at(-1)?.backdrop?.scene).toBe('cyberpunk')
  expect((await $.command.run({ command: 'look', args: 'list' })).text).toMatch(/^cyberpunk: Киберпанк, /m)

  const draw = async () => {
    const ui = await $.ui.mount(backdrop('cyberpunk'))
    const svg = String((await ui.find({ type: 'Svg' }))?.props.source)
    await ui.unmount()
    return svg
  }
  const text = (svg: string, cls: string) => svg.match(new RegExp(`<text class="${cls}"[^>]*>([^<]*)</text>`))?.[1]
  const cells = (svg: string) => [...svg.matchAll(/<path class="cell"[^>]*fill="([^"]+)"/g)].map(m => m[1])
  const lit = (svg: string) => cells(svg).filter(f => f === svg.match(/<text class="pct"[^>]*fill="([^"]+)"/)?.[1]).length
  const board = (svg: string) => ({ pct: text(svg, 'pct'), mood: text(svg, 'mood'), when: text(svg, 'when'), lit: lit(svg) })
  const clock = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const when = (iso: string) => {
    const at = new Date(iso)
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][at.getDay()]
    return at.toDateString() === new Date().toDateString() ? `at ${clock(at)}` : `${day} ${at.getDate()} ${clock(at)}`
  }
  const measure = (five: number, fiveAt: string | undefined, seven: number, sevenAt?: string) =>
    $.session.measure({
      context: { window: 200000 },
      rateLimits: [
        { kind: 'five_hour', percentUsed: five, ...(fiveAt === undefined ? {} : { resetsAt: fiveAt }) },
        { kind: 'seven_day', percentUsed: seven, ...(sevenAt === undefined ? {} : { resetsAt: sevenAt }) },
      ],
      changed: ['rateLimits'],
    })
  const later = (ms: number) => new Date(Date.now() + ms).toISOString()

  const none = await draw()
  expect({ ...board(none), lit: undefined }).toEqual({ pct: '--%', mood: 'no signal', when: 'awaiting first reply', lit: undefined })

  const weekAt = later(5 * 864e5)
  await measure(23.4, later(2 * 36e5), 41, weekAt)
  const steady = await draw()
  expect(board(steady)).toEqual({ pct: '59%', mood: 'steady', when: `recharge ${when(weekAt)}`, lit: 3 })
  expect(cells(none)).toEqual(Array(5).fill(cells(steady)[4]))

  const fiveAt = later(30 * 6e4)
  await measure(92, fiveAt, 41, weekAt)
  const fumes = await draw()
  expect(board(fumes)).toEqual({ pct: '8%', mood: 'running on fumes', when: `recharge ${when(fiveAt)}`, lit: 1 })
  expect(fumes.includes('<g filter="url(#neon)" class="low">')).toBe(true)
  expect(steady.includes('class="low"')).toBe(false)

  await measure(100, fiveAt, 41, weekAt)
  expect(board(await draw())).toEqual({ pct: '0%', mood: 'offline', when: `back online ${when(fiveAt)}`, lit: 0 })

  await measure(64, later(-6e4), 12)
  expect(board(await draw())).toEqual({ pct: '88%', mood: 'fully charged', when: undefined, lit: 5 })

  await measure(0, undefined, 0)
  const full = await draw()
  expect(board(full)).toEqual({ pct: '100%', mood: 'fully charged', when: undefined, lit: 5 })

  for (const svg of [none, steady, fumes, full]) {
    const frame = svg.match(/<g class="bat">[\s\S]*?<polygon points="([^"]+)"/)?.[1] ?? ''
    const xs = frame.split(' ').map(p => Number(p.split(',')[0]))
    expect(xs.length === 6 && Math.min(...xs) >= 1282 && Math.max(...xs) <= 1600).toBe(true)
    const car = svg.match(/<g class="hero"><g transform="translate\(([\d.]+) [\d.]+\) scale\(([\d.]+)\)">/)
    expect(Number(car?.[1]) >= 1282 && Number(car?.[1]) + 303 * Number(car?.[2]) <= 1600).toBe(true)
    expect(svg.includes('<use href="#carBody"/>')).toBe(true)
    const words = [...svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map(m => m[1].replaceAll(/<[^>]*>/g, ''))
    expect(words.length > 10 && words.every(w => /^[A-Za-z0-9 %:\-]*$/.test(w))).toBe(true)
    expect(svg.includes('max-aspect-ratio')).toBe(false)
    expect(playsInApp(svg)).toBe(true)
    expect(svg.length < 120000).toBe(true)
    expect(/<script|javascript:|\son\w+=/i.test(svg)).toBe(false)
  }
})
