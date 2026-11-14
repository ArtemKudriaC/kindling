import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeBackdropGlass, ThemeSetArgs } from 'claude-code'

import type { Activity, LookState } from '../types'
import { makeColors } from './make-colors.js'
import { PALETTES } from './palettes'
import { darkSideScene } from './scenes/dark-side'
import { clayScene } from './scenes/clay'
import { gardenScene } from './scenes/garden'
import { glyphBalloonsScene } from './scenes/glyph-balloons'
import { glyphDandelionScene } from './scenes/glyph-dandelion'
import { glyphLighthouseScene } from './scenes/glyph-lighthouse'
import { glyphTrainScene } from './scenes/glyph-train'
import { hackerScene } from './scenes/hacker'
import { homeScene } from './scenes/home'
import { kosterScene } from './scenes/koster'
import { manuscriptScene } from './scenes/manuscript'
import { monthEndScene } from './scenes/month-end'
import { rasterScene } from './scenes/raster'
import { rasterCodeScene } from './scenes/raster-code'
import { rasterIdeScene } from './scenes/raster-ide'
import { recoveryScene } from './scenes/recovery'
import { stippleLakeScene } from './scenes/stipple-lake'
import { terracottaScene } from './scenes/terracotta'
import { trainingScene } from './scenes/training'

const PLUGIN = 'looks'
const COMMAND = 'look'
const DEFAULT = 'koster' as const

type Look = {
  title: string
  blurb: string
  glass: ThemeBackdropGlass
  /** Redraws when Claude starts or stops working. */
  live?: boolean
  scene: (activity: Activity, state: LookState, now: Date) => string
}

const dayOfYear = (d: Date) => Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 864e5)

const LOOKS = {
  koster: {
    title: 'Костёр',
    blurb: 'угли тлеют, пока Claude ждёт, и разгораются, пока он работает; на «merged» летят искры',
    glass: { blur: 14, tint: '#1B1A18', opacity: 0.55 },
    live: true,
    scene: a => kosterScene(a),
  },
  'dark-side': {
    title: 'Тёмная сторона',
    blurb: 'фигура в плаще с красным клинком: клинок разгорается, пока Claude работает',
    glass: { blur: 16, tint: '#0a0c12', opacity: 0.55 },
    live: true,
    scene: a => darkSideScene(a === 'idle' ? 'idle' : 'busy'),
  },
  terracotta: {
    title: 'Терракота',
    blurb: 'глиняная стена: днём солнечные пятна и тени листьев, вечером свет лампы',
    glass: { blur: 16, opacity: 0.5 },
    scene: () => terracottaScene(),
  },
  recovery: {
    title: 'Восстановление',
    blurb: 'цвет и пульс фона по восстановлению за день; задать: /look set recovery 72',
    glass: { blur: 16, opacity: 0.55 },
    scene: (_a, s) => recoveryScene(s.recovery),
  },
  home: {
    title: 'Умный дом',
    blurb: 'план квартиры тонкими линиями и Raspberry Pi в углу',
    glass: { blur: 14, opacity: 0.55 },
    scene: () => homeScene({ lights: {} }),
  },
  manuscript: {
    title: 'Рукопись',
    blurb: 'пергамент, буквица и новый стих из Библии каждый день',
    glass: { blur: 14, opacity: 0.5 },
    scene: (_a, _s, now) => manuscriptScene(dayOfYear(now)),
  },
  training: {
    title: 'Тренировка',
    blurb: 'дорожка бежит, пока Claude работает; таймер отдыха, пока ждёт вас',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => trainingScene(a === 'idle' ? 'idle' : 'busy'),
  },
  garden: {
    title: 'Сад привычек',
    blurb: 'растение растёт от выполненных за неделю привычек; задать: /look set garden 5',
    glass: { blur: 14, opacity: 0.5 },
    scene: (_a, s) => gardenScene(s.garden ?? 4),
  },
  'month-end': {
    title: 'Конец месяца',
    blurb: 'календарь месяца, сроки ZUS, PIT и JPK проступают ближе к дате',
    glass: { blur: 14, opacity: 0.5 },
    scene: (_a, _s, now) => monthEndScene({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }),
  },
  hacker: {
    title: 'Хакер',
    blurb: 'зелёный терминал: строки бегут, пока Claude работает, и курсор мигает, пока ждёт',
    glass: { blur: 14, tint: '#050a07', opacity: 0.6 },
    live: true,
    scene: a => hackerScene(a === 'idle' ? 'idle' : 'busy'),
  },
  clay: {
    title: 'Глина',
    blurb: 'тёплая слоновая кость и глиняные формы, которые оживают, пока Claude работает',
    glass: { blur: 16, opacity: 0.5 },
    live: true,
    scene: a => clayScene(a === 'idle' ? 'idle' : 'busy'),
  },
  raster: {
    title: 'Растр',
    blurb: 'лаймовые и тёмно-синие пятна в печатном растре и ветка; пока Claude работает, фон плывёт по диагонали',
    glass: { blur: 18, tint: '#0e1210', opacity: 0.6 },
    live: true,
    scene: a => rasterScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'raster-ide': {
    title: 'Растр: IDE',
    blurb: 'растр в цветах IDE и фигурные скобки; клик по краю экрана пускает пиксельную волну, пока Claude работает, по скобкам бежит свет',
    glass: { blur: 18, tint: '#1e1f22', opacity: 0.6 },
    live: true,
    scene: a => rasterIdeScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'raster-code': {
    title: 'Растр: Код',
    blurb: 'растр в цветах Claude Code и ветка с цветами; клик по краю экрана распускает пиксельный цветок, клик по ветке роняет лепестки',
    glass: { blur: 18, tint: '#262624', opacity: 0.6 },
    live: true,
    scene: a => rasterCodeScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'glyph-lighthouse': {
    title: 'Маяк',
    blurb: 'маяк, лодка и море из плиток-символов: утром светлая тема, ночью тёмная с лучом; пока Claude работает, луч бежит и лодка плывёт',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => glyphLighthouseScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'glyph-balloons': {
    title: 'Шары',
    blurb: 'три воздушных шара над холмами из плиток-символов: днём яркие, ночью светятся изнутри; пока Claude работает, горелки горят и шары летят, клик по шару рассыпает его плитки',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => glyphBalloonsScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'glyph-dandelion': {
    title: 'Одуванчики',
    blurb: 'луг из плиток-символов: утром жёлтые одуванчики, в сумерках светящиеся пушистые шары; пока Claude работает, ветер несёт семена, клик по головке сдувает её',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => glyphDandelionScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'glyph-train': {
    title: 'Поезд',
    blurb: 'станция, тоннель и паровоз из плиток-символов: утром ясно, ночью горят окна и фара; пока Claude работает, семафор зелёный и поезд идёт через тоннель, клик по паровозу даёт гудок',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => glyphTrainScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'stipple-lake': {
    title: 'Озеро',
    blurb: 'лесистый склон над озером, написанный точками: утром синий лес и рыбак в оранжевой лодке, ночью луна и фонарь на носу; пока Claude работает, лодка идёт через озеро и тянет след, клик по воде пускает круги и рыбу',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => stippleLakeScene(a === 'idle' ? 'idle' : 'busy'),
  },
} satisfies Record<string, Look>

type LookId = keyof typeof LOOKS
const isLook = (id: unknown): id is LookId => typeof id === 'string' && Object.hasOwn(LOOKS, id)
const lookOf = (id: string): Look => (isLook(id) ? LOOKS[id] : LOOKS[DEFAULT])

const activity = atom({ plugin: 'looks', key: 'activity' } as const, 'idle' as Activity)
const state = atom({ plugin: 'looks', key: 'state' } as const, { look: DEFAULT } as LookState)

const colorsOf = (id: string) => {
  const { theme, problems } = makeColors({ label: lookOf(id).title, ...PALETTES[id] })
  const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
  return { theme, unpainted }
}

async function apply($: EngineInterface, id: string): Promise<string | undefined> {
  const look = lookOf(id)
  const { theme, unpainted } = colorsOf(id)
  const only: 'light' | 'dark' | undefined = PALETTES[id]?.only
  const args: ThemeSetArgs = {
    colors: theme,
    backdrop: { scene: id, glass: look.glass },
    ...(only === undefined ? {} : { overrideColorScheme: only }),
  }
  const set = await $.theme.set(args)
  return unpainted ?? (set.isDrawn ? undefined : set.reason)
}

const list = () =>
  Object.entries(LOOKS)
    .map(([id, l]) => `${id}: ${l.title}, ${l.blurb}`)
    .join('\n')

async function setActivity($: EngineInterface, a: Activity): Promise<void> {
  const s = await read($, state)
  if (lookOf(s.look).live === true && (await read($, activity)) !== a) {
    await update($, activity, () => a)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: COMMAND, description: 'Сменить тему: /look, /look <имя>, /look set recovery|garden <число>' })
    const saved = await $.store.get('state')
    const s: LookState =
      saved !== null && typeof saved === 'object' && isLook((saved as LookState).look)
        ? (saved as LookState)
        : { look: DEFAULT }
    await update($, state, () => s)
    const fault = await apply($, s.look)
    if (fault !== undefined) {
      $.ui.status(fault)
    }
    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const words = e.args.trim().split(/\s+/).filter(Boolean)
    const now = await read($, state)

    if (words.length === 0 || words[0] === 'list') {
      return { text: `Сейчас: ${lookOf(now.look).title}.\n${list()}` }
    }

    if (words[0] === 'set') {
      const field = words[1] ?? ''
      const value = Number(words[2])
      const range = field === 'recovery' ? 100 : field === 'garden' ? 7 : undefined
      if (range === undefined || !Number.isFinite(value) || value < 0 || value > range) {
        return { text: 'Так: /look set recovery 0..100 или /look set garden 0..7' }
      }
      const s = { ...now, [field]: Math.round(value) }
      await update($, state, () => s)
      await $.store.set('state', s)
      return { text: `${field} = ${Math.round(value)}.` }
    }

    const id = (words[0] ?? "").toLowerCase()
    if (!isLook(id)) {
      return { text: `Нет темы «${words[0]}». Есть: ${Object.keys(LOOKS).join(', ')}.` }
    }
    const s = { ...now, look: id }
    await update($, state, () => s)
    await $.store.set('state', s)
    const fault = await apply($, id)
    return { text: `${LOOKS[id].title}: ${LOOKS[id].blurb}.${fault === undefined ? '' : ` Не нарисовалась: ${fault}`}` }
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      await setActivity($, 'busy')
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (e.agentId === undefined) {
      await setActivity($, 'idle')
    }
    return done
  })

  on('session.append', { door: 'response' }, async ($, e, next) => {
    const said = e.message.content.some(b => b.type === 'text' && typeof b.text === 'string' && /\bmerged\b/i.test(b.text))
    if (said && (await read($, state)).look === 'koster') {
      await setActivity($, 'burst')
      void $.clock.after(4000, () => setActivity($, 'busy'))
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.plugin !== PLUGIN || e.surface === 'terminal' || e.surface === 'vscode') {
      return next(e)
    }
    const id = e.props.scene
    if (!isLook(id)) {
      return next(e)
    }
    const look: Look = LOOKS[id]
    const a = look.live === true ? await read($, activity) : 'idle'
    const { Svg } = $.ui.resolve(e)
    return <Svg isInteractive alt={`${look.title}: ${look.blurb}`} source={look.scene(a, await read($, state), new Date())} />
  })
}
