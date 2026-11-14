// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
export function rasterCodeScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  let seed = 4417
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
  const f = (n: number) => +n.toFixed(1)

  // Bayer 4x4 threshold cells fed into the quantizer
  const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
  const cellsOf = (size: number, on: string, off: string) => B.map((v, i) => {
    const t = (v + 0.5) / 16 - 0.5
    return `<rect x="${(i % 4) * size}" y="${Math.floor(i / 4) * size}" width="${size}" height="${size}" fill="${t > 0 ? on : off}" opacity="${(Math.abs(t) * 0.5).toFixed(3)}"/>`
  }).join('')
  const bayer = cellsOf(7, '#fff6ea', '#0c0706')
  const bayer5 = cellsOf(5, '#fff6ea', '#0c0706')
  const twoTone = B.map((v, i) => v < 6 ? `<rect x="${(i % 4) * 7}" y="${Math.floor(i / 4) * 7}" width="7" height="7" fill="#653d2c"/>` : '').join('')
  // busy sweep: bright bands only (mask keeps them in the outer 400px of each side)
  const bands = ([[-420, 110, '#f6e2c0', 0.7], [150, 120, '#f0be8c', 0.6]] as [number, number, string, number][])
    .map(([y, h, c, o]) => `<rect x="-1200" y="${y}" width="4000" height="${h}" fill="${c}" opacity="${o}"/>`).join('')

  // ---- the hero: one flowering branch hanging from the top-right corner ----
  const bez = (p: number[][], t: number) => {
    const u = 1 - t
    return [0, 1].map(k => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k])
  }
  const taper = (p: number[][], w0: number, w1: number) => {
    const L: number[][] = [], R: number[][] = []
    const n = 22
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const a = bez(p, t), b = bez(p, Math.min(1, t + 0.02)), c = bez(p, Math.max(0, t - 0.02))
      const dx = b[0] - c[0], dy = b[1] - c[1], d = Math.hypot(dx, dy) || 1
      const w = (w0 + (w1 - w0) * t) / 2
      L.push([a[0] - (dy / d) * w, a[1] + (dx / d) * w])
      R.push([a[0] + (dy / d) * w, a[1] - (dx / d) * w])
    }
    return 'M' + L.concat(R.reverse()).map(q => `${f(q[0])} ${f(q[1])}`).join('L') + 'Z'
  }
  const line = (p: number[][], n = 16) => 'M' + Array.from({ length: n + 1 }, (_, i) => bez(p, i / n)).map(q => `${f(q[0])} ${f(q[1])}`).join('L')
  const ORG = [1690, -50]
  const main = [[1690, -50], [1560, 50], [1400, 130], [1195, 395]]
  const twigs: { t: number; e: number[]; bow: number; w: number }[] = [
    { t: 0.2, e: [1575, 330], bow: -40, w: 24 }, { t: 0.38, e: [1470, 250], bow: 30, w: 22 },
    { t: 0.5, e: [1335, 70], bow: -30, w: 20 }, { t: 0.62, e: [1440, 465], bow: -50, w: 22 }, { t: 0.82, e: [1255, 505], bow: 40, w: 18 },
  ]
  const blossoms: [number, number, number, number, number][] = [ // x, y, scale, rot, variant
    [1195, 395, 1.1, 10, 0], [1575, 330, 0.95, 40, 1], [1470, 250, 1.2, -20, 0], [1335, 70, 0.8, 25, 1], [1440, 465, 1.0, -35, 1],
  ]
  let wood = '', hi = '', nicks = '', leaves = ''
  wood += `<path d="${taper(main, 58, 12)}"/>`
  hi += `<path d="${line(main, 22)}" stroke-width="12" opacity=".5"/>`
  for (let k = 0; k < 9; k++) {
    const q = bez(main, 0.08 + k * 0.1), q2 = bez(main, 0.1 + k * 0.1)
    nicks += `<path d="M${f(q[0] - 6)} ${f(q[1] + 3)}L${f(q2[0] + 4)} ${f(q2[1] + 6)}" stroke-width="2.6" opacity=".55"/>`
  }
  const leaf = (x: number, y: number, ang: number, s: number) => {
    const g = ['A', 'B', 'C'][Math.min(2, Math.floor(rnd() * 3))]
    return `<use href="#lf${g}" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(${s.toFixed(2)})"/>`
  }
  for (let k = 0; k < 7; k++) {
    const t = 0.12 + k * 0.1
    const q = bez(main, t)
    leaves += leaf(q[0], q[1], (k % 2 ? 1 : -1) * (50 + rnd() * 40) + 100, 1.2 + rnd() * 0.5)
  }
  twigs.forEach(tw => {
    const a = bez(main, tw.t), e = tw.e
    const p = [a, [a[0] + (e[0] - a[0]) * 0.2 + tw.bow, a[1] + (e[1] - a[1]) * 0.45], [a[0] + (e[0] - a[0]) * 0.8, a[1] + (e[1] - a[1]) * 0.75 - tw.bow * 0.3], e]
    wood += `<path d="${taper(p, tw.w, 6)}"/>`
    hi += `<path d="${line(p, 14)}" stroke-width="${tw.w * 0.25}" opacity=".45"/>`
    const base = Math.atan2(e[1] - a[1], e[0] - a[0]) * 180 / Math.PI
    for (let k = 1; k <= 5; k++) {
      const t = k / 6
      const q = bez(p, t)
      leaves += leaf(q[0], q[1], base + (k % 2 ? -1 : 1) * (38 + rnd() * 26) + (rnd() - 0.5) * 16, 1.3 + rnd() * 0.6 - t * 0.3)
    }
  })
  leaves += leaf(1255, 505, 150, 1.5) + leaf(1250, 520, 95, 1.2)
  const bloom = blossoms.map(([x, y, s, r, v]) => `<use href="#bl${v}" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`).join('')
  // petals that drift off the branch in busy
  const petalSrc = [[1195, 395], [1575, 330], [1470, 250], [1335, 70], [1440, 465], [1300, 300], [1520, 160]]
  const drift = Array.from({ length: 9 }, (_, i) => {
    const px = 1230 + Math.round(rnd() * 330), py = 130 + Math.round(rnd() * 380)
    const sz = 10 + Math.round(rnd() * 4), o = (0.6 + rnd() * 0.4).toFixed(2)
    const dx = -(50 + Math.round(rnd() * 100)), dy = 260 + Math.round(rnd() * 240), rot = Math.round((rnd() - 0.3) * 420)
    return `<g class="pd" style="--dx:${dx}px;--dy:${dy}px;--o:${o};--r:${rot}deg;animation-delay:${(-i * 1.3).toFixed(1)}s;animation-duration:${(9 + (i % 4) * 2.2).toFixed(1)}s"><use href="#pet" transform="translate(${px} ${py}) rotate(${i * 53}) scale(${(sz * 1.6 / 66).toFixed(3)} ${(sz / 66).toFixed(3)})"/></g>`
  }).join('')
  // click on the branch: 7 petals fall (unfiltered layer, crisp)
  let fall = ''
  for (let i = 0; i < 7; i++) {
    const [x, y] = petalSrc[i % 5]
    const dx = Math.round((rnd() - 0.7) * 160), dy = 260 + Math.round(rnd() * 120)
    const d = (1.8 + rnd() * 0.8).toFixed(1), b = (i * 0.07).toFixed(2)
    fall += `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.7;1" dur="${d}s" begin="brh.click+${b}s"/><animateTransform attributeName="transform" type="translate" values="${x} ${y};${x + dx * 0.4} ${y + dy * 0.35};${x + dx} ${y + dy}" keyTimes="0;.35;1" dur="${d}s" begin="brh.click+${b}s"/><g><animateTransform attributeName="transform" type="rotate" values="${i * 40};${i * 40 + 220}" dur="${d}s" begin="brh.click+${b}s"/><use href="#pet" transform="scale(.5)"/></g></g>`
  }

  // ---- edge click cells and pixel blooms ----
  const colsL = [0, 110, 220, 330], colsR = [1160, 1270, 1380, 1490]
  type Cell = { id: string; x: number; y: number; side: 'L' | 'R'; col: number; grp: string }
  const cells: Cell[] = []
  ;(['L', 'R'] as const).forEach(side => (side === 'L' ? colsL : colsR).forEach((x, col) => {
    for (let r = 0; r < 9; r++) cells.push({ id: `c${cells.length + 1}`, x, y: Math.round(r * 111.1), side, col, grp: `${side}${(col + r) % 2}` })
  }))
  const grpIds = ['L0', 'L1', 'R0', 'R1']
  const hitCells = (side: 'L' | 'R') => cells.filter(c => c.side === side).map(c => `<rect id="${c.id}" class="hit cl${side}${c.col}" x="${c.x + 2}" y="${c.y + 2}" width="106" height="107"/>`).join('')
  const ringSpec: [string, number, number, number, number][] = [ // colour, n, r1, delay, dur
    ['#f0eee6', 14, 150, 0, 0.9], ['#f0eee6', 22, 215, 0.05, 1.0], ['#f0eee6', 30, 275, 0.1, 1.1],
  ]
  const pcol = ['#d97757', '#e8d9bf', '#f0eee6', '#8aa583']
  const bloomOf = (g: string) => {
    const ids = cells.filter(c => c.grp === g).map(c => c.id)
    const tg = `tg${g}`
    const bg = (dly: number) => `${tg}.begin${dly ? `+${dly}s` : ''}`
    const trig = `<set id="${tg}" attributeName="visibility" to="visible" begin="${ids.map(i => `${i}.click`).join(';')}" dur=".01s"/>`
    const pos = cells.filter(c => c.grp === g).map(c => `<set attributeName="x" to="${c.x + 55}" begin="${c.id}.click"/><set attributeName="y" to="${c.y + 55}" begin="${c.id}.click"/>`).join('')
    const sp = 'calcMode="spline" keyTimes="0;1" keySplines=".1 .8 .3 1"'
    const rings = ringSpec.map(([col, n, r1, dl, du]) => {
      const one = (c: string, w: number, d: number, off: number) => {
        const gap = (r: number) => f(2 * Math.PI * r / n - d)
        const bgn = bg(dl)
        return `<circle r="24" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${d} 2" stroke-dashoffset="${off}" opacity="0"><animate attributeName="r" values="24;${r1}" ${sp} dur="${du}s" begin="${bgn}"/><animate attributeName="stroke-dasharray" values="${d} ${gap(24)};${d} ${gap(r1)}" ${sp} dur="${du}s" begin="${bgn}"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.6;1" dur="${du}s" begin="${bgn}"/></circle>`
      }
      return one('#d97757', 9, 9, 1) + one(col, 7, 7, 0)
    }).join('')
    let parts = ''
    for (let k = 0; k < 22; k++) {
      const a = (k * 16.4 + rnd() * 10) * Math.PI / 180, d = 100 + rnd() * 110
      const dx = Math.round(Math.cos(a) * d), dy = Math.round(Math.sin(a) * d), du = (1 + rnd() * 0.3).toFixed(2)
      parts += `<rect x="-3.5" y="-3.5" width="7" height="7" fill="${pcol[k % 4]}" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${Math.round(dx * 0.6)} ${Math.round(dy * 0.6)};${dx} ${dy + 45}" keyTimes="0;.14;1" dur="${du}s" begin="${bg(0)}"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.65;1" dur="${du}s" begin="${bg(0)}"/></rect>`
    }
    const flash = `<circle r="64" fill="url(#fp)" mask="url(#fm)" opacity="0"><animate attributeName="opacity" values="1;1;0" keyTimes="0;.55;1" dur=".36s" begin="${bg(0)}"/></circle><circle r="28" fill="url(#fp2)" mask="url(#fm)" opacity="0"><animate attributeName="opacity" values="1;1;0" keyTimes="0;.7;1" dur=".32s" begin="${bg(0)}"/></circle>`
    return `<svg id="bm${g}" x="0" y="0" width="1" height="1" overflow="visible">${trig}${pos}${flash}${rings}${parts}</svg>`
  }
  // stamens for the blossoms
  let stam = ''
  for (let k = 0; k < 9; k++) {
    const a = k * 40 + 12, l = 20 + (k % 3) * 5
    const x = Math.cos(a * Math.PI / 180) * l, y = Math.sin(a * Math.PI / 180) * l
    stam += `<path d="M0 0L${f(x)} ${f(y)}" stroke="#cf8a3c" stroke-width="2.4"/><circle cx="${f(x)}" cy="${f(y)}" r="3.8" fill="#e3b341" stroke="#b8742f" stroke-width="1"/>`
  }
  const petals = (p: string) => [0, 1, 2, 3, 4].map(k => `<use href="#${p}" transform="rotate(${k * 72})"/>`).join('')
  const bm = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
  let GD = ''
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const t = bm[y][x]; if (t < 4) GD += `<rect x="${x*3}" y="${y*3}" width="3" height="3" fill="#17100c" fill-opacity=".26"/>`; else if (t >= 12) GD += `<rect x="${x*3}" y="${y*3}" width="3" height="3" fill="#fff6e6" fill-opacity=".2"/>` }
  const TV = Array.from({ length: 9 }, (_, i) => ((i + 0.5) / 9).toFixed(3)).join(' ')
  const hitPoly = '1700,-60 1700,150 1620,330 1560,420 1480,520 1330,545 1200,470 1150,400 1210,300 1330,170 1480,50'
  const phoneHide = '.clL2,.clL3,.clR0,.clR1{display:none}'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<defs>

<linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d4a35"/><stop offset=".45" stop-color="#6a3f2f"/><stop offset=".65" stop-color="#4a2c22"/><stop offset=".85" stop-color="#2a1d18"/><stop offset="1" stop-color="#1c1714"/></linearGradient>
<radialGradient id="gT" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ee8a62"/><stop offset=".45" stop-color="#c96442" stop-opacity=".9"/><stop offset="1" stop-color="#c96442" stop-opacity="0"/></radialGradient>
<radialGradient id="gS" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f6ebd4"/><stop offset=".5" stop-color="#e8d9bf" stop-opacity=".85"/><stop offset="1" stop-color="#e8d9bf" stop-opacity="0"/></radialGradient>
<radialGradient id="gG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8fae86"/><stop offset=".55" stop-color="#7f9a78" stop-opacity=".9"/><stop offset="1" stop-color="#7f9a78" stop-opacity="0"/></radialGradient>
<radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset=".62" stop-color="#0e0908" stop-opacity="0"/><stop offset="1" stop-color="#0e0908" stop-opacity=".5"/></radialGradient>
<pattern id="gaps" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0H7M0 0V7" stroke="#150f0d" stroke-width="2.4"/></pattern>
<linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset=".62" stop-color="#000"/><stop offset=".95" stop-color="#fff"/></linearGradient>
<mask id="gapm"><rect width="1600" height="1000" fill="url(#gg)"/></mask>
<pattern id="gaps2" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0H5M0 0V5" stroke="#150f0d" stroke-width="1.8"/></pattern>
<linearGradient id="gn" x1="0" y1="0" x2="0" y2="1"><stop offset=".65" stop-color="#fff"/><stop offset="1" stop-color="#555"/></linearGradient>
<linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset=".12" stop-color="#fff"/><stop offset=".3" stop-color="#555"/><stop offset=".6" stop-color="#555"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#777"/></linearGradient>
<mask id="mnd"><rect width="1600" height="1000" fill="url(#gn)"/></mask>
<mask id="mnp"><rect width="1600" height="1000" fill="url(#gp)"/></mask>
<pattern id="bay2" width="20" height="20" patternUnits="userSpaceOnUse">${bayer5}</pattern>
<pattern id="bay" width="28" height="28" patternUnits="userSpaceOnUse">${bayer}</pattern>
<pattern id="two" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#744630"/>${twoTone}</pattern>
<linearGradient id="gh" x1="0" y1="0" x2="1" y2="0"><stop offset=".22" stop-color="#000"/><stop offset=".32" stop-color="#fff"/><stop offset=".68" stop-color="#fff"/><stop offset=".78" stop-color="#000"/></linearGradient>
<linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset=".42" stop-color="#fff"/><stop offset=".62" stop-color="#000"/></linearGradient>
<radialGradient id="rcm" cx="50%" cy="50%" r="50%"><stop offset=".2" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="mc"><ellipse cx="800" cy="330" rx="470" ry="400" fill="url(#rcm)"/></mask>
<linearGradient id="gpk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ead9bb"/><stop offset=".2" stop-color="#e8c19a"/><stop offset=".38" stop-color="#dc8a62"/><stop offset=".52" stop-color="#c9694a"/><stop offset=".6" stop-color="#8a7358"/><stop offset=".66" stop-color="#6f866b"/><stop offset=".74" stop-color="#55604a"/><stop offset=".86" stop-color="#2c211b"/><stop offset="1" stop-color="#1c1714"/></linearGradient>
<linearGradient id="gpl" gradientUnits="userSpaceOnUse" x1="410" y1="0" x2="470" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="gpr" gradientUnits="userSpaceOnUse" x1="1190" y1="0" x2="1130" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="mplat"><rect x="-20" y="700" width="490" height="120" fill="url(#gpl)"/><rect x="1130" y="700" width="490" height="120" fill="url(#gpr)"/></mask>
<mask id="mh"><rect width="1600" height="1000" fill="url(#gh)"/></mask>
<mask id="mv"><rect width="1600" height="1000" fill="url(#gv)"/></mask>
<linearGradient id="gm" x1="0" y1="0" x2="1" y2="0"><stop offset=".14" stop-color="#fff"/><stop offset=".3" stop-color="#303030"/><stop offset=".7" stop-color="#303030"/><stop offset=".86" stop-color="#fff"/></linearGradient>
<linearGradient id="gs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#000"/><stop offset=".75" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="mbay"><rect width="1600" height="1000" fill="url(#gm)"/></mask>
<mask id="msw"><rect width="1600" height="1000" fill="url(#gs)"/></mask>
<filter id="nz" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><feTurbulence type="fractalNoise" baseFrequency=".17" numOctaves="1" seed="7"/><feColorMatrix values="1.2 0 0 0 -.1  0 1.2 0 0 -.1  0 0 1.2 0 -.1  0 0 0 0 1"/></filter>
<filter id="q" filterUnits="userSpaceOnUse" x="0" y="0" width="1603" height="1001" color-interpolation-filters="sRGB"><feFlood x="3" y="3" width="1" height="1"/><feComposite width="7" height="7" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="3"/><feComponentTransfer><feFuncR type="discrete" tableValues=".11 .24 .36 .5 .62 .74 .86 .96"/><feFuncG type="discrete" tableValues=".1 .2 .31 .44 .56 .69 .81 .93"/><feFuncB type="discrete" tableValues=".09 .19 .3 .38 .52 .63 .74 .88"/></feComponentTransfer></filter>
<filter id="q3" filterUnits="userSpaceOnUse" x="0" y="0" width="1603" height="1001" color-interpolation-filters="sRGB"><feFlood x="3" y="3" width="1" height="1"/><feComposite width="7" height="7" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="3"/><feComponentTransfer><feFuncR type="discrete" tableValues="0.050 0.110 0.170 0.230 0.290 0.350 0.410 0.470 0.530 0.590 0.650 0.710 0.770 0.830 0.890 0.950"/><feFuncG type="discrete" tableValues="0.050 0.110 0.170 0.230 0.290 0.350 0.410 0.470 0.530 0.590 0.650 0.710 0.770 0.830 0.890 0.950"/><feFuncB type="discrete" tableValues="0.050 0.110 0.170 0.230 0.290 0.350 0.410 0.470 0.530 0.590 0.650 0.710 0.770 0.830 0.890 0.950"/></feComponentTransfer></filter>
<filter id="q2" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000" color-interpolation-filters="sRGB"><feFlood x="2" y="2" width="1" height="1"/><feComposite width="5" height="5" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="2"/><feComponentTransfer><feFuncR type="discrete" tableValues=".11 .24 .36 .5 .62 .74 .86 .96"/><feFuncG type="discrete" tableValues=".1 .2 .31 .44 .56 .69 .81 .93"/><feFuncB type="discrete" tableValues=".09 .19 .3 .38 .52 .63 .74 .88"/></feComponentTransfer></filter>
<filter id="sb" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="1800"><feGaussianBlur stdDeviation="26"/></filter>

<linearGradient id="tw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a07a52"/><stop offset=".5" stop-color="#6a4c33"/><stop offset="1" stop-color="#3a291d"/></linearGradient>
<linearGradient id="lgA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b3c993"/><stop offset=".5" stop-color="#7f9a78"/><stop offset="1" stop-color="#587553"/></linearGradient>
<linearGradient id="lgB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9db985"/><stop offset=".5" stop-color="#6f8d6a"/><stop offset="1" stop-color="#46603f"/></linearGradient>
<linearGradient id="lgC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#86a276"/><stop offset=".5" stop-color="#5f7d5a"/><stop offset="1" stop-color="#3a5236"/></linearGradient>
${['A', 'B', 'C'].map(g => `<g id="lf${g}"><path d="M0 0C16-26 54-32 100 0C54 32 16 26 0 0Z" fill="url(#lg${g})"/><path d="M0 0C16 26 54 32 100 0Z" fill="#26402b" opacity=".22"/><path d="M2 0H92" stroke="#e1ecc4" stroke-opacity=".6" stroke-width="3"/><path d="M22 0L40-15M40 0L60-17M60 0L78-12M22 0L40 15M40 0L60 17M60 0L78 12" stroke="#e1ecc4" stroke-opacity=".38" stroke-width="2.2" fill="none"/><path d="M0 0C16-26 54-32 100 0" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/></g>`).join('')}
<radialGradient id="pt0" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="70"><stop offset="0" stop-color="#eaa268"/><stop offset=".3" stop-color="#f6cfa6"/><stop offset=".7" stop-color="#fbeedb"/><stop offset="1" stop-color="#fffaf0"/></radialGradient>
<radialGradient id="pt1" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="70"><stop offset="0" stop-color="#ea8f6c"/><stop offset=".35" stop-color="#f3b49a"/><stop offset=".75" stop-color="#f9dccb"/><stop offset="1" stop-color="#fdefe4"/></radialGradient>
<path id="pp" d="M0 0C-24-14-32-52-4-66Q0-70 4-66C32-52 24-14 0 0Z"/>
<g id="pA"><use href="#pp" fill="url(#pt0)" stroke="#e0a384" stroke-width="1.6" stroke-opacity=".7"/><path d="M0-8L0-52M0-22L-9-40M0-22L9-40" stroke="#e2a688" stroke-width="2.4" stroke-opacity=".6" fill="none"/></g>
<g id="pB"><use href="#pp" fill="url(#pt1)" stroke="#d98f73" stroke-width="1.6" stroke-opacity=".7"/><path d="M0-8L0-52M0-22L-9-40M0-22L9-40" stroke="#d98a70" stroke-width="2.4" stroke-opacity=".6" fill="none"/></g>
<g id="pet"><use href="#pp" fill="url(#pt1)" stroke="#d98f73" stroke-width="1.6" stroke-opacity=".7"/><path d="M0-8L0-50" stroke="#d98a70" stroke-width="2.4" stroke-opacity=".6" fill="none"/></g>
<g id="bl0">${petals('pA')}<circle r="9" fill="#d9803f"/>${stam}</g>
<g id="bl1">${petals('pB')}<circle r="9" fill="#cf7a3a"/>${stam}</g>
<g id="brg"><g class="sway"><g id="shk"><animateTransform attributeName="transform" type="rotate" values="0 ${ORG[0]} ${ORG[1]};-2.6 ${ORG[0]} ${ORG[1]};2.2 ${ORG[0]} ${ORG[1]};-1.5 ${ORG[0]} ${ORG[1]};1 ${ORG[0]} ${ORG[1]};0 ${ORG[0]} ${ORG[1]}" dur=".9s" begin="brh.click"/>
<g fill="url(#tw)">${wood}</g>
<g fill="none" stroke="#c9a273" stroke-linecap="round">${hi}</g>
<g fill="none" stroke="#2e2017" stroke-linecap="round">${nicks}</g>
${leaves}${bloom}</g></g></g>
<radialGradient id="hg"><stop offset="0" stop-color="#fff1dc" stop-opacity=".3"/><stop offset=".3" stop-color="#fff1dc" stop-opacity=".3"/><stop offset=".3" stop-color="#fff1dc" stop-opacity=".2"/><stop offset=".6" stop-color="#fff1dc" stop-opacity=".2"/><stop offset=".6" stop-color="#fff1dc" stop-opacity=".09"/><stop offset=".9" stop-color="#fff1dc" stop-opacity=".09"/><stop offset=".9" stop-color="#fff1dc" stop-opacity="0"/></radialGradient>
<radialGradient id="fg"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="fm" maskContentUnits="objectBoundingBox"><circle cx=".5" cy=".5" r=".5" fill="url(#fg)"/></mask>
<pattern id="fp" width="12" height="12" patternUnits="userSpaceOnUse"><rect x="-3" y="-3" width="6" height="6" fill="#fff4de"/><rect x="3" y="3" width="6" height="6" fill="#fff4de"/></pattern>
<pattern id="fp2" width="12" height="12" patternUnits="userSpaceOnUse"><rect x="-3" y="-3" width="6" height="6" fill="#fffaf0"/><rect x="3" y="3" width="6" height="6" fill="#fffaf0"/><rect x="3" y="-3" width="6" height="6" fill="#fffaf0"/></pattern>
<pattern id="gd" width="12" height="12" patternUnits="userSpaceOnUse">${GD}</pattern>
<filter id="shd" x="-5%" y="-5%" width="115%" height="115%"><feFlood flood-color="#120c09" flood-opacity=".5"/><feComposite in2="SourceAlpha" operator="in"/></filter>
<filter id="rim" x="-5%" y="-5%" width="115%" height="115%"><feOffset in="SourceAlpha" dx="3" dy="3" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="e"/><feFlood flood-color="#fff1dc" flood-opacity=".85"/><feComposite in2="e" operator="in"/></filter>
<mask id="brm" maskUnits="userSpaceOnUse" x="0" y="-100" width="1800" height="800" style="mask-type:alpha"><use href="#brg"/></mask>
<filter id="qf" filterUnits="userSpaceOnUse" x="0" y="0" width="1602" height="1002" color-interpolation-filters="sRGB"><feFlood x="1" y="1" width="1" height="1"/><feComposite width="3" height="3" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="1"/><feComponentTransfer><feFuncR type="discrete" tableValues="${TV}"/><feFuncG type="discrete" tableValues="${TV}"/><feFuncB type="discrete" tableValues="${TV}"/><feFuncA type="discrete" tableValues="0 .34 .67 1"/></feComponentTransfer></filter>
</defs>
<style>
.bre{animation:br ${busy ? 7 : 18}s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes br{0%,100%{opacity:${busy ? 0.88 : 0.8};transform:scale(1)}50%{opacity:1;transform:scale(${busy ? 1.08 : 1.04})}}
.dr{animation:dr ${busy ? 9 : 40}s ease-in-out infinite alternate}
@keyframes dr{from{transform:translate(0,0)}to{transform:translate(${busy ? '60px,30px' : '10px,6px'})}}
.sw{animation:sw 14s ease-in-out infinite alternate}
@keyframes sw{from{transform:translateY(-170px)}to{transform:translateY(170px)}}
.lum{opacity:0;animation:lm 7s ease-in-out infinite alternate}
@keyframes lm{to{opacity:.07}}
#gl1,#gl2,#gl3,#gl4{transform-origin:0 0}
.sway{transform-origin:${ORG[0]}px ${ORG[1]}px;animation:sy ${busy ? 5 : 11}s ease-in-out infinite alternate}
@keyframes sy{from{transform:rotate(${busy ? -1.4 : -0.7}deg)}to{transform:rotate(${busy ? 2 : 1.1}deg)}}
.pd{opacity:0;transform-box:fill-box;transform-origin:center;animation:pd 12s linear infinite}
@keyframes pd{0%{opacity:0;transform:translate(0,0) rotate(0)}10%{opacity:var(--o)}65%{opacity:var(--o)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}
svg *{pointer-events:none}
svg .hit,svg .hit *{pointer-events:all}
.hit{fill:#fff;fill-opacity:0}
#brw,#brwf,#brhw{transform:translate(40px,0)}
.hit:hover{fill:url(#hg);fill-opacity:1}
#brh:hover{fill:none}
#brh{fill-opacity:0 !important}
#platP,#nzr,#pk{display:none}
@media (max-aspect-ratio:1/1){
#bw{display:none}
#bayr{fill:url(#bay);mask:none;opacity:.5}
#fq{filter:url(#q3)}
#bc{display:none}
#gapr{fill:url(#gaps2)}
#ctr,#gl1,#gl2,#gl3,#gl4{display:none}
#pk{display:block}
#brw,#brwf,#brhw{transform:translate(1031px,0) scale(.75) translate(-1031px,0) translate(-620px,10px)}
#bmwL,#hwL{transform:translate(575px,0)}
#bmwR,#hwR{transform:translate(-575px,0)}
${phoneHide}
}
@media (prefers-reduced-motion: reduce){*{animation:none !important}}
</style>
<rect width="1600" height="1000" fill="#1c1714"/>
<g id="fq" filter="url(#q)">
<rect width="1600" height="1000" fill="url(#base)"/>
<g class="dr">
<g id="gl1"><ellipse cx="210" cy="60" rx="760" ry="470" fill="url(#gT)" class="bre"/></g>
<g id="gl2"><ellipse cx="1430" cy="70" rx="640" ry="400" fill="url(#gS)" class="bre" style="animation-delay:-5s"/></g>
${busy ? '' : '<g id="gl3"><ellipse cx="130" cy="700" rx="460" ry="250" fill="url(#gG)"/></g>'}
<g id="gl4"><ellipse cx="1470" cy="560" rx="460" ry="280" fill="url(#gG)"/></g>
</g>
${busy ? `<g id="bw" mask="url(#msw)"><g id="bands" filter="url(#sb)"><g transform="rotate(-38 800 500)"><g class="sw">${bands}</g></g></g></g><rect width="1600" height="1000" fill="#fff" class="lum"/>` : ''}
${busy ? '<g class="dr"><g id="gl3"><ellipse cx="130" cy="700" rx="460" ry="250" fill="url(#gG)"/></g></g>' : ''}
<rect id="pk" width="1600" height="1000" fill="url(#gpk)"/>
<g id="ctr" mask="url(#mc)"><ellipse cx="800" cy="330" rx="470" ry="400" fill="url(#two)"/></g>
<rect id="nzr" width="1600" height="1000" filter="url(#nz)" opacity=".14" mask="url(#mnd)"/>
<rect id="bayr" width="1600" height="1000" fill="url(#bay)" mask="url(#mbay)"/>
</g>
<g mask="url(#gapm)"><rect id="gapr" width="1600" height="1000" fill="url(#gaps)"/></g>
<g id="fine" filter="url(#qf)"><g id="bc" opacity=".4"><use href="#lfB" transform="translate(120 850) rotate(-25) scale(.9)"/><use href="#lfC" transform="translate(250 915) rotate(200) scale(.8)"/><use href="#lfA" transform="translate(120 850) rotate(-100) scale(.7)"/><use href="#bl1" transform="translate(150 835) rotate(15) scale(.7)"/><use href="#bl0" transform="translate(255 900) rotate(-30) scale(.55)"/></g><g id="brw"><use href="#brg" filter="url(#shd)" transform="translate(5 6)"/><use href="#brg"/><use href="#brg" filter="url(#rim)"/><g mask="url(#brm)"><rect x="0" y="-100" width="1800" height="800" fill="url(#gd)"/></g>${busy ? drift : ''}</g></g>
<rect id="vgr" width="1600" height="1000" fill="url(#vg)"/>
<g id="fx"><g id="brwf">${fall}</g><g id="bmwL">${bloomOf('L0')}${bloomOf('L1')}</g><g id="bmwR">${bloomOf('R0')}${bloomOf('R1')}</g></g>
<g id="hits"><g id="hwL">${hitCells('L')}</g><g id="hwR">${hitCells('R')}</g><g id="brhw"><polygon id="brh" class="hit" points="${hitPoly}"/></g></g>
</svg>`
}
