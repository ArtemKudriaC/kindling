// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Home: an invented flat as a fine blueprint line drawing (top view), standing along the left edge.
// A room whose light is on fills with a soft lamp-amber glow. A small Raspberry Pi board sits in the
// bottom-right corner, its outline cool -> warm -> red with the CPU temperature (40 -> 55 -> 70 C).
// Pure string building, deterministic.

export const HOME_ROOMS: string[] = ['kitchen', 'living', 'bath', 'hall', 'bedroom']

type Pt = [number, number]
const ROOMS: Record<string, { name: string; poly: Pt[]; label: Pt; lamp: Pt }> = {
  kitchen: { name: 'Кухня', label: [.62, 1.4], lamp: [1.8, 1.3],
    poly: [[0,0],[3.6,0],[3.6,2.8],[0,2.8]] },
  living: { name: 'Гостиная', label: [9.3,1.4], lamp: [7,1.4],
    poly: [[3.6,0],[10.4,0],[10.4,2.8],[3.6,2.8]] },
  bath: { name: 'Санузел', label: [.62,4.1], lamp: [1.1,4],
    poly: [[0,2.8],[2.2,2.8],[2.2,5.4],[0,5.4]] },
  hall: { name: 'Прихожая', label: [2.75,4.1], lamp: [3.4,4.2],
    poly: [[2.2,2.8],[4.6,2.8],[4.6,5.4],[2.2,5.4]] },
  bedroom: { name: 'Спальня', label: [9.3,4.1], lamp: [7.5,4.1],
    poly: [[4.6,2.8],[10.4,2.8],[10.4,5.4],[4.6,5.4]] },
}
const OUTLINE: Pt[] = [[0,0],[10.4,0],[10.4,5.4],[0,5.4]]
const PARTS: [number, number, number, number, number][] = [
  [0,2.8,10.4,2.8,.08],[3.6,0,3.6,2.8,.08],[2.2,2.8,2.2,5.4,.08],[4.6,2.8,4.6,5.4,.08],
]
const GAPS: number[][] = [[3,5.2,3.9,5.6],[2.05,3.5,2.35,4.3],[2.4,2.65,3.3,2.95],[3.75,2.65,4.5,2.95],[4.45,3.3,4.75,4.2]]
// [x0,y0,x1,y1,kind] r rug, b bed, t tub, o other furniture
const FURN: (number | string)[][] = [
  [.1,.1,3.5,.7,'o'],[.1,.7,.7,2,'o'],[1.6,1.3,2.9,2.1,'o'],
  [5,.15,7.4,1,'o'],[4.8,.9,7.8,2.4,'r'],[5.8,1.3,6.9,1.9,'o'],[9.9,.3,10.3,2.4,'o'],[8.2,.1,9.6,.7,'o'],
  [.1,4.6,2.1,5.3,'t'],[.1,3,.6,3.6,'o'],[.1,3.75,.7,4.3,'o'],[4,4.3,4.5,5.3,'o'],[2.3,4.5,2.8,5.3,'o'],
  [6.6,2.9,8.3,4.9,'b'],[6.15,2.9,6.55,3.3,'o'],[8.35,2.9,8.75,3.3,'o'],[9.8,3,10.3,5.2,'o'],[6.3,4.1,8.6,5.2,'r'],[5,4.8,6.2,5.3,'o'],
]
const ROUND: number[][] = [[4.05,.45,.28],[8.7,1.85,.38],[9.35,5,.22],[3.1,1,.22]]
const WIN: [number, number, number, number][] = [[-.3,.6,0,2.2],[10.4,.5,10.7,2.3],[10.4,3.2,10.7,4.9]]

const mixc = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t)
const hex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const path = (p: Pt[]) => 'M' + p.map((q) => q.join(' ')).join(' L') + ' Z'
const smooth = (t: number) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t) }

export function homeScene(state: { lights: Record<string, boolean>; piTemp?: number }): string {
  const lights = (state && state.lights) || {}
  const t = state ? state.piTemp : undefined
  const known = typeof t === 'number' && isFinite(t)
  const S = 52, TX = 1449, TY = 87 // plan metres -> px, rotated 90 deg clockwise, left column, ~90% of height
  const nOn = HOME_ROOMS.filter((k) => lights[k]).length

  const glows = Object.keys(ROOMS).filter((k) => lights[k]).map((k, i) => {
    const r = ROOMS[k]
    return `<g class="glow" style="animation-delay:-${(i * 2.3).toFixed(1)}s">
<path d="${path(r.poly)}" fill="url(#lamp${k})"/>
<circle cx="${r.lamp[0]}" cy="${r.lamp[1]}" r=".9" fill="url(#dot)"/>
<circle cx="${r.lamp[0]}" cy="${r.lamp[1]}" r=".1" fill="#fff4dc"/></g>`
  }).join('')
  const grads = Object.keys(ROOMS).map((k) => {
    const r = ROOMS[k]
    return `<radialGradient id="lamp${k}" gradientUnits="userSpaceOnUse" cx="${r.lamp[0]}" cy="${r.lamp[1]}" r="3.2"><stop offset="0" stop-color="#ffdc9c" stop-opacity=".97"/><stop offset=".6" stop-color="#f5ae48" stop-opacity=".74"/><stop offset="1" stop-color="#ec9a3c" stop-opacity=".58"/></radialGradient>`
  }).join('')
  const floors = Object.keys(ROOMS).map((k, i) => `<path d="${path(ROOMS[k].poly)}" fill="${['#16263f', '#1a2c47', '#1e3250', '#152540', '#132139'][i]}"/>`).join('')

  const WALL = '#2e4470'
  const parts = PARTS.map(([a, b, c, d, w]) => `<path d="M${a} ${b} L${c} ${d}" stroke-width="${(w + .07).toFixed(2)}"/>`).join('')
  const mask = `<mask id="wm" maskUnits="userSpaceOnUse" x="-2" y="-2" width="18" height="10"><rect x="-2" y="-2" width="18" height="10" fill="#fff"/>${GAPS.map((g) => `<rect x="${g[0]}" y="${g[1]}" width="${g[2] - g[0]}" height="${g[3] - g[1]}" fill="#000"/>`).join('')}</mask>`

  const furn = FURN.map((f) => {
    const [x0, y0, x1, y1, k] = f as any
    const w = (x1 - x0).toFixed(2), h = (y1 - y0).toFixed(2)
    const op = k === 'r' ? .05 : .1
    const rx = k === 't' ? .3 : .05
    let extra = ''
    if (k === 'b') extra = `<rect x="${x0 + .1}" y="${y0 + .1}" width=".6" height=".3" rx=".08" opacity=".1"/><rect x="${x1 - .7}" y="${y0 + .1}" width=".6" height=".3" rx=".08" opacity=".1"/>`
    return `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${rx}" opacity="${op}"/>${extra}`
  }).join('') + ROUND.map((c) => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" opacity=".1"/>`).join('')

  const wins = WIN.map(([x0, y0, x1, y1]) => `<rect x="${Math.min(x0, x1) + .06}" y="${y0}" width="${(Math.abs(x1 - x0) - .12).toFixed(2)}" height="${y1 - y0}" rx=".05" fill="#7fb4d6" opacity=".6"/>`).join('')
  const DOORS = 'M3 5.4 V4.5 A.9 .9 0 0 1 3.9 5.4Z M2.2 3.5 H1.4 A.8 .8 0 0 0 2.2 4.3Z M2.4 2.8 V1.9 A.9 .9 0 0 1 3.3 2.8Z M4.5 2.8 V2.05 A.75 .75 0 0 0 3.75 2.8Z M4.6 3.3 H5.5 A.9 .9 0 0 1 4.6 4.2Z'
  const leaf = `<g stroke="#a9bfe4" stroke-width=".07" stroke-linecap="round"><path d="M3 5.4 V4.5 M2.2 3.5 H1.4 M2.4 2.8 V1.9 M4.5 2.8 V2.05 M4.6 3.3 H5.5"/></g>
<g fill="#9db8e6" opacity=".07"><path d="${DOORS}"/></g>`

  const labels = Object.keys(ROOMS).filter((k) => lights[k]).map((k) => {
    const r = ROOMS[k], w = (r.name.length * .15 + .34).toFixed(2)
    return `<g transform="translate(${r.label[0]} ${r.label[1]}) rotate(-90)"><rect x="-${(+w / 2).toFixed(2)}" y="-.25" width="${w}" height=".38" rx=".19" fill="#150e06" opacity=".62"/><text y=".03" text-anchor="middle" font-size=".24" font-weight="600" fill="#fff0d2">${r.name}</text></g>`
  }).join('')

  // Pi readout
  const COOL = [104, 176, 232], WARM = [244, 184, 78], HOT = [236, 86, 72], NEUT = [128, 148, 178]
  const tc = !known ? NEUT : t! <= 55 ? mixc(COOL, WARM, smooth((t! - 40) / 15)) : mixc(WARM, HOT, smooth((t! - 55) / 15))
  const pc = hex(tc), pcl = hex(mixc(tc, [255, 255, 255], .45)), pcd = hex(mixc(tc, [14, 24, 44], .55))
  const heat = known ? smooth(((t as number) - 40) / 30) : 0
  const hot = known && (t as number) >= 68
  const gpio = Array.from({ length: 20 }, (_, i) => `<circle cx="${17.5 + i * 3.6}" cy="4.2" r="1" /><circle cx="${17.5 + i * 3.6}" cy="7.4" r="1"/>`).join('')
  const pi = `<g transform="scale(2)"><ellipse cx="42" cy="28" rx="${90 + heat * 40}" ry="${60 + heat * 30}" fill="url(#pig)" class="${hot ? 'hotpi' : 'piglow'}" opacity="${known ? .7 + heat * .3 : .3}"/>
<rect x="1" y="2" width="85" height="56" rx="5" fill="#000" opacity=".35" filter="url(#bl)"/>
<rect width="85" height="56" rx="5" fill="url(#pcb)" stroke="${pc}" stroke-width="1.3"/>
<rect x=".7" y=".7" width="83.6" height="26" rx="4.5" fill="#fff" opacity=".07"/>
${[[3.5, 3.5], [61.5, 3.5], [3.5, 52.5], [61.5, 52.5]].map((h) => `<circle cx="${h[0]}" cy="${h[1]}" r="2.7" fill="#0a1424" stroke="${pcd}" stroke-width=".8"/>`).join('')}
<rect x="14.5" y="1.8" width="72" height="8.6" rx="1" fill="#0c1628" stroke="#2e4570" stroke-width=".5"/><g fill="#e6c06a">${gpio}</g>
<circle cx="36" cy="26" r="15" fill="url(#chipg)" class="chip"/>
<rect x="28.5" y="18.5" width="15" height="15" rx="1.8" fill="url(#chip)" stroke="${pcl}" stroke-width=".6"/>
<rect x="47" y="22" width="8" height="8" rx="1" fill="#26395c"/><rect x="58" y="35" width="9" height="9" rx="1" fill="#26395c"/>
<rect x="66" y="12" width="20.5" height="17" rx="1.5" fill="url(#port)"/><rect x="66" y="31" width="20.5" height="17" rx="1.5" fill="url(#port)"/>
<rect x="-2" y="22" width="10" height="14" rx="1.5" fill="url(#port)"/>
<rect x="22" y="49" width="7" height="8" rx="1" fill="#b4c4de"/><rect x="34" y="49" width="7" height="8" rx="1" fill="#b4c4de"/><rect x="46" y="50" width="6" height="7" rx="1" fill="#b4c4de"/>
</g>`
  const num = known ? (Math.floor(t! * 10) / 10).toFixed(1) : '--'
  const [ip, fp] = num.split('.')
  const fig = known
    ? `<text font-size="64" font-weight="600" letter-spacing="-3" fill="${pcl}">${ip}<tspan font-size="32" font-weight="500" letter-spacing="0" fill="${pc}" opacity=".62">.${fp} °C</tspan></text>`
    : `<text font-size="64" font-weight="600" letter-spacing="-3" fill="#8fa4c4">--</text>`
  const caption = `<text y="32" font-size="18" fill="#c4d3ec">${known ? 'Процессор Pi' : 'Нет данных'}</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
text{font-family:'SF Pro Display','SF Pro Text',-apple-system,'Helvetica Neue',system-ui,sans-serif}
.glow{animation:br 11s ease-in-out infinite}
@keyframes br{0%,100%{opacity:.86}50%{opacity:1}}
.piglow{animation:br 9s ease-in-out infinite}
.hotpi{animation:hp 3.4s ease-in-out infinite}
@keyframes hp{0%,100%{opacity:.6}50%{opacity:1}}
.chip{animation:br 6s ease-in-out infinite}
.plan{transform-origin:0 0}
@media (max-aspect-ratio:1/1){
.plan{transform:translate(-532px,-41px)}
.pib{transform:translate(659px,745px) scale(.55)}
.pif{transform:translate(776px,796px) scale(.88)}
.pic{display:none}
}
@media (prefers-reduced-motion: reduce){*{animation:none !important}}
</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1c36"/><stop offset="1" stop-color="#0a1529"/></linearGradient>
<radialGradient id="l1" cx=".8" cy=".5" r=".45"><stop offset="0" stop-color="#2f5598" stop-opacity=".5"/><stop offset="1" stop-color="#2f5598" stop-opacity="0"/></radialGradient>
<radialGradient id="l2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1d3763" stop-opacity=".55"/><stop offset="1" stop-color="#1d3763" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#050b16" stop-opacity="0"/><stop offset="1" stop-color="#050b16" stop-opacity=".55"/></radialGradient>
<radialGradient id="pig"><stop offset="0" stop-color="${pc}" stop-opacity=".5"/><stop offset=".6" stop-color="${pc}" stop-opacity=".14"/><stop offset="1" stop-color="${pc}" stop-opacity="0"/></radialGradient>
<radialGradient id="dot"><stop offset="0" stop-color="#ffe3b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffc060" stop-opacity="0"/></radialGradient>
<linearGradient id="pcb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3558"/><stop offset="1" stop-color="#11203a"/></linearGradient>
<radialGradient id="chipg"><stop offset="0" stop-color="${pc}" stop-opacity=".75"/><stop offset="1" stop-color="${pc}" stop-opacity="0"/></radialGradient>
<linearGradient id="chip" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${pcl}"/><stop offset="1" stop-color="${pc}"/></linearGradient>
<linearGradient id="port" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2eaf8"/><stop offset="1" stop-color="#8ea3c6"/></linearGradient>
<filter id="bl"><feGaussianBlur stdDeviation="2.5"/></filter>
<filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .75  0 0 0 0 .85  0 0 0 0 1  0 0 0 .07 0"/></filter>
${grads}
${mask}
<clipPath id="out"><path clip-rule="evenodd" d="M-3 -3 H16 V9 H-3 Z ${path(OUTLINE)}"/></clipPath>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<rect width="1600" height="1000" fill="url(#l1)"/>
<rect x="300" y="-100" width="1000" height="1200" fill="url(#l2)"/>
<g class="plan"><g transform="translate(${TX} ${TY}) rotate(90) scale(${S})">
${floors}
${glows}
<g fill="#9db8e6">${furn}</g>
<g mask="url(#wm)">
<path d="${path(OUTLINE)}" stroke="${WALL}" stroke-width=".66" fill="none" clip-path="url(#out)"/>
<g stroke="${WALL}">${parts}</g>
</g>
${wins}${leaf}${labels}
</g></g>
<g class="pib" transform="translate(1116 804)">${pi}</g>
<g class="pif" transform="translate(1314 866)">${fig}</g>
<g class="pic" transform="translate(1314 866)">${caption}</g>
<rect width="1600" height="1000" filter="url(#gr)"/>
<rect width="1600" height="1000" fill="url(#vig)"/>
</svg>`
}
