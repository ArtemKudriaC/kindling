import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionRateLimit, ThemeBackdropGlass, ThemeResult, ThemeSetArgs } from 'claude-code'

import type { Activity, LookState, Meter } from '../types'
import { makeColors } from './make-colors.js'
import { PALETTES } from './palettes'
import { darkSideScene } from './scenes/dark-side'
import { clayScene } from './scenes/clay'
import { gardenScene } from './scenes/garden'
import { glyphBalloonsScene } from './scenes/glyph-balloons'
import { glyphDandelionScene } from './scenes/glyph-dandelion'
import { glyphLighthouseScene } from './scenes/glyph-lighthouse'
import { glyphSparkScene } from './scenes/glyph-spark'
import { glyphTrainScene } from './scenes/glyph-train'
import { gouacheAutumnScene } from './scenes/gouache-autumn'
import { sakuraScene } from './scenes/sakura'
import { ukiyoeScene } from './scenes/ukiyo-e'
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

const PLUGIN = 'kindling'
const COMMAND = 'look'
const DEFAULT = 'koster' as const
const FOLLOW_MS = 4000

type Look = {
  title: string
  blurb: string
  glass: ThemeBackdropGlass
  live?: boolean
  meter?: boolean
  scene: (activity: Activity, state: LookState, now: Date, meter: Meter) => string
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
  'gouache-autumn': {
    title: 'Осень',
    blurb: 'ноябрьский холм гуашью: клён роняет листья у фонаря и скамейки с котом, вдали деревня и маяк над заливом; днём туман и бледное солнце, ночью звёзды и месяц; пока Claude работает, ветер несёт листья через всю картину, клик по кроне сыплет листву, фонарь мигает, кот подпрыгивает',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => gouacheAutumnScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'ember-core': {
    title: 'Тлеющее ядро',
    blurb: 'искра из плиток-символов на тёплом чёрном с тонкой сеткой и редкими знаками кода, у поля ввода сидит маленький зверёк; пока Claude работает, по лучам искры бежит свет',
    glass: { blur: 14, tint: '#14110F', opacity: 0.6 },
    live: true,
    scene: a => glyphSparkScene(a === 'idle' ? 'idle' : 'busy', 'ember'),
  },
  ivory: {
    title: 'Слоновая кость',
    blurb: 'та же искра из плиток-символов на слоновой кости; пока Claude работает, по лучам бежит свет, а зверёк у поля ввода шагает на месте',
    glass: { blur: 16, opacity: 0.5 },
    live: true,
    scene: a => glyphSparkScene(a === 'idle' ? 'idle' : 'busy', 'ivory'),
  },
  sakura: {
    title: 'Сакура',
    blurb: 'Япония сёгунов тушью на старой бумаге: замок на холме под красным солнцем, горы в тумане и старая вишня; ночью луна и огни в окнах; пока Claude работает, ветер несёт лепестки через всю картину и треплет знамёна',
    glass: { blur: 14, opacity: 0.55 },
    live: true,
    scene: a => sakuraScene(a === 'idle' ? 'idle' : 'busy'),
  },
  'ukiyo-e': {
    title: 'Укиё-э',
    blurb: 'японская гравюра на дереве: красные ворота в заливе, сквозь них садится солнце, под ними рыбак в лодке; справа снежная гора над полосой тумана, сосна и каменный фонарь на скале, под ней разбивается волна; ночью луна, фонарь и огни лодок; пока Claude работает, поднимается ветер: туман идёт через ворота, ' +
      'рыбак бросает сеть, на лодке ставят парус, гребни и брызги; в картуше рядом с названием лимиты Claude: сколько процентов пятичасового (五時間) и недельного (七日) окна израсходовано, от 80 цифра красная; в круглой печати время, когда сбросится пятичасовое окно; в красной печати доля последнего хода, взятая из кэша',
    glass: { blur: 16, opacity: 0.62 },
    live: true,
    meter: true,
    scene: (a, _s, _now, m) => ukiyoeScene(a === 'idle' ? 'idle' : 'busy', m),
  },
} satisfies Record<string, Look>

type LookId = keyof typeof LOOKS
const isLook = (id: unknown): id is LookId => typeof id === 'string' && Object.hasOwn(LOOKS, id)
const lookOf = (id: string): Look => (isLook(id) ? LOOKS[id] : LOOKS[DEFAULT])

const activity = atom({ plugin: 'kindling', key: 'activity' } as const, 'idle' as Activity)
const state = atom({ plugin: 'kindling', key: 'state' } as const, { look: DEFAULT } as LookState)
const meter = atom({ plugin: 'kindling', key: 'meter' } as const, {} as Meter)

const colorsOf = (id: string) => {
  const { theme, problems } = makeColors({ label: lookOf(id).title, ...PALETTES[id] })
  const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
  return { theme, unpainted }
}

export const faultOf = (unpainted: string | undefined, set: ThemeResult): string | undefined =>
  unpainted ?? (set.isDrawn || set.requestId !== undefined ? undefined : set.reason)

async function apply($: EngineInterface, id: string): Promise<{ fault: string | undefined; isDrawn: boolean }> {
  const look = lookOf(id)
  const { theme, unpainted } = colorsOf(id)
  const only: 'light' | 'dark' | undefined = PALETTES[id]?.only
  const args: ThemeSetArgs = {
    colors: theme,
    backdrop: { scene: id, glass: look.glass },
    ...(only === undefined ? {} : { overrideColorScheme: only }),
  }
  const set = await $.theme.set(args)
  return { fault: faultOf(unpainted, set), isDrawn: set.isDrawn }
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

const WINDOWS = { fiveHour: 'five_hour', sevenDay: 'seven_day' } as const

export const settle = (m: Meter, now: number): Meter => {
  const out = { ...m }
  for (const key of Object.keys(WINDOWS) as (keyof typeof WINDOWS)[]) {
    const at = m[key]?.resetsAt
    if (at !== undefined && Date.parse(at) <= now) {
      out[key] = { used: 0 }
    }
  }
  return out
}

async function setMeter($: EngineInterface, fn: (m: Meter) => Meter): Promise<void> {
  const m = await read($, meter)
  if (JSON.stringify(fn(m)) !== JSON.stringify(m)) {
    await update($, meter, fn)
  }
}

function arm($: EngineInterface, m: Meter, was: Meter = {}): void {
  for (const key of Object.keys(WINDOWS) as (keyof typeof WINDOWS)[]) {
    const at = Date.parse(m[key]?.resetsAt ?? '')
    if (m[key]?.resetsAt !== was[key]?.resetsAt && at > Date.now()) {
      void $.clock.after(at - Date.now(), () => setMeter($, n => settle(n, at)))
    }
  }
}

async function measure($: EngineInterface, rateLimits: readonly SessionRateLimit[]): Promise<void> {
  const limits: Meter = {}
  for (const [key, kind] of Object.entries(WINDOWS) as [keyof typeof WINDOWS, string][]) {
    const w = rateLimits.find(r => r.kind === kind)
    if (w !== undefined) {
      limits[key] = { used: Math.round(w.percentUsed), ...(w.resetsAt === undefined ? {} : { resetsAt: w.resetsAt }) }
    }
  }
  arm($, limits, await read($, meter))
  await setMeter($, m => ({ ...limits, ...(m.cache === undefined ? {} : { cache: m.cache }) }))
}

const stored = (saved: unknown): LookState | undefined =>
  saved !== null && typeof saved === 'object' && isLook((saved as LookState).look) ? (saved as LookState) : undefined

async function follow($: EngineInterface): Promise<void> {
  try {
    const now = await read($, state)
    const s = stored(await $.store.get('state'))
    if (s === undefined || (s.look === now.look && s.recovery === now.recovery && s.garden === now.garden)) {
      return
    }
    await update($, state, () => s)
    if (s.look !== now.look) {
      await apply($, s.look)
    }
  } catch {
    return
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: COMMAND, description: 'Сменить тему: /look, /look <имя>, /look set recovery|garden <число>' })
    const s: LookState = stored(await $.store.get('state')) ?? { look: DEFAULT }
    await update($, state, () => s)
    const { fault } = await apply($, s.look)
    if (fault !== undefined) {
      $.ui.status(fault)
    }
    void $.clock.every(FOLLOW_MS, () => follow($))
    arm($, await read($, meter))
    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const words = e.args.trim().split(/\s+/).filter(Boolean)
    await follow($)
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
      const n = Math.round(value) || 0
      const s = { ...now, [field]: n }
      await $.store.set('state', s)
      await update($, state, () => s)
      return { text: `${field} = ${n}.` }
    }

    const id = (words[0] ?? "").toLowerCase()
    if (!isLook(id)) {
      return { text: `Нет темы «${words[0]}». Есть: ${Object.keys(LOOKS).join(', ')}.` }
    }
    const s = { ...now, look: id }
    await $.store.set('state', s)
    await update($, state, () => s)
    const { fault, isDrawn } = await apply($, id)
    const note =
      fault !== undefined ? ` Не нарисовалась: ${fault}` : isDrawn ? '' : ' Выбор сохранён. Здесь тему не видно: её рисует приложение на компьютере.'
    return { text: `${LOOKS[id].title}: ${LOOKS[id].blurb}.${note}` }
  })

  on('session.attach', { surface: 'desktop' }, async ($, e, next) => {
    const joined = await next(e)
    try {
      if (stored(await $.store.get('state')) === undefined && (await $.store.get('greeted')) !== true) {
        await $.store.set('greeted', true)
        $.ui.toast(`Тема «${LOOKS[DEFAULT].title}». Другие: /${COMMAND}`)
      }
    } catch {
    }
    return joined
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      await follow($)
      await setActivity($, 'busy')
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (e.agentId === undefined) {
      await setActivity($, 'idle')
      const u = e.usage
      const input = u === undefined ? 0 : u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens
      if (u !== undefined && input > 0) {
        await setMeter($, m => ({ ...m, cache: Math.round((100 * u.cache_read_input_tokens) / input) }))
      }
    }
    return done
  })

  on('session.measure', async ($, e, next) => {
    const done = await next(e)
    await measure($, e.rateLimits)
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
    const now = new Date()
    const m = look.meter === true ? settle(await read($, meter), now.getTime()) : {}
    const { Svg } = $.ui.resolve(e)
    return <Svg isInteractive alt={`${look.title}: ${look.blurb}`} source={look.scene(a, await read($, state), now, m)} />
  })
}
