// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// «Укиё-э»: an evening bay as an Edo woodblock print. Flat colour inside key-block lines that swell and taper like a
// cut line, graded colour (bokashi) at the top of the sky, at the horizon and along the lower edge of the mist, wood
// grain and paper fibres. Composed as two tall panels beside the chat, like pillar prints: on the left a vermilion gate
// stands in the water and the sun sets between its pillars, a fisherman sits in a skiff below it, the title cartouche
// and seal hang in the corner; on the right a snow mountain rises out of a band of mist, an old pine leans from a
// faceted rock beside a stone lantern, a boat lies off the headland and a wave breaks below the rock. Under the chat
// only calm sea, a low island and sky.
// Night: the moon over the mountain, the lantern and the boat lamps lit. Resting: nearly still, the sail furled.
// Working: the wind rises: mist drifts across the gate and the sun, the fisherman casts his net, the sail is set, more
// crests break and throw spray, the boats pitch, the pine sways, the reflection runs longer and shimmers.
// Light and dark live in one SVG, switched by prefers-color-scheme. Pure string building, nothing off the app's lists.
// A narrow window keeps the left (xMinYMid): the gate, the sun and the cartouche.
// Claude's own figures are printed as an Edo print carries text (the meter, none until Claude Code has a reading): a
// second cartouche beside the title holds the limit windows, each name read down the column (五時間 five hours, 七日
// seven days) and its percent set across it, vermilion from 80; a round seal under it holds the time the five-hour
// window resets; the red seal holds how much of the last turn's input the prompt cache served.
import type { Limit, Meter } from '../../types'
import { curve, limb } from './sakura'

type Pt = [number, number]
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const r0 = (n: number) => Math.round(n)
let rnd = rng(23)
const pts = (p: Pt[]) => p.map(([x, y]) => `${r0(x)} ${r0(y)}`).join('L')
/** Points along a cubic curve from a to d. */
const cub = (a: Pt, b: Pt, c: Pt, d: Pt, n: number): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const u = 1 - t
    const f = (k: number) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]
    return [f(0), f(1)] as Pt
  })

const HZ = 600
// the gate stands in the strip both layouts leave clear on the left (x 260 to 430); the sun sets between its pillars
const GX = 345
// the pine's root and the lantern's foot on the rock, the moon, all in the strip on the right (x 1282 to 1600), and
// left of x 1540, which a window narrower than 16:10 still shows
const PX = 1520
const PY = 712
const LX = 1440
const LY = 734
const MX = 1380
const MY = 170

/** The gate in picture coordinates, absolute points only: two pillars that spread a little toward the water, the tie
 * beam through them, the beam under the top, the dark top beam with its ends turned up, the tablet, dark bands at the
 * feet. */
const GATE =
  `<path class="gt" d="M286 462L302 462L300 770L280 770Z"/><path class="gt" d="M388 462L404 462L410 770L390 770Z"/>` +
  `<path class="gt" d="M268 498L422 498L422 511L268 511Z"/><path class="gt" d="M272 446Q345 466 418 446L418 457Q345 476 272 457Z"/>` +
  `<path class="gk" d="M261 431Q345 455 429 431L427 444Q345 468 263 444Z"/><path class="gk" d="M334 466L356 466L356 496L334 496Z"/>` +
  `<path class="gk" d="M279 742L301 742L301 770L279 770Z"/><path class="gk" d="M389 742L411 742L411 770L389 770Z"/>`

/** A breaking wave, its foot at 0 0: a small swell behind, the body rising to a heavy lip that hooks forward over its
 * own hollow, a foam crown along its back that ends in claws hanging off the lip, flow lines in the water, flecks. */
const CREST =
  `<path class="cb" d="M-60 0C-54 -10 -44 -16 -34 -16C-24 -16 -18 -10 -12 0Z"/>` +
  `<path class="cb" d="M-44 0C-38 -24 -22 -46 0 -60C18 -70 44 -74 60 -64C66 -58 68 -48 64 -40C58 -46 50 -48 42 -44C32 -38 28 -26 36 -12C40 -6 46 -2 52 0Z"/>` +
  `<path class="cl" d="M-36 -4C-28 -24 -14 -40 6 -52M-26 -2C-20 -18 -8 -32 12 -42M-14 0C-10 -10 0 -22 16 -30M-2 0C2 -8 10 -16 22 -22M38 -38C32 -30 32 -20 40 -12M-54 -8C-48 -13 -40 -15 -32 -14"/>` +
  `<path class="cf" d="M-26 -34C-12 -52 8 -64 28 -68C44 -71 60 -66 64 -52L66 -44L61 -47L62 -38L57 -42L56 -33L52 -39L50 -31L47 -38L44 -32L43 -42C40 -50 30 -60 14 -58C0 -56 -12 -46 -26 -34Z"/>` +
  `<path class="cd" d="M54 -26h0M48 -20h0M60 -30h0M42 -14h0M62 -18h0M56 -12h0M66 -24h0"/>`

/** A boat, its waterline at 0 0: a low hull with its bow raised and a man in a hat at the stern. */
const BOAT =
  `<path class="hl" d="M-60 -12Q-58 -2 -44 2L40 2Q54 0 62 -16L56 -14Q50 -8 38 -8L-48 -8Q-56 -8 -60 -12Z"/>` +
  `<path class="fg" d="M-46 -8L-42 -24L-36 -24L-32 -8Z"/><path class="ht" d="M-47 -23L-39 -31L-31 -23Z"/>`
// the sailing boat: at rest its mast lies along the gunwale with the sail stowed on it; while the wind blows the mast
// is stepped and the sail set and full
const FURL = `<path class="ms" d="M-36 -12L42 -15"/><path class="sl" d="M-24 -11L32 -13L31 -20L-23 -18Z"/>`
const SAIL = `<path class="ms" d="M0 -8L0 -80M-26 -76L26 -76"/><path class="sl" d="M-24 -76Q-18 -48 -26 -20L26 -20Q38 -48 24 -76Z"/><path class="sb" d="M-8 -76Q-3 -48 -9 -20M8 -76Q17 -48 9 -20"/>`
// the fisherman's net: gathered on his arm at rest; while the wind blows he casts it and it opens over the water, a
// ring of weights along its rim
const ARM = `<path class="am" d="M-37 -20L-27 -31"/>`
const HELD = `<path class="nf" d="M-28 -31L-21 -12L-31 -14Z"/>`
const RIM = 'M-14 -50A52 17 -12 1 0 88 -72A52 17 -12 1 0 -14 -50Z'
let MESH = ''
for (let c = -120; c <= 120; c += 9) MESH += `M${c - 40} -100L${c + 80} -20M${c + 80} -100L${c - 40} -20`
let WEIGHTS = ''
for (let i = 0; i <= 12; i++) {
  const a = (Math.PI * i) / 12
  const [ex, ey] = [52 * Math.cos(a), 17 * Math.sin(a)]
  WEIGHTS += `M${r0(37 + ex * 0.978 + ey * 0.208)} ${r0(-61 - ex * 0.208 + ey * 0.978)}h0`
}
const CAST = `<g class="nt"><path class="nl" d="M-27 -31Q-24 -50 -12 -56"/><g clip-path="url(#ukn)"><path class="nm" d="${MESH}"/></g><path class="nl" d="${RIM}"/><path class="nw" d="${WEIGHTS}"/></g>`

/** The stone lantern, its foot at 0 0: base, shaft, platform, the light box with its window, the roof, the jewel. */
const LANTERN =
  `<path class="ls" d="M-22 0L22 0L18 -10L-18 -10Z"/><path class="ls" d="M-6 -10L6 -10L5 -44L-5 -44Z"/>` +
  `<path class="ls" d="M-16 -44L16 -44L12 -53L-12 -53Z"/><path class="ls" d="M-12 -53L12 -53L12 -73L-12 -73Z"/>` +
  `<path class="L wn" d="M-6 -57L6 -57L6 -69L-6 -69Z"/><path class="D lw" d="M-6 -57L6 -57L6 -69L-6 -69Z"/>` +
  `<path class="ls" d="M-30 -71Q-18 -75 -10 -86L10 -86Q18 -75 30 -71Q0 -77 -30 -71Z"/><path class="ls" d="M-4 -86Q-7 -93 0 -99Q7 -93 4 -86Z"/>`

// the headland under the pine: angular faces, the shaded ones hatched; its foot well above the wave that breaks below
const ROCK = 'M1650 690L1606 682L1576 692L1548 688L1520 704L1490 708L1462 726L1436 732L1412 756L1396 790L1386 816L1390 840L1408 856L1446 864L1504 868L1572 866L1650 862Z'
const SHADE = 'M1462 726L1436 732L1412 756L1396 790L1386 816L1390 840L1408 856L1446 864L1462 836L1452 806L1466 776L1454 748ZM1576 692L1590 730L1578 770L1602 806L1650 816L1650 690L1606 682Z'
const FACETS = 'M1462 726L1454 748L1466 776L1452 806L1462 836L1446 864M1520 704L1510 744L1524 782L1510 824L1520 866M1576 692L1590 730L1578 770L1602 806L1650 816M1490 708L1484 734L1496 760'

// the mountain on the right: a volcano's cone with a notched summit and concave flanks, narrow enough that all of it
// that shows stands in the strip; its foot sinks into the band of mist; the snow ends in tongues down the gullies
const FL = cub([1308, 508], [1364, 488], [1424, 444], [1458, 378], 14)
const FR = cub([1484, 378], [1522, 444], [1584, 490], [1664, 510], 14)
const PEAK: Pt[] = [[1464, 373], [1471, 377], [1478, 372]]
const MOUNTAIN = `M${pts([...FL, ...PEAK, ...FR])}L1664 514L1308 514Z`
const snowL = FL.filter(([, y]) => y < 432)
const snowR = FR.filter(([, y]) => y < 432)
const DIP = [20, -2, 30, 5, 13, -4, 27, 2, 11, 0, 22]
const TONGUES: Pt[] = DIP.map((d, i) => {
  const [xa, ya] = snowR[snowR.length - 1]
  const [xb, yb] = snowL[0]
  const t = (i + 1) / (DIP.length + 1)
  return [xa + (xb - xa) * t, ya + (yb - ya) * t + d]
})
const SNOW = `M${pts([...snowL, ...PEAK, ...snowR, ...TONGUES])}Z`
const RIDGES = TONGUES.filter((_, k) => k % 2 === 0)
  .map(([x, y]) => `M${r0(x)} ${r0(y + 5)}L${r0(x + (x - 1471) * 0.22)} ${r0(y + 40)}`)
  .join('')

/** A band of mist as printed: a flat tier with slanted ends, a shorter one stacked on top and one hung below, graded
 * toward its lower edge. */
const tier = (a: number, b: number, t: number, s: number, up: boolean) => {
  const k = r0(s * 1.5)
  return up ? `M${a} ${t + s}L${a + k} ${t}L${b - k} ${t}L${b} ${t + s}Z` : `M${a} ${t}L${b} ${t}L${b - k} ${t + s}L${a + k} ${t + s}Z`
}
const mist = (x0: number, x1: number, y: number, h: number) => {
  const w = x1 - x0
  return (
    tier(x0, x1, y, h, true) +
    tier(r0(x0 + w * 0.14), r0(x1 - w * 0.34), r0(y - h * 0.6), r0(h * 0.6), true) +
    tier(r0(x0 + w * 0.42), r0(x1 - w * 0.1), y + h, r0(h * 0.5), false)
  )
}

/** Reflected light on the water under (cx, HZ): broken strokes, narrower toward the eye; the wind draws it longer. Its
 * own generator, so the rest of the print is the same at rest and at work. */
const streaks = (cx: number, w: number, busy: boolean) => {
  const r = rng(cx)
  const rows = [[607, 0.95], [616, 0.8], [627, 0.66], [640, 0.74], [655, 0.5], [672, 0.38], [692, 0.28], [715, 0.22]]
  if (busy) rows.push([740, 0.24], [768, 0.2], [800, 0.16])
  return rows
    .map(([y, f]) => {
      const half = w * f
      const gap = 3 + r() * 7
      return half > 12 ? `M${r0(cx - half)} ${y}L${r0(cx - gap)} ${y}M${r0(cx + gap * 0.6)} ${y}L${r0(cx + half)} ${y}` : `M${r0(cx - half)} ${y}L${r0(cx + half)} ${y}`
    })
    .join('')
}

/** The sea's grain: rows of short arcs, longer and further apart toward the eye; the two classes drift against each
 * other while the wind blows. */
function waves(): string {
  let out = ''
  ;[610, 619, 630, 643, 658, 675, 694, 715, 738, 763, 790, 819, 850, 883, 918, 955, 994].forEach((y, i) => {
    const k = (y - HZ) / 400
    const L = 14 + k * 64
    let d = ''
    for (let x = -40 + rnd() * L; x < 1640; x += L * (1.5 + rnd() * 1.4)) d += `M${r0(x)} ${y + r0((rnd() - 0.5) * 4 * (1 + k * 2))}q${r0(L / 2)} ${-r0(1.5 + k * 6)} ${r0(L)} 0`
    out += `<path class="wv wv${i % 2}" d="${d}" stroke-width="${(1 + k * 2).toFixed(1)}"/>`
  })
  return out
}

/** The pine, its root at 0 0 on the rock: a trunk that leans out over the water and droops at its end, short branches
 * up and to the side, flat pads of needles, each dark below and lighter on top with a fan of needle strokes. Absolute
 * points only. */
function pine(): string {
  const trunk = curve([[0, 0], [-8, -42], [-24, -72], [-50, -96], [-80, -112], [-116, -122], [-150, -128], [-180, -124], [-210, -112]], 8)
  const limbs: [Pt[], number, number][] = [
    [[[-24, -72], [-20, -112], [-8, -146], [10, -172]], 16, 6],
    [[[-150, -128], [-160, -146], [-176, -152]], 8, 3],
    [[[-80, -112], [-70, -136], [-52, -158]], 9, 3],
    [[[-8, -146], [20, -150], [40, -146]], 8, 3],
  ]
  let wood = limb(trunk, 36, 10)
  for (const [p, w0, w1] of limbs) wood += limb(curve(p, 6), w0, w1)
  let bark = ''
  for (const o of [-8, 0, 7]) bark += 'M' + trunk.slice(0, 44).filter((_, k) => k % 3 === 0).map(([x, y], k) => `${r0(x)} ${r0(y + o * (1 - k / 18))}`).join('L')
  // pads: [x, y, half width, height]
  const pads = [[-196, -122, 38, 20], [-150, -142, 44, 22], [-92, -128, 38, 18], [0, -186, 50, 24], [-52, -166, 34, 16], [40, -154, 30, 15]]
  let dark = ''
  let light = ''
  let needles = ''
  for (const [cx, cy, w, h] of pads) {
    dark += `M${cx - w} ${cy}C${cx - w} ${r0(cy - h * 0.9)} ${r0(cx - w * 0.4)} ${cy - h} ${cx} ${cy - h}C${r0(cx + w * 0.4)} ${cy - h} ${cx + w} ${r0(cy - h * 0.9)} ${cx + w} ${cy}`
    for (let k = 0; k < 6; k++) dark += `Q${r0(cx + w - ((2 * k + 1) * w) / 6)} ${r0(cy + h * (0.26 + 0.12 * ((k * 7) % 3)))} ${r0(cx + w - ((k + 1) * w) / 3)} ${cy}`
    dark += 'Z'
    light += `M${r0(cx - w * 0.8)} ${r0(cy - h * 0.42)}C${r0(cx - w * 0.72)} ${r0(cy - h * 0.94)} ${r0(cx + w * 0.72)} ${r0(cy - h * 0.94)} ${r0(cx + w * 0.8)} ${r0(cy - h * 0.42)}Q${cx} ${r0(cy - h * 0.56)} ${r0(cx - w * 0.8)} ${r0(cy - h * 0.42)}Z`
    // needles: a dense fan of short strokes from the pad's heart to its rim
    const n = Math.round(w / 2.6)
    for (let i = 0; i <= n; i++) {
      const x = cx - w * 0.86 + (i * 1.72 * w) / n
      const top = cy - h * (0.62 + 0.3 * Math.cos(((x - cx) / w) * 1.3))
      needles += `M${r0(x - (x - cx) * 0.25)} ${r0(cy - h * 0.05)}L${r0(x)} ${r0(top)}`
    }
  }
  return `<path class="ptk" d="${wood}"/><path class="bk" d="${bark}"/><path class="pd" d="${dark}"/><path class="pl" d="${light}"/><path class="nd" d="${needles}"/>`
}

const MINCHO = 'Hiragino Mincho ProN, Yu Mincho, serif'
const hhmm = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** The limits cartouche right of the title (x 310 to 354) and the round reset seal under it, or nothing with no
 * reading. Each window gets the same cell: its name down the column, a fixed gap, the figure across it with ％. */
function limits({ fiveHour, sevenDay }: Meter): string {
  const rows = ([['五時間', fiveHour], ['七日', sevenDay]] as [string, Limit | undefined][]).filter(([, w]) => w !== undefined) as [string, Limit][]
  if (rows.length === 0) return ''
  let y = 66
  let text = ''
  rows.forEach(([name, w], i) => {
    if (i > 0) text += `<path class="ci" d="M314 ${y}H350"/>`
    y += 2.5
    text += `<text class="tl" font-size="15" text-anchor="middle" font-family="${MINCHO}">${[...name].map(c => `<tspan x="332" y="${(y += 15.5)}">${c}</tspan>`).join('')}</text>`
    // the figure ends where the digits and ％ together sit centred: a Mincho digit is about 0.54 em, ％ here 8 wide
    const n = String(w.used)
    const size = n.length > 2 ? 13 : 20
    const end = Math.round(332 + (n.length * 0.54 * size - 8) / 2)
    text += `<text class="tf${w.used >= 80 ? ' hot' : ''}" x="${end}" y="${(y += 25)}" font-size="${size}" text-anchor="end" font-family="${MINCHO}">${n}</text>`
    text += `<text class="tl tu" x="${end + 1}" y="${y}" font-size="10" font-family="${MINCHO}">％</text>`
    y += 3.75
  })
  const reset = fiveHour?.resetsAt === undefined ? '' : `<g transform="translate(332 236)"><circle class="seal" r="22"/><text class="sk" y="11" font-size="11" text-anchor="middle" font-family="${MINCHO}">${hhmm(fiveHour.resetsAt)}</text><text class="sk" y="-2" font-size="10" text-anchor="middle" font-family="${MINCHO}">時</text></g>`
  return `<rect class="ct" x="310" y="62" width="44" height="${y + 4 - 62}"/><rect class="ci" x="314" y="66" width="36" height="${y - 66}"/>${text}${reset}`
}

// crests: [x, y, scale]; at rest one big wave breaks below the rock and a small one beside it; at work the wind breaks
// more on both sides, always beside the chat, never behind it
const CRESTS: [number, number, number][] = [[1440, 1000, 1.5], [1336, 968, 0.7]]
const WIND: [number, number, number][] = [[290, 958, 0.62], [352, 984, 0.8], [392, 940, 0.42], [1556, 960, 0.55]]
// boats: [x, y, scale]: the fisherman's skiff below the gate, the sailing boat off the headland
const SKIFF: [number, number, number] = [318, 880, 0.62]
const SAILER: [number, number, number] = [1330, 690, 0.55]

export function ukiyoeScene(activity: 'idle' | 'busy' = 'idle', meter: Meter = {}): string {
  rnd = rng(23)
  const busy = activity === 'busy'

  const crests = [...CRESTS, ...(busy ? WIND : [])]
  const crestS = crests
    .map(([x, y, s], i) => `<g class="crest" transform="translate(${x} ${y}) scale(${s})"><g class="cr" style="animation-delay:-${((i * 0.37) % 1.4).toFixed(2)}s"><use href="#cw"/></g></g>`)
    .join('')
  // spray off each lip while the wind blows, from its own generator
  const rs = rng(91)
  const spray = busy
    ? crests
        .map(([x, y, s], i) => {
          let d = ''
          for (let k = 0; k < 7; k++) d += `M${r0(x + s * (30 + rs() * 30))} ${r0(y - s * (40 + rs() * 46))}h0`
          return `<path class="sp" d="${d}" stroke-width="${(2 + s * 2).toFixed(1)}" style="animation-delay:-${((i * 0.29) % 1.7).toFixed(2)}s"/>`
        })
        .join('')
    : ''
  const boat = ([x, y, s]: [number, number, number], i: number, gear: string) =>
    `<g class="boat" transform="translate(${x} ${y}) scale(${s})"><g class="bt" style="animation-delay:-${(i * 1.7).toFixed(1)}s"><use href="#bh"/>${gear}<circle class="D lampg" cx="-52" cy="-16" r="20" fill="url(#lg)"/><circle class="D lamp" cx="-52" cy="-16" r="3.5"/></g></g>`
  const title = (cls: string, s: string) =>
    `<text class="${cls} tt" font-size="19" text-anchor="middle" font-family="Hiragino Mincho ProN, Yu Mincho, serif">${[...s].map((c, i) => `<tspan x="289" y="${88 + i * 25}">${c}</tspan>`).join('')}</text>`

  // moss on the rock's crown
  let moss = ''
  const crown: Pt[] = [[1606, 682], [1576, 692], [1548, 688], [1520, 704], [1490, 708], [1462, 726], [1436, 732], [1412, 756]]
  for (let i = 0; i < crown.length - 1; i++)
    for (let k = 0; k < 3; k++) {
      const t = (k + rnd()) / 3
      moss += `M${r0(crown[i][0] + (crown[i + 1][0] - crown[i][0]) * t)} ${r0(crown[i][1] + (crown[i + 1][1] - crown[i][1]) * t + 5 + rnd() * 6)}h0`
    }
  // hatching for the shaded faces of the rock
  let hatch = ''
  for (let c = 2050; c < 2560; c += 9) hatch += `M1370 ${c - 1370}L1660 ${c - 1660}`
  // paper fibres, the baren's uneven pressure, and the wood grain of the block in the sky: seamless tiles
  let fibres = ''
  for (let i = 0; i < 220; i++) {
    const a = rnd() * Math.PI
    const l = 3 + rnd() * 9
    fibres += `M${r0(rnd() * 240)} ${r0(rnd() * 240)}l${r0(Math.cos(a) * l)} ${r0(Math.sin(a) * l)}`
  }
  let mottle = ''
  for (let i = 0; i < 36; i++) {
    const x = rnd() * 300
    const y = rnd() * 300
    const r = 14 + rnd() * 30
    mottle += `M${r0(x - r)} ${r0(y)}a${r0(r)} ${r0(r * 0.7)} 0 1 0 ${r0(2 * r)} 0a${r0(r)} ${r0(r * 0.7)} 0 1 0 ${-r0(2 * r)} 0`
  }
  let grain = ''
  for (let i = 0; i < 7; i++) {
    const y0 = 7 + i * 13
    grain += `M0 ${y0}`
    for (let x = 20; x <= 640; x += 20) grain += `L${x} ${(y0 + 3 * Math.sin((x / 640) * 4 * Math.PI + i * 1.3) + 1.4 * Math.sin((x / 640) * 14 * Math.PI + i)).toFixed(1)}`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMinYMid slice" width="100%" height="100%">
<style>
.D{display:none}
.sky{fill:#efe4cb}.t0{stop-color:#1f3c6c}.h0{stop-color:#e98a5f}.sea{fill:#2d5489}.z0{stop-color:#1b3767}.v0{stop-color:#a88c5e}
.gr{fill:none;stroke:#7a6648;stroke-width:1.1;opacity:.08}.fb{stroke:#6a5a40;stroke-width:1;opacity:.2}.mt{fill:#5a4a30;opacity:.02}
.ko{fill:none;stroke:#1b1712;stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}.kf{fill:#1b1712}
.sun{fill:#d1381f}.sr{fill:none;stroke:#d1381f;stroke-width:3.4;stroke-linecap:round;opacity:.85}
.fh{fill:#8099ae}.fh2{fill:#647f99}.sh{fill:#6d879c}
.mn{fill:#3d6496}.sn{fill:#f8f3e6}.rg{fill:none;stroke:#7f9ec6;stroke-width:1.8;stroke-linecap:round}
.ks{fill:url(#kg)}.k0{stop-color:#f8f0dc}.k1{stop-color:#eebf9c}
.wv{fill:none;stroke:#dfe9f0;stroke-linecap:round;opacity:.5}
.gt{fill:#c8432b;stroke:#1b1712;stroke-width:2;stroke-linejoin:round}.gk{fill:#1e1c26;stroke:#1b1712;stroke-width:1.4}.rp{fill:none;stroke:#f4f6f2;stroke-width:1.8;stroke-linecap:round;opacity:.75}
.hl{fill:#4a2e1e;stroke:#1b1712;stroke-width:1.8}.ms{fill:none;stroke:#1b1712;stroke-width:2.6;stroke-linecap:round}.sl{fill:#efe6cf;stroke:#1b1712;stroke-width:1.6;stroke-linejoin:round}.sb{fill:none;stroke:#8a7a5c;stroke-width:1.2}.fg{fill:#2a2320}.ht{fill:#c9a25c;stroke:#1b1712;stroke-width:1.2}
.am{stroke:#2a2320;stroke-width:4;stroke-linecap:round}.nf{fill:#8a7a5c;stroke:#1b1712;stroke-width:1.2}
.nl{fill:none;stroke:#f6efdc;stroke-width:2;stroke-linecap:round}.nm{fill:none;stroke:#f6efdc;stroke-width:1.3;opacity:.85}.nw{stroke:#f6efdc;stroke-width:4.4;stroke-linecap:round}
.ptk{fill:#4a3428;stroke:#1b1712;stroke-width:2.2;stroke-linejoin:round}.bk{fill:none;stroke:#1b1712;stroke-width:1.4;opacity:.45}
.pd{fill:#2c4a33;stroke:#1b1712;stroke-width:2;stroke-linejoin:round}.pl{fill:#5f7f4a}.nd{fill:none;stroke:#1a2c1e;stroke-width:1.2;opacity:.65}
.rk{fill:#8d9c88;stroke:#1b1712;stroke-width:2.6;stroke-linejoin:round}.rd{fill:#56676b}.hx{fill:none;stroke:#1b1712;stroke-width:1.2;opacity:.4}.md{fill:none;stroke:#3f6a3a;stroke-width:5;stroke-linecap:round}
.ls{fill:#8e8c82;stroke:#1b1712;stroke-width:1.6;stroke-linejoin:round}.wn{fill:#2a2622}.lw{fill:#ffd27a}
.cb{fill:#25508a;stroke:#1b1712;stroke-width:1.8;stroke-linejoin:round}.cl{fill:none;stroke:#7aa0c8;stroke-width:1.6;stroke-linecap:round}.cf{fill:#f7f6ee;stroke:#1b1712;stroke-width:1;stroke-linejoin:round}.cd{stroke:#f7f6ee;stroke-width:3.4;stroke-linecap:round}
.sp{fill:none;stroke:#f7f6ee;stroke-linecap:round;opacity:.85}
.ct{fill:#ecdfbf;stroke:#b23a22;stroke-width:2}.ci{fill:none;stroke:#b23a22;stroke-width:.8}.tt{fill:#1f1b16}.seal{fill:#b8361f}.sk{fill:#f4ecda}
.tl{fill:#5b4b38}.tf{fill:#1f1b16}.hot{fill:#a8301b}
.moon{fill:#f2e8c6}.mr{fill:none;stroke:#efe3bf;stroke-width:2.6;stroke-linecap:round;opacity:.7}.lamp{fill:#ffd27a}
.bt{animation:rock ${busy ? '1.6s' : '7s'} ease-in-out infinite alternate}
@keyframes rock{from{transform:rotate(-${busy ? 6 : 1}deg)}to{transform:translate(0,${busy ? 3 : 0.5}px) rotate(${busy ? 5 : 1}deg)}}
.cr{animation:cb ${busy ? '1.4s' : '6s'} ease-in-out infinite alternate}
@keyframes cb{from{transform:scale(1)}to{transform:translate(${busy ? 4 : 0}px,${busy ? -6 : -1}px) scale(${busy ? 1.08 : 1.012})}}
.sw{animation:sw ${busy ? '2.6s' : '11s'} ease-in-out infinite alternate}@keyframes sw{from{transform:rotate(${busy ? -1.3 : -0.2}deg)}to{transform:rotate(${busy ? 0.9 : 0.2}deg)}}
.glow,.lampg{animation:fl 2.8s ease-in-out infinite alternate}@keyframes fl{from{opacity:.7}to{opacity:1}}
${busy ? `.wv0{animation:wa 3.6s ease-in-out infinite alternate}.wv1{animation:wa 4.4s ease-in-out -2s infinite alternate-reverse}
@keyframes wa{from{transform:translate(-14px,0)}to{transform:translate(14px,2px)}}
.kd{animation:kd 9s ease-in-out infinite alternate}.kd2{animation:kd 12s ease-in-out -5s infinite alternate-reverse}
@keyframes kd{from{transform:translate(-4px,0)}to{transform:translate(12px,0)}}
.kw{animation:kw 7s ease-in-out -3.5s infinite alternate}@keyframes kw{from{transform:translate(-110px,0)}to{transform:translate(120px,0)}}
.nt{animation:nt 2.4s ease-out infinite}@keyframes nt{0%{transform:scale(.3);opacity:0}25%{opacity:1}75%{transform:scale(1);opacity:1}100%{transform:translate(0,6px) scale(1.02);opacity:0}}
.sr,.mr{animation:sh 1.1s ease-in-out infinite alternate}@keyframes sh{from{opacity:.45}to{opacity:.95}}
.sp{animation:sp 1.7s ease-out infinite}@keyframes sp{0%{transform:translate(0,0);opacity:0}25%{opacity:.95}100%{transform:translate(9px,-16px);opacity:0}}` : ''}
@media (prefers-color-scheme:dark){.D{display:block}.L{display:none}
.sky{fill:#16223a}.t0{stop-color:#03070f}.h0{stop-color:#34507a}.sea{fill:#122039}.z0{stop-color:#08111f}.v0{stop-color:#000}
.gr{stroke:#b8c6dc;opacity:.035}.fb{stroke:#d8ccb4;opacity:.07}.mt{fill:#c8d4e8;opacity:.012}.ko{stroke:#020409}.kf{fill:#020409}
.fh{fill:#23334f}.fh2{fill:#1b2844}.sh{fill:#1c2a43}
.mn{fill:#22385c}.sn{fill:#c3cfdf}.rg{stroke:#35507a}.k0{stop-color:#283a5c}.k1{stop-color:#3d5279}
.wv{stroke:#8fa6c4;opacity:.32}
.gt{fill:#7e2b1c;stroke:#020409}.gk{fill:#0b0a10;stroke:#020409}.rp{stroke:#8fa6c4;opacity:.5}
.hl{fill:#1a120d;stroke:#020409}.ms{stroke:#020409}.sl{fill:#7c7f8a;stroke:#020409}.sb{stroke:#3a3d48}.fg{fill:#0d0b0a}.ht{fill:#5a4a2c;stroke:#020409}
.am{stroke:#0d0b0a}.nf{fill:#3a3428;stroke:#020409}.nl{stroke:#a9bad2}.nm{stroke:#a9bad2}.nw{stroke:#a9bad2}
.ptk{fill:#1a120d;stroke:#020409}.bk{stroke:#000}.pd{fill:#10201a;stroke:#020409}.pl{fill:#1f3427}.nd{stroke:#08120c}
.rk{fill:#2c3846;stroke:#020409}.rd{fill:#1a232f}.hx{stroke:#000;opacity:.5}.md{stroke:#1c2e1c}
.ls{fill:#3a3d46;stroke:#020409}
.cb{fill:#1b3358;stroke:#020409}.cl{stroke:#3d5a82}.cf{fill:#b9c8dc;stroke:#020409}.cd{stroke:#b9c8dc}.sp{stroke:#b9c8dc}
.ct{fill:#c2b393;stroke:#7a2a1a}.ci{stroke:#7a2a1a}.seal{fill:#8f2a18}.sk{fill:#e8dcc0}.tl{fill:#4a3d2d}.hot{fill:#7a1e10}
}
@media (prefers-reduced-motion:reduce){*{animation:none !important}}
</style>
<defs>
<linearGradient id="tb" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="210"><stop offset="0" class="t0" stop-opacity=".96"/><stop offset=".28" class="t0" stop-opacity=".88"/><stop offset="1" class="t0" stop-opacity="0"/></linearGradient>
<linearGradient id="hb" gradientUnits="userSpaceOnUse" x1="0" y1="420" x2="0" y2="${HZ}"><stop offset="0" class="h0" stop-opacity="0"/><stop offset="1" class="h0" stop-opacity=".9"/></linearGradient>
<linearGradient id="sb" gradientUnits="userSpaceOnUse" x1="0" y1="${HZ}" x2="0" y2="700"><stop offset="0" class="z0" stop-opacity=".9"/><stop offset="1" class="z0" stop-opacity="0"/></linearGradient>
<linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="k0"/><stop offset=".55" class="k0"/><stop offset="1" class="k1"/></linearGradient>
<radialGradient id="vig" gradientUnits="userSpaceOnUse" cx="800" cy="480" r="980"><stop offset=".55" class="v0" stop-opacity="0"/><stop offset="1" class="v0" stop-opacity=".45"/></radialGradient>
<radialGradient id="mh"><stop offset="0" stop-color="#efe3bf" stop-opacity=".24"/><stop offset="1" stop-color="#efe3bf" stop-opacity="0"/></radialGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#ffc56a" stop-opacity=".6"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>
<pattern id="fib" patternUnits="userSpaceOnUse" width="240" height="240"><path class="fb" d="${fibres}" fill="none" stroke-linecap="round"/></pattern>
<pattern id="mot" patternUnits="userSpaceOnUse" width="300" height="300"><path class="mt" d="${mottle}"/></pattern>
<pattern id="grn" patternUnits="userSpaceOnUse" width="640" height="92"><path class="gr" d="${grain}"/></pattern>
<clipPath id="ukr"><path d="${SHADE}"/></clipPath><clipPath id="ukn"><path d="${RIM}"/></clipPath>
<g id="tg">${GATE}</g>
<g id="cw">${CREST}</g>
<g id="bh">${BOAT}</g>
</defs>

<rect class="sky" x="-40" width="1680" height="${HZ}"/><rect x="-40" width="1680" height="210" fill="url(#tb)"/><rect x="-40" y="420" width="1680" height="${HZ - 420}" fill="url(#hb)"/>
<rect x="-40" width="1680" height="${HZ}" fill="url(#grn)"/>
<circle class="D" cx="${MX}" cy="${MY}" r="120" fill="url(#mh)"/><circle class="D moon" cx="${MX}" cy="${MY}" r="40"/>
<g class="kd2"><path class="ks" d="${mist(1312, 1560, 238, 10)}"/></g>
<path class="fh" d="M-40 ${HZ}L-40 548Q30 506 96 532Q150 496 212 540Q262 572 300 ${HZ}Z"/><path class="fh2" d="M-40 ${HZ}L-40 574Q40 548 110 570Q170 556 236 ${HZ}Z"/>
<path class="sh" d="M600 ${HZ}Q640 593 700 594Q780 588 860 592Q940 586 1020 591Q1090 589 1150 ${HZ}Z"/>
<path class="mn" d="${MOUNTAIN}"/><path class="rg" d="${RIDGES}"/><path class="sn" d="${SNOW}"/>
<path class="kf" d="${limb([...FL].reverse(), 4, 1.2)}${limb(FR, 4, 1.2)}"/><path class="ko" d="M${pts([FL[FL.length - 1], ...PEAK, FR[0]])}" stroke-width="2"/><path class="ko" d="${SNOW}" stroke-width="1.2"/>
<path class="fh" d="M1298 ${HZ}Q1330 588 1372 585Q1420 577 1468 581Q1530 571 1588 577Q1626 573 1660 579L1660 ${HZ}Z"/>
<g class="kd"><path class="ks" d="${mist(1288, 1680, 494, 22)}"/><path class="ks" d="${mist(-80, 414, 526, 16)}"/></g>
<circle class="L sun" cx="${GX}" cy="${HZ}" r="40"/>
<rect class="sea" x="-40" y="${HZ}" width="1680" height="410"/><rect x="-40" y="${HZ}" width="1680" height="100" fill="url(#sb)"/><path class="ko" d="M-40 ${HZ}L1640 ${HZ}" stroke-width="1.4"/>
<path class="L sr" d="${streaks(GX, 40, busy)}"/><path class="D mr" d="${streaks(MX, 30, busy)}"/>
<use href="#tg" transform="translate(0 1155) scale(1 -.5)" opacity=".22"/>
${waves()}
<use href="#tg"/>
${busy ? `<g class="kw"><path class="ks" d="${mist(-150, 290, 556, 12)}"/></g>` : ''}
<path class="rp" d="M266 774Q290 766 314 774M376 774Q400 766 424 774M272 784Q290 779 308 784M382 784Q400 779 418 784"/>
${boat(SKIFF, 0, ARM + (busy ? CAST : HELD))}${boat(SAILER, 1, busy ? SAIL : FURL)}
<g class="pine" transform="translate(${PX} ${PY})"><g class="sw">${pine()}</g></g>
<path class="rk" d="${ROCK}"/><path class="rd" d="${SHADE}"/><g clip-path="url(#ukr)"><path class="hx" d="${hatch}"/></g>
<path class="ko" d="${FACETS}" stroke-width="1.8"/><path class="ko" d="${ROCK}" stroke-width="2.6"/><path class="md" d="${moss}"/>
<path class="rp" d="M1380 876Q1402 869 1424 876M1456 880Q1480 873 1504 880M1538 878Q1560 871 1582 878"/>
<circle class="D glow" cx="${LX}" cy="${LY - 63}" r="54" fill="url(#lg)"/>
<g class="lantern" transform="translate(${LX} ${LY})">${LANTERN}</g>
${crestS}${spray}
<rect class="ct" x="274" y="62" width="30" height="148"/><rect class="ci" x="278" y="66" width="22" height="140"/>
${title('L', '海辺の夕景')}${title('D', '海辺の月夜')}${limits(meter)}
${
  meter.cache === undefined
    ? `<g transform="translate(276 218)"><rect class="seal" width="26" height="26" rx="2"/><text class="sk" x="13" y="19" font-size="16" text-anchor="middle" font-family="${MINCHO}">絵</text></g>`
    : `<g transform="translate(275 218)"><rect class="seal" width="28" height="36" rx="2"/><text class="sk" x="14" y="31" font-size="${meter.cache > 99 ? 12 : 15}" text-anchor="middle" font-family="${MINCHO}">${meter.cache}</text><text class="sk" x="14" y="13" font-size="11" text-anchor="middle" font-family="${MINCHO}">蔵</text></g>`
}
<rect x="-40" width="1680" height="1010" fill="url(#mot)"/><rect x="-40" width="1680" height="1010" fill="url(#fib)"/><rect x="-40" width="1680" height="1010" fill="url(#vig)"/>
</svg>`
}
