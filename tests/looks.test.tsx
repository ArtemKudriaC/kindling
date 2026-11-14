import { expect, test } from 'claude-code/testing'

type Set = { backdrop?: { scene?: string } }

const engine = (on: any, sets: Set[], store: Record<string, unknown> = {}) => {
  on('command.register', (_: unknown, e: any) => ({ value: { command: e.name } }))
  on('theme.set', (_: unknown, e: any) => {
    sets.push(e)
    return { value: { isDrawn: true, requestId: 'theme' } }
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
