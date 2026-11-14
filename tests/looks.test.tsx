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
  for (const id of ['koster', 'dark-side', 'terracotta', 'recovery', 'home', 'manuscript', 'training', 'garden', 'month-end', 'hacker', 'clay', 'raster', 'raster-ide', 'raster-code', 'glyph-lighthouse', 'glyph-balloons', 'glyph-dandelion', 'glyph-train', 'stipple-lake']) {
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
