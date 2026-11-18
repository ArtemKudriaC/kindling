import type { Limit, Meter } from '../../types'
import { CITY, STREET } from './cyberpunk-city'

const NEON = { good: '#00e5ff', yellow: '#f5e93a', red: '#ff3b4f', empty: '#1c2633', idle: '#8aa2b2' }
const SEGMENTS = 5
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FONT = 'font-family="ui-monospace,SFMono-Regular,Menlo,monospace"'

const moodOf = (charge: number): string => {
  if (charge <= 0) return 'offline'
  if (charge <= 10) return 'running on fumes'
  if (charge <= 30) return 'drained'
  if (charge <= 55) return 'tired'
  if (charge <= 80) return 'steady'
  return 'fully charged'
}

const colorOf = (charge: number): string => (charge > 50 ? NEON.good : charge > 20 ? NEON.yellow : NEON.red)

const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const when = (at: Date, now: Date): string =>
  at.toDateString() === now.toDateString() ? `at ${hhmm(at)}` : `${DAYS[at.getDay()]} ${at.getDate()} ${hhmm(at)}`

type Gauge = { charge: number; mood: string; color: string; detail: string }

function gauge(meter: Meter, now: Date): Gauge | undefined {
  const windows = [meter.fiveHour, meter.sevenDay].filter((w): w is Limit => w !== undefined)
  if (windows.length === 0) return undefined
  const tightest = windows.reduce((a, b) => (b.used > a.used ? b : a))
  const charge = Math.min(100, Math.max(0, Math.round(100 - tightest.used)))
  const at = tightest.resetsAt === undefined ? undefined : new Date(tightest.resetsAt)
  const detail =
    charge < 100 && at !== undefined && at.getTime() > now.getTime()
      ? `${charge <= 0 ? 'back online' : 'recharge'} ${when(at, now)}`
      : ''
  return { charge, mood: moodOf(charge), color: colorOf(charge), detail }
}

const fit = (text: string, width: number, max: number) => Math.min(max, width / (text.length * 0.6)).toFixed(1)

function billboard(g: Gauge | undefined): string {
  const [x, y, w, h, cut, roof] = [1330, 282, 180, 94, 10, 390]
  const color = g?.color ?? NEON.idle
  const filled = g === undefined ? 0 : Math.ceil(g.charge / (100 / SEGMENTS))
  const frame = `${x},${y + cut} ${x + cut},${y} ${x + w},${y} ${x + w},${y + h - cut} ${x + w - cut},${y + h} ${x},${y + h}`
  const cells = Array.from({ length: SEGMENTS }, (_, i) =>
    `<path class="cell" d="M${(x + 19 + i * 9.6).toFixed(1)} ${y + 30}h7l-4 16h-7z" fill="${i < filled ? color : NEON.empty}"/>`,
  ).join('')
  const name = (fill: string, dx: number, opacity = 1) =>
    `<text x="${x + 10 + dx}" y="${y + 18}" ${FONT} font-size="12" font-weight="800" letter-spacing="1.6" ` +
    `fill="${fill}" fill-opacity="${opacity}">CLAUDE</text>`
  const mood = g === undefined ? 'no signal' : g.mood
  const detail = g === undefined ? 'awaiting first reply' : g.detail
  const low = g !== undefined && g.charge <= 10 ? ' class="low"' : ''
  return (
    `<g class="bat">` +
    `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w * 0.8}" ry="${h * 1.1}" fill="url(#spillY)"/>` +
    `<rect x="${x + 30}" y="${y + h}" width="3" height="${roof - y - h}" fill="#08040f"/>` +
    `<rect x="${x + w - 34}" y="${y + h}" width="3" height="${roof - y - h}" fill="#08040f"/>` +
    `<polygon points="${frame}" fill="#05080d" fill-opacity=".95"/>` +
    `<g class="f" style="animation-delay:-2.9s" filter="url(#neon)">` +
    `<polygon points="${frame}" fill="none" stroke="${NEON.yellow}" stroke-width="1.8"/></g>` +
    `<rect x="${x + w - 54}" y="${y + 8}" width="44" height="6" fill="url(#haz)"/>` +
    `<circle class="b" cx="${x + 3}" cy="${y + 3}" r="1.6" fill="#ff3b5c"/>` +
    `<circle class="b" style="animation-delay:-3.5s" cx="${x + w - 3}" cy="${y - 3}" r="1.6" fill="#ff3b5c"/>` +
    `<g class="gl">${name('#ff3b5c', -1, 0.8)}${name('#00e5ff', 1, 0.8)}${name(NEON.yellow, 0)}</g>` +
    `<g filter="url(#neon)"${low}>` +
    `<path d="M${x + 10} ${y + 30}l4 -4h50v20l-4 4h-50z" fill="none" stroke="${color}" stroke-width="2"/>` +
    `<rect x="${x + 65}" y="${y + 33}" width="3" height="10" fill="${color}"/>${cells}` +
    `<text class="pct" x="${x + 76}" y="${y + 49}" ${FONT} font-size="27" font-weight="800" fill="${color}">` +
    `${g === undefined ? '--%' : `${g.charge}%`}</text></g>` +
    `<text class="mood" x="${x + 10}" y="${y + 70}" ${FONT} font-size="${fit(mood, w - 20, 14)}" font-weight="700" ` +
    `fill="${color}">${mood}</text>` +
    (detail
      ? `<text class="when" x="${x + 10}" y="${y + 86}" ${FONT} font-size="${fit(detail, w - 20, 12.5)}" ` +
        `fill="#fbf39a">${detail}</text>`
      : '') +
    `</g>`
  )
}

export function cyberpunkScene(meter: Meter, now: Date): string {
  return CITY + billboard(gauge(meter, now)) + STREET
}
