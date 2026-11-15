// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// «Сакура»: Japan of the shoguns in ink on old paper. A castle keep stands on a hill under a red sun (the moon at night),
// far mountains fade into mist, and an old cherry tree leans in from the right; a branch reaches in at the top left.
// Resting: petals drift down one by one. Working: the wind takes them across, the tree sways, the banners fly.
// Light and dark live in one SVG, switched by prefers-color-scheme. Pure string building.
// Like «Осень» (gouache-autumn.ts) it holds nothing off the app's lists, so the app plays it: no feTurbulence, no media
// rule on the window's shape. A narrow window keeps the left (xMinYMid): the castle, the sun and the left lane of petals.

const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const r0 = (n: number) => Math.round(n)
let rnd = rng(17)

// the castle on its hill, in the strip both layouts leave clear on the left (x 260 to 430)
const CX = 345
const CY = 735
// the sun, or the moon, above it
const SX = 330
const SY = 205
// the foot of the cherry tree, in the strip on the right (x 1282 to 1600)
const TX = 1462
const TY = 912

type Pt = [number, number]

/** A brush stroke along pts, as one path; widths taper from w0 to w1 by drawing it in short pieces. */
function stroke(pts: Pt[], w0: number, w1: number, cls: string): string {
  let out = ''
  const n = pts.length - 1
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    const w = w0 + ((w1 - w0) * i) / Math.max(1, n - 1)
    out += `<path class="${cls}" d="M${r0(ax)} ${r0(ay)}L${r0(bx)} ${r0(by)}" stroke-width="${w.toFixed(1)}"/>`
  }
  return out
}

/** A limb as one filled shape along c, tapering from w0 to w1, its edges a little uneven like a brush. */
export function limb(c: Pt[], w0: number, w1: number): string {
  const n = c.length - 1
  const L: string[] = []
  const R: string[] = []
  c.forEach(([x, y], i) => {
    const [ax, ay] = c[Math.max(0, i - 1)]
    const [bx, by] = c[Math.min(n, i + 1)]
    const len = Math.hypot(bx - ax, by - ay) || 1
    const nx = -(by - ay) / len
    const ny = (bx - ax) / len
    const w = (w0 + ((w1 - w0) * i) / n) / 2
    const ph = rnd() * 0.0001 + i / 3
    const jl = w * (1 + 0.08 * Math.sin(ph * 1.7 + w0))
    const jr = w * (1 + 0.08 * Math.sin(ph * 1.3 + w1))
    L.push(`${r0(x + nx * jl)} ${r0(y + ny * jl)}`)
    R.push(`${r0(x - nx * jr)} ${r0(y - ny * jr)}`)
  })
  return `M${L.join('L')}L${R.reverse().join('L')}Z`
}

/** A smooth line through pts, sampled: Catmull-Rom, k samples per span. */
export function curve(pts: Pt[], k = 6): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let s = 0; s < k; s++) {
      const t = s / k
      const t2 = t * t
      const t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

/** Blossom around (x, y): a soft wash behind, then small flowers in four tones and three sizes, lit from the upper
 * left. A flower is a dot: a zero-length line with a round cap, so d[tone][size] holds `Mx yh0` runs. */
function bloom(x: number, y: number, r: number, n: number, d: string[][], wash: string[]): void {
  wash.push(`M${r0(x - r)} ${r0(y)}a${r0(r)} ${r0(r * 0.8)} 0 1 0 ${r0(2 * r)} 0a${r0(r)} ${r0(r * 0.8)} 0 1 0 ${r0(-2 * r)} 0`)
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2
    const rr = Math.sqrt(rnd()) * r
    const u = Math.cos(a) * rr
    const v = Math.sin(a) * rr * 0.8
    const light = 0.5 - (0.3 * u) / r - (0.3 * v) / r + (rnd() - 0.5) * 0.7
    const tone = light > 0.8 ? 3 : light > 0.45 ? 2 : light > 0.15 ? 1 : 0
    d[tone][Math.floor(rnd() * 3)] += `M${r0(x + u)} ${r0(y + v)}h0`
  }
}
const SIZES = [6, 8.5, 11.5]
/** The flowers that bloom() gathered, as twelve paths. */
const flowers = (d: string[][]) => d.map((row, t) => row.map((p, k) => (p ? `<path class="b${t}" d="${p}" stroke-width="${SIZES[k]}"/>` : '')).join('')).join('')
const pots = () => [0, 1, 2, 3].map(() => ['', '', ''])

/** The cherry tree, in tree coordinates (its foot at 0 0): ink trunk and branches, blossom on the twigs. */
function tree(): string {
  const limbs: [Pt[], number, number][] = [
    [[[22, 4], [4, -110], [-36, -230], [-62, -330], [-74, -360]], 64, 30],
    [[[-70, -350], [-128, -414], [-188, -470], [-240, -548]], 30, 8],
    [[[-70, -350], [-28, -440], [22, -530], [54, -650]], 28, 7],
    [[[-40, -236], [26, -284], [96, -318], [160, -392]], 24, 6],
    [[[-128, -414], [-196, -398], [-262, -410]], 12, 3],
    [[[-28, -440], [-86, -526], [-116, -612]], 13, 3],
    [[[22, -530], [94, -566], [138, -654]], 12, 3],
    [[[-188, -470], [-152, -556], [-162, -650]], 10, 3],
    [[[96, -318], [150, -310], [196, -340]], 10, 3],
  ]
  let ink = ''
  const d = pots()
  const wash: string[] = []
  let bark = ''
  limbs.forEach(([pts, w0, w1], i) => {
    const c = curve(pts, 10)
    ink += limb(c, w0, w1)
    // dry-brush bark: thin pale streaks that run with the thicker limbs
    if (w0 > 20) for (const o of [-0.22, 0.05, 0.3]) bark += stroke(c.filter((_, k) => k % 2 === 0).map(([x, y]) => [x + w0 * o * 0.5, y] as Pt), 2.2, 1, 'bk')
    if (i > 0) c.slice(Math.floor(c.length / 3)).forEach(([x, y], k) => k % 2 === 0 && ((r) => bloom(x, y, r, Math.round(r * 1.1), d, wash))(22 + rnd() * rnd() * 60))
  })
  return `<path class="bw" d="${wash.join('')}" filter="url(#b8)"/><path class="tf" d="${ink}"/>${bark}${flowers(d)}`
}

/** The branch that reaches in at the top left, in picture coordinates. */
function branch(): string {
  const d = pots()
  const wash: string[] = []
  const main = curve([[-30, 54], [110, 66], [236, 104], [372, 96]], 6)
  const twig = curve([[196, 92], [222, 118], [236, 134]], 4)
  const up = curve([[110, 66], [150, 34], [200, 22]], 4)
  for (const [x, y] of [...main.slice(4), ...twig, ...up].filter((_, k) => k % 2 === 0)) bloom(x, y, 22 + rnd() * 14, 30, d, wash)
  return `<path class="bw" d="${wash.join('')}" filter="url(#b8)"/><path class="tf" d="${limb(main, 18, 4)}${limb(twig, 6, 2)}${limb(up, 7, 2)}"/>${flowers(d)}`
}

/** An upturned roof: eaves from -w to w at y, ridge h above. */
const roof = (w: number, y: number, h: number) =>
  `M${-w} ${y}Q${r0(-w * 0.72)} ${r0(y - h * 0.18)} ${r0(-w * 0.6)} ${y - h}L${r0(w * 0.6)} ${y - h}Q${r0(w * 0.72)} ${r0(y - h * 0.18)} ${w} ${y}Q${r0(w * 0.5)} ${y - 4} 0 ${y - 3}Q${r0(-w * 0.5)} ${y - 4} ${-w} ${y}Z`

/** The keep, in castle coordinates (the foot of its stone base at 0 0). */
function castle(): string {
  const wins = (y: number, w: number, n: number) =>
    Array.from({ length: n }, (_, i) => `M${r0(-w + ((2 * w) / (n - 1)) * i - 3)} ${y}h6v9h-6Z`).join('')
  const hatch = Array.from({ length: 7 }, (_, i) => `M${-78 + i * 3} ${-6 - i * 6}L${78 - i * 3} ${-6 - i * 6}`).join('')
  return `<path class="st" d="M-84 0L84 0Q70 -24 64 -46L-64 -46Q-70 -24 -84 0Z"/><path class="sh" d="${hatch}" fill="none" stroke-width="1.2"/>
<path class="wl" d="M-56 -46h112v-40h-112Z"/><path class="wd" d="${wins(-72, 40, 6)}"/><path class="D glow" d="${wins(-72, 40, 6)}"/>
<path class="rf" d="${roof(78, -84, 16)}"/>
<path class="wl" d="M-40 -100h80v-30h-80Z"/><path class="wd" d="${wins(-120, 26, 4)}"/><path class="D glow" d="${wins(-120, 26, 4)}"/>
<path class="rf" d="${roof(58, -128, 14)}"/>
<path class="wl" d="M-26 -142h52v-22h-52Z"/><path class="wd" d="${wins(-158, 12, 3)}"/><path class="D glow" d="${wins(-158, 12, 3)}"/>
<path class="rf" d="${roof(42, -162, 22)}"/>
<path class="rl" d="M-30 -186q-4 -8 -10 -10M30 -186q4 -8 10 -10" fill="none" stroke-width="2.4" stroke-linecap="round"/>
<g class="pole" transform="translate(-72 0)"><path class="pl" d="M0 0V-128" stroke-width="2.2"/><g class="nb"><path class="ver" d="M-13 -124h12v58h-12Z"/></g></g>
<g class="pole" transform="translate(72 0)"><path class="pl" d="M0 0V-118" stroke-width="2.2"/><g class="nb n2"><path class="ver" d="M1 -114h12v52h-12Z"/></g></g>`
}

/** One pine on the hill: three flat tiers of ink on a crooked trunk. */
const pine = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path class="tk" d="M0 0q-6 -22 4 -52" stroke-width="5" fill="none"/><path class="pn" d="M-34 -30c10 -12 30 -14 44 -8c10 -6 26 -2 30 8c-24 -4 -50 -4 -74 0ZM-26 -48c10 -10 26 -12 36 -6c8 -4 20 -2 24 6c-20 -3 -40 -3 -60 0ZM-14 -64c8 -8 18 -9 26 -4c6 -2 12 0 14 4c-14 -2 -27 -2 -40 0Z"/></g>`

/** Petals in the air: the leaves of «Осень» (gouache-autumn.ts), as petals. */
function falling(busy: boolean): string {
  let out = ''
  let i = 0
  const one = (x: number, y: number, w: number, h: number, dur: number, size: number, cls = '') => {
    const turn = (rnd() < 0.5 ? -1 : 1) * (200 + rnd() * 480)
    let p = -1
    for (let t = 0; t < 6; t++) {
      const q = 0.1 + rnd() * 0.8
      const bx = x + w * q
      const by = y + h * q
      if (bx > 12 && bx < 1588 && (bx < 420 || bx > 1175) && by > 40 && by < 880) {
        p = q
        break
      }
    }
    // A petal whose way never crosses a side lane has nowhere to hang: it shows only while it falls.
    const still = p < 0 ? ((p = 0.5), 'opacity:0;') : ''
    out += `<g class="f${cls}" style="${still}--x:${r0(x)}px;--y:${r0(y)}px;--w:${r0(w)}px;--h:${r0(h)}px;--r:${r0(turn)}deg;--bx:${r0(x + w * p)}px;--by:${r0(y + h * p)}px;animation-duration:${dur.toFixed(1)}s;animation-delay:-${(rnd() * dur).toFixed(1)}s"><g class="sw" style="animation-delay:-${(rnd() * 3).toFixed(1)}s"><use href="#pt" class="p${i % 2}" transform="scale(${size.toFixed(2)})"/></g></g>`
    i++
  }
  // the left lane: out of the branch at the top left, down past the castle hill
  for (let k = 0; k < (busy ? 7 : 14); k++) one(120 + rnd() * 300, 60 + rnd() * 90, -(20 + rnd() * 120), 640 + rnd() * 200, busy ? 4 + rnd() * 2.5 : 10 + rnd() * 7, 1.2 + rnd() * 0.9)
  // the right lane: out of the crown, down to the ground
  for (let k = 0; k < (busy ? 7 : 14); k++) {
    const x = TX - 230 + rnd() * 380
    const y = TY - 640 + rnd() * 300
    one(x, y, -(10 + rnd() * (busy ? 220 : 80)), TY - 20 - y + rnd() * 60, busy ? 3.6 + rnd() * 2.4 : 8 + rnd() * 6, 1.2 + rnd() * 0.9)
  }
  if (!busy) for (let k = 0; k < 4; k++) one(480 + rnd() * 640, 60 + rnd() * 280, -(40 + rnd() * 200), 300 + rnd() * 300, 12 + rnd() * 8, 0.9 + rnd() * 0.5)
  else {
    // the wind: off the crown and across the whole picture, and a few close to the eye
    for (let k = 0; k < 24; k++) one(TX - 220 + rnd() * 380, TY - 660 + rnd() * 420, -(500 + rnd() * 1200), 60 + rnd() * 360, 3.6 + rnd() * 3.4, 0.8 + rnd() * 0.6)
    for (let k = 0; k < 12; k++) one(200 + rnd() * 520, 80 + rnd() * 520, -(320 + rnd() * 420), 120 + rnd() * 320, 3.2 + rnd() * 2.8, 0.9 + rnd() * 0.6)
    for (let k = 0; k < 3; k++) one(1500 + rnd() * 300, 560 + rnd() * 240, -2100, 40 + rnd() * 120, 4.5 + rnd() * 2.5, 2 + rnd() * 0.6, ' nf')
  }
  return out
}

/** A ridge of far mountains: a wavy line from x0 to x1 around y, peaks of height a. */
function ridge(y: number, a: number, f: number, ph: number): string {
  let d = `M-40 1010L-40 ${r0(y)}`
  for (let x = -40; x <= 1640; x += 20) {
    const h = a * (0.55 + 0.45 * Math.sin(x / f + ph)) * (0.7 + 0.3 * Math.sin(x / (f * 0.37) + ph * 2)) + 6 * Math.sin(x / 23 + ph)
    d += `L${x} ${r0(y - Math.max(0, h))}`
  }
  return d + 'L1640 1010Z'
}

export function sakuraScene(activity: 'idle' | 'busy' = 'idle'): string {
  rnd = rng(17)
  const busy = activity === 'busy'

  // a few stars at night, and a skein of geese in the sky at the left
  let stars = ''
  for (let i = 0; i < 46; i++) {
    const x = rnd() * 1600
    const y = rnd() * 420
    stars += `M${r0(x)} ${r0(y)}h.1`
  }
  const geese = [[0, 0], [-22, 12], [-44, 22], [22, 14], [40, 26], [-64, 34]].map(([x, y]) => `M${x - 8} ${y - 4}q8 -2 8 4q2 -6 8 -6`).join('')

  let hillStreaks = ''
  for (let i = 0; i < 26; i++) {
    const y = CY + 30 + rnd() * 230
    const half = 40 + (y - CY) * 0.9
    const x = CX - half * 0.8 + rnd() * half * 1.6
    hillStreaks += `M${r0(x)} ${r0(y)}q${r0(18 + rnd() * 30)} ${r0(-3 + rnd() * 6)} ${r0(40 + rnd() * 70)} ${r0(rnd() * 8)}`
  }
  // paper fibres: short pale and dark hairs scattered over one tile
  let fibres = ''
  for (let i = 0; i < 160; i++) {
    const a = rnd() * Math.PI
    const l = 3 + rnd() * 9
    fibres += `M${r0(rnd() * 240)} ${r0(rnd() * 240)}l${r0(Math.cos(a) * l)} ${r0(Math.sin(a) * l)}`
  }
  const ground = 'M-40 1010L-40 930C200 900 400 918 620 912S1000 920 1200 904S1500 884 1640 896V1010Z'
  const hill = `M80 1010C150 860 220 760 ${CX - 70} ${CY + 2}Q${CX} ${CY - 8} ${CX + 70} ${CY + 2}C470 760 560 860 640 1010Z`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMinYMid slice" width="100%" height="100%">
<style>
.D{display:none}
.s0{stop-color:#eee5d0}.s1{stop-color:#e6d9bb}.v0{stop-color:#a88c5e}
.sun{fill:#b8361f}.mi{fill:#f7f0e0;opacity:.75}
.m1{fill:#7d7a74;opacity:.22}.m2{fill:#5e5a52;opacity:.3}.m3{fill:#3b3732;opacity:.42}
.h0{stop-color:#2b2722}.h1{stop-color:#5a5246}.hs{stroke:#8a7f6c;stroke-width:3;opacity:.35}.we{fill:none;stroke:#2a2620;stroke-width:2.4;opacity:.35}.hw{stroke-width:3.5;opacity:.6}.bk{stroke:#8a7f6c;opacity:.45;stroke-linecap:round;fill:none}.fb{stroke:#7a6a50;stroke-width:1;opacity:.16}.k0{stop-color:#8a7a5c}.lm{fill:#3a3530;opacity:.5}.tf{fill:#1d1a16}.gr{fill:url(#gg)}.g0{stop-color:#4a4236}.g1{stop-color:#2a251e}.pn{fill:#232019}
.st{fill:#7a7062}.sh{stroke:#4a4238;opacity:.55}.wl{fill:#f4ecda;stroke:#2a251f;stroke-width:1.3;stroke-opacity:.75}.rf{stroke:#1f1c18;stroke-width:1.6;stroke-linejoin:round}.wd{fill:#2a251f}.rf{fill:#1f1c18}.rl{stroke:#1f1c18}
.pl{stroke:#2a251f}.ver{fill:#b8361f}
.tk{stroke:#1d1a16;stroke-linecap:round;fill:none}
.bw{fill:#e7aab2;opacity:.5}.b0{stroke:#d27a8a}.b1{stroke:#e698a6}.b2{stroke:#f1bcc4}.b3{stroke:#fae1e2}.b0,.b1,.b2,.b3{stroke-linecap:round;fill:none}
.p0{fill:#eaa0ae}.p1{fill:#f6cbd1}.gs{stroke:#2a251f}.seal{fill:#b8361f}.sk{fill:#f4ecda}
.f{transform:translate(var(--bx),var(--by)) rotate(calc(var(--r)*.3));animation:fall linear infinite}.nf{filter:url(#b2);opacity:.6}
@keyframes fall{0%{transform:translate(var(--x),var(--y)) rotate(0deg);opacity:0}6%{opacity:1}88%{opacity:1}100%{transform:translate(calc(var(--x) + var(--w)),calc(var(--y) + var(--h))) rotate(var(--r));opacity:0}}
.sw{animation:sw 2.6s ease-in-out infinite alternate}@keyframes sw{from{transform:rotate(-30deg) scaleX(1)}to{transform:rotate(30deg) scaleX(.55)}}
.sway{animation:sway ${busy ? '2.2s' : '7s'} ease-in-out infinite alternate}
@keyframes sway{from{transform:rotate(${busy ? -1.6 : -0.4}deg)}to{transform:rotate(${busy ? 0.8 : 0.4}deg)}}
.nb{transform-origin:0 -124px;animation:nb ${busy ? '.9s' : '3.6s'} ease-in-out infinite alternate}.n2{transform-origin:0 -114px;animation-delay:-.7s}
@keyframes nb{from{transform:skewY(${busy ? -10 : -3}deg) scaleX(1)}to{transform:skewY(${busy ? 6 : 3}deg) scaleX(${busy ? 0.8 : 0.95})}}
.ms{animation:ms 26s ease-in-out infinite alternate}.ms2{animation:ms 34s ease-in-out -12s infinite alternate}
@keyframes ms{from{transform:translate(-24px,0)}to{transform:translate(30px,0)}}
.gk{animation:gk 40s ease-in-out infinite alternate}@keyframes gk{from{transform:translate(0,0)}to{transform:translate(-60px,-18px)}}
.glow{fill:#ffcf7a}
@media (prefers-color-scheme:dark){.D{display:block}.L{display:none}
.s0{stop-color:#1c1915}.s1{stop-color:#14120f}.v0{stop-color:#000}
.mi{fill:#2c2a2c;opacity:.6}
.m1{fill:#6b6e7c;opacity:.2}.m2{fill:#555865;opacity:.28}.m3{fill:#3b3d47;opacity:.5}
.h0{stop-color:#14120f}.h1{stop-color:#26221c}.hs{stroke:#3a352d;opacity:.4}.we{stroke:#8a8fa0;opacity:.22}.hw{opacity:.3}.bk{stroke:#3a352d}.fb{stroke:#d8ccb4;opacity:.07}.k0{stop-color:#000}.tf{fill:#060505}.g0{stop-color:#201d18}.g1{stop-color:#14120f}.pn{fill:#070605}
.st{fill:#2e2a25}.sh{stroke:#000;opacity:.5}.wl{fill:#3a352d;stroke:#0c0b09}.wd{fill:#14110e}.rf{fill:#08070a}.rl{stroke:#08070a}
.pl{stroke:#08070a}.ver{fill:#9a2c1a}
.tk{stroke:#060505}
.bw{fill:#7a4655;opacity:.5}.b0{stroke:#9c5c6c}.b1{stroke:#c4808f}.b2{stroke:#e2aab5}.b3{stroke:#f2d0d6}
.p0{fill:#d495a3}.p1{fill:#efc6cf}.gs{stroke:#b9b1a2}.seal{fill:#9a2c1a}.sk{fill:#e8dcc0}
}
@media (prefers-reduced-motion:reduce){*{animation:none !important}}
</style>
<defs>
<filter id="b1"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b14" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
<linearGradient id="paper" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000"><stop offset="0" class="s0"/><stop offset="1" class="s1"/></linearGradient>
<radialGradient id="vig" gradientUnits="userSpaceOnUse" cx="800" cy="480" r="980"><stop offset=".55" class="v0" stop-opacity="0"/><stop offset="1" class="v0" stop-opacity=".55"/></radialGradient>
<linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="0" y1="380" x2="0" y2="700"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="fm" maskUnits="userSpaceOnUse" x="-40" y="0" width="1680" height="1010"><rect x="-40" width="1680" height="1010" fill="url(#fade)"/></mask>
<radialGradient id="mh"><stop offset="0" stop-color="#e8dcc0" stop-opacity=".28"/><stop offset="1" stop-color="#e8dcc0" stop-opacity="0"/></radialGradient>
<radialGradient id="wg"><stop offset="0" stop-color="#ffc56a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>
<linearGradient id="hg" gradientUnits="userSpaceOnUse" x1="0" y1="${CY}" x2="0" y2="1000"><stop offset="0" class="h0"/><stop offset="1" class="h1"/></linearGradient>
<linearGradient id="gg" gradientUnits="userSpaceOnUse" x1="0" y1="880" x2="0" y2="1000"><stop offset="0" class="g0" stop-opacity=".85"/><stop offset="1" class="g1"/></linearGradient>
<pattern id="fib" patternUnits="userSpaceOnUse" width="240" height="240"><path class="fb" d="${fibres}" fill="none" stroke-linecap="round"/></pattern>
<linearGradient id="top" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="330"><stop offset="0" class="k0" stop-opacity=".5"/><stop offset="1" class="k0" stop-opacity="0"/></linearGradient>
<path id="pt" d="M0 -6C4 -6 6 -1 4 3C3 5 1 5 0 4C-1 5 -3 5 -4 3C-6 -1 -4 -6 0 -6Z"/>
</defs>

<rect x="-40" width="1680" height="1010" fill="url(#paper)"/><rect x="-40" width="1680" height="330" fill="url(#top)"/>
<path class="D" d="${stars}" stroke="#e8dcc0" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>
<circle class="L sun" cx="${SX}" cy="${SY}" r="78"/>
<circle class="D" cx="${SX}" cy="${SY}" r="150" fill="url(#mh)"/><circle class="D moon" cx="${SX}" cy="${SY}" r="56" fill="#e8dcc0"/>
<g class="gk"><path class="gs" transform="translate(470 330)" d="${geese}" fill="none" stroke-width="2.2" stroke-linecap="round"/></g>

<g mask="url(#fm)">${[[470, 150, 140, 0.4, 'm1'], [560, 110, 95, 2.1, 'm2'], [640, 70, 70, 4.3, 'm3']].map(([y, a, f, ph, c]) => `<path class="${c}" d="${ridge(y, a, f, ph)}"/><path class="we" d="${ridge(y, a, f, ph)}" filter="url(#b1)"/>`).join('')}</g>
<g class="ms"><ellipse class="mi" cx="760" cy="560" rx="420" ry="34" filter="url(#b14)"/><ellipse class="mi" cx="1180" cy="470" rx="300" ry="26" filter="url(#b14)"/></g>
<g class="ms2"><ellipse class="mi" cx="420" cy="660" rx="380" ry="30" filter="url(#b14)"/><ellipse class="mi" cx="980" cy="700" rx="460" ry="36" filter="url(#b14)"/></g>

<path d="${hill}" fill="url(#hg)"/><path class="we hw" d="${hill}" filter="url(#b1)"/><path class="hs" d="${hillStreaks}" fill="none" stroke-linecap="round"/>
${pine(190, 900, 1.3)}${pine(232, 868, 1)}${pine(486, 846, 1.15)}${pine(530, 900, 1.4)}
<g class="castle" transform="translate(${CX} ${CY})">
<circle class="D" cx="0" cy="-110" r="120" fill="url(#wg)"/>
${castle()}
</g>
<path class="gr" d="${ground}"/><ellipse class="D lm" cx="820" cy="930" rx="760" ry="40" filter="url(#b14)"/>

<g class="tree" transform="translate(${TX} ${TY})"><g class="sway">${tree()}</g></g>
<g class="br2">${branch()}</g>
<g class="fall">${falling(busy)}</g>
<g transform="translate(1530 942)"><rect class="seal" x="0" y="0" width="44" height="44" rx="4"/><text class="sk" x="22" y="32" font-size="28" text-anchor="middle" font-family="Hiragino Mincho ProN, Yu Mincho, serif">桜</text></g>
<rect x="-40" width="1680" height="1010" fill="url(#fib)"/><rect x="-40" width="1680" height="1010" fill="url(#vig)"/>
</svg>`
}
