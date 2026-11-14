// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
export function rasterIdeScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  let seed = 4417
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
  const f = (n: number) => +n.toFixed(1)

  // Bayer 4x4 threshold cells: ordered dither fed into the quantizer (7px desktop, 5px phone)
  const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
  const bayerN = (n: number, light = '#ffffff') => B.map((v, i) => {
    const t = (v + 0.5) / 16 - 0.5
    const a = Math.abs(t) * 0.5
    return `<rect x="${(i % 4) * n}" y="${Math.floor(i / 4) * n}" width="${n}" height="${n}" fill="${t > 0 ? light : '#000000'}" opacity="${a.toFixed(3)}"/>`
  }).join('')
  const bayer = bayerN(7), bayer3 = bayerN(8)

  // wide soft diagonal bands: the busy sweep (carries the dither), kept calm in the middle
  const bands = ([[-420, 110, '#ff9cc0', 0.5], [-130, 80, '#0c0422', 0.55], [150, 120, '#ffa860', 0.42], [430, 90, '#080320', 0.5]] as [number, number, string, number][])
    .map(([y, h, c, o]) => `<rect x="-1200" y="${y}" width="4000" height="${h}" fill="${c}" opacity="${o}"/>`).join('')

  // ---------- pure raster click effects: invisible 110px cells at the edges, one shared pixel ripple per side ----------
  const COL = ['#fe2d84', '#fc801d', '#4a8cff', '#f4f6ff']
  type Cell = { id: string; cx: number; cy: number; k: number; ph: boolean }
  const side = (xs: number[], rows: number[], keep: (x: number, j: number) => boolean, n0: number): Cell[] => {
    const out: Cell[] = []
    xs.forEach(x => rows.forEach(j => out.push({ id: 'c' + (n0 + out.length), cx: x + 55, cy: j * 110 + 55, k: (n0 + out.length) % 4, ph: !keep(x, j) })))
    return out
  }
  const R9 = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const cellsL = side([0, 110, 220, 330], R9, x => x === 0, 0)
  const cellsR = side([1160, 1270, 1380, 1490], R9, x => x === 1490, 36)
  const cellsM = side([440, 550, 660, 770, 880, 990], [8], () => false, 72)
  // solid pixel rings: 8px squares on an 8px grid, 3 cells (24px) thick, each with a darker 1px outline
  const RC = [['#fe2d84', '#8c1348', 110], ['#fc801d', '#9a4208', 155], ['#3574f0', '#162f8a', 200]] as [string, string, number][]
  const ringSyms = RC.map(([fill, line, r], i) => {
    let q = ''
    const m = Math.ceil(r / 8) + 1
    for (let gy = -m; gy < m; gy++) {
      let run = 0
      for (let gx = -m; gx <= m; gx++) {
        const d = Math.hypot(gx * 8 + 4, gy * 8 + 4)
        if (gx <= m - 1 && d <= r && d > r - 24) run++
        else if (run) { q += `<rect x="${(gx - run) * 8}" y="${gy * 8}" width="${run * 8}" height="8"/>`; run = 0 }
      }
    }
    return `<g id="rg${i + 1}"><g fill="${line}" stroke="${line}" stroke-width="2">${q}</g><g fill="${fill}">${q}</g></g>`
  }).join('')
  const PC = ['#fe2d84', '#fc801d', '#4a8cff', '#f4f6ff']
  const ptSym = `<g id="pt">${Array.from({ length: 24 }, (_, k) => {
    const a = (k / 24) * Math.PI * 2 + rnd() * 0.2, d = 120 + rnd() * 80, sz = 8 + Math.round(rnd() * 4), c = PC[k % 4]
    const px = (t: number, o: number, z: number) => `<rect x="${f(Math.cos(a) * (d - t) - z / 2)}" y="${f(Math.sin(a) * (d - t) - z / 2)}" width="${z}" height="${z}" fill="${c}"${o < 1 ? ` opacity="${o}"` : ''}/>`
    return px(0, 1, sz) + px(18, 0.5, 6) + px(34, 0.28, 4)
  }).join('')}</g>`
  const star = Array.from({ length: 16 }, (_, k) => {
    const rr = k % 2 ? 8 : k % 4 === 0 ? 35 : 24, a = (k * Math.PI) / 8
    return `${f(Math.cos(a) * rr)} ${f(Math.sin(a) * rr)}`
  }).join(' ')
  const clampC = (c: Cell) => ({ x: Math.min(1500, Math.max(100, c.cx)), y: Math.min(900, Math.max(100, c.cy)) })
  const ripple = (g: string, cells: Cell[]) => {
    const L = (off: number) => cells.map(c => `${c.id}.click${off ? '+' + off + 's' : ''}`).join(';')
    const ring = (i: number) =>
      `<g transform="scale(.01)"><animateTransform attributeName="transform" type="scale" values=".28;1" dur=".5s" begin="${L(0)}" fill="remove"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.8;1" dur=".65s" begin="${L(0)}" fill="remove"/><use href="#rg${i}"/></g>`
    return `<g id="rip${g}"><g transform="translate(-999 -999)">` +
      cells.map(c => { const p = clampC(c); return `<animateTransform attributeName="transform" type="translate" from="${p.x} ${p.y}" to="${p.x} ${p.y}" dur=".01s" begin="${c.id}.click" fill="freeze"/>` }).join('') +
      ring(1) + ring(2) + ring(3) +
      `<g transform="scale(.01)"><animateTransform attributeName="transform" type="scale" values=".4;1.2" dur=".18s" begin="${L(0)}" fill="remove"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.5;1" dur=".18s" begin="${L(0)}" fill="remove"/><polygon points="${star}" fill="#fff8c8" stroke="#ffd76a" stroke-width="2"/></g>` +
      `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 30" dur=".8s" begin="${L(0)}" fill="remove"/><g transform="scale(.01)"><animateTransform attributeName="transform" type="scale" values=".3;1" dur=".8s" begin="${L(0)}" fill="remove" calcMode="spline" keyTimes="0;1" keySplines=".1 .8 .3 1"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.65;1" dur=".8s" begin="${L(0)}" fill="remove"/><use href="#pt"/></g></g>` +
      `</g></g>`
  }
  const cellG = (g: string, cells: Cell[]) => `<g id="cells${g}">` + cells.map(c => `<g${c.ph ? ' class="ph"' : ''}><rect id="${c.id}" class="hit" x="${c.cx - 55}" y="${c.cy - 55}" width="110" height="110" fill="none" pointer-events="all"/><rect class="gl" x="${c.cx - 55}" y="${c.cy - 55}" width="110" height="110"/></g>`).join('') + '</g>'

  // code-brace silhouettes: the lit hero object on each edge, drawn through the mosaic
  const GF = "Menlo, Consolas, 'DejaVu Sans Mono', monospace"
  const brace = (id: string, glyph: string, x: number, cells: Cell[], loc: (c: Cell) => number, clip: string) => {
    const gx = x - 230
    const lit = `<g clip-path="url(#${clip})" opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.6;1" dur=".3s" begin="${cells.map(c => c.id + '.click').join(';')}" fill="remove"/><text x="${x + 1.5}" y="738" text-anchor="middle" font-family="${GF}" font-weight="700" font-size="860" fill="#ffffff" opacity=".9">${glyph}</text></g>`
    const clipP = `<clipPath id="${clip}"><circle r="200" cx="${x}" cy="-999">${cells.map(c => `<set attributeName="cy" to="${Math.min(900, Math.max(100, c.cy))}" begin="${c.id}.click" fill="freeze"/>`).join('')}</circle></clipPath>`
    return clipP + `<g id="${id}"><g class="bre" style="animation-delay:${id === 'brl' ? -2 : -7}s">
<circle cx="${x + (glyph === '{' ? 100 : -100)}" cy="850" r="110" fill="url(#tg)"/>
<text x="${x + 1.5}" y="738" text-anchor="middle" font-family="${GF}" font-weight="700" font-size="860" fill="#d6e4ff" opacity=".55">${glyph}</text>
${lit}
${busy ? `<g class="bnd"><rect x="${x - 210}" y="0" width="420" height="100" fill="url(#bbg)" opacity=".75"/></g>` : ''}</g></g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<defs>
<linearGradient id="base" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#c02a78"/><stop offset=".28" stop-color="#35305e"/><stop offset=".5" stop-color="#2b2d4c"/><stop offset=".75" stop-color="#1b1f3c"/><stop offset="1" stop-color="#090a1a"/></linearGradient>
<radialGradient id="rl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fe2d84"/><stop offset=".55" stop-color="#fe2d84" stop-opacity=".5"/><stop offset="1" stop-color="#fe2d84" stop-opacity="0"/></radialGradient>
<radialGradient id="ro" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fc801d"/><stop offset=".55" stop-color="#fc801d" stop-opacity=".5"/><stop offset="1" stop-color="#fc801d" stop-opacity="0"/></radialGradient>
<radialGradient id="rc" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff6aa0"/><stop offset=".5" stop-color="#ff3a80" stop-opacity=".6"/><stop offset="1" stop-color="#ff3a80" stop-opacity="0"/></radialGradient>
<radialGradient id="rt" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#4264f2"/><stop offset=".6" stop-color="#3a62f0" stop-opacity=".55"/><stop offset="1" stop-color="#3a62f0" stop-opacity="0"/></radialGradient>
<radialGradient id="rn" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#05060f"/><stop offset=".6" stop-color="#090a1a" stop-opacity=".7"/><stop offset="1" stop-color="#090a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="rm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3a3f9a"/><stop offset="1" stop-color="#2a3080" stop-opacity="0"/></radialGradient>
<radialGradient id="veil" cx="50%" cy="46%" r="50%"><stop offset="0" stop-color="#0a0c1c" stop-opacity=".42"/><stop offset=".6" stop-color="#0a0c1c" stop-opacity=".2"/><stop offset="1" stop-color="#0a0c1c" stop-opacity="0"/></radialGradient>
<radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset=".6" stop-color="#05060c" stop-opacity="0"/><stop offset="1" stop-color="#05060c" stop-opacity=".55"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e0a8ff" stop-opacity=".8"/><stop offset=".6" stop-color="#a078f8" stop-opacity=".4"/><stop offset="1" stop-color="#9a70f0" stop-opacity="0"/></radialGradient>
<radialGradient id="tg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3574f0" stop-opacity=".75"/><stop offset=".6" stop-color="#3574f0" stop-opacity=".25"/><stop offset="1" stop-color="#3574f0" stop-opacity="0"/></radialGradient>
<linearGradient id="bbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3574f0" stop-opacity=".7"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#3574f0" stop-opacity=".7"/></linearGradient>
<linearGradient id="bgl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5aa0"/><stop offset=".55" stop-color="#7a6cf0"/><stop offset="1" stop-color="#2a3f9a"/></linearGradient>
<linearGradient id="bgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a78"/><stop offset=".55" stop-color="#8a74f0"/><stop offset="1" stop-color="#2a3f9a"/></linearGradient>
<linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a4a" stop-opacity="0"/><stop offset=".35" stop-color="#1a1a4a" stop-opacity=".92"/><stop offset="1" stop-color="#1a1a4a" stop-opacity=".97"/></linearGradient>
<pattern id="bay3" width="32" height="32" patternUnits="userSpaceOnUse">${bayer3}</pattern>
<pattern id="gaps3" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0H8M0 0V8" stroke="#12123a" stroke-width="2.7"/></pattern>
<linearGradient id="pcm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2d62" stop-opacity="0"/><stop offset=".3" stop-color="#2a2d62" stop-opacity=".85"/><stop offset=".7" stop-color="#2a2d62" stop-opacity=".85"/><stop offset="1" stop-color="#2a2d62" stop-opacity="0"/></linearGradient>
<radialGradient id="pm" cx="50%" cy="60%" r="50%"><stop offset="0" stop-color="#3a58e8" stop-opacity=".7"/><stop offset=".5" stop-color="#7a44c8" stop-opacity=".35"/><stop offset="1" stop-color="#7a44c8" stop-opacity="0"/></radialGradient>
<linearGradient id="gmp" gradientUnits="userSpaceOnUse" x1="569" y1="0" x2="1031" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".27" stop-color="#1c1c1c"/><stop offset=".73" stop-color="#1c1c1c"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="mph"><rect width="1600" height="1000" fill="url(#gmp)"/></mask>
<linearGradient id="gband" x1="0" y1="0" x2="0" y2="1"><stop offset=".2" stop-color="#000"/><stop offset=".27" stop-color="#fff"/><stop offset=".36" stop-color="#fff"/><stop offset=".44" stop-color="#000"/></linearGradient>
<mask id="mband"><rect width="1600" height="1000" fill="url(#gband)"/></mask>
<linearGradient id="pc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15153c" stop-opacity="0"/><stop offset=".15" stop-color="#15153c" stop-opacity=".3"/><stop offset=".3" stop-color="#15153c" stop-opacity=".6"/><stop offset=".5" stop-color="#15153c" stop-opacity=".88"/><stop offset=".7" stop-color="#15153c" stop-opacity="1"/></linearGradient>
<filter id="sbp" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="1800"><feGaussianBlur stdDeviation="70"/></filter>
${ringSyms}${ptSym}
<filter id="bb" filterUnits="userSpaceOnUse" x="-100" y="0" width="900" height="1000"><feGaussianBlur stdDeviation="5"/></filter>
<pattern id="gaps" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0H7M0 0V7" stroke="#12123a" stroke-width="2.4"/></pattern>
<linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset=".62" stop-color="#000"/><stop offset=".95" stop-color="#fff"/></linearGradient>
<mask id="gapm"><rect width="1600" height="1000" fill="url(#gg)"/></mask>
<pattern id="gaps2" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0H5M0 0V5" stroke="#090a1a" stroke-width="1.8"/></pattern>
<linearGradient id="gn" x1="0" y1="0" x2="0" y2="1"><stop offset=".65" stop-color="#fff"/><stop offset="1" stop-color="#555"/></linearGradient>
<linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset=".18" stop-color="#fff"/><stop offset=".3" stop-color="#666"/><stop offset=".7" stop-color="#666"/><stop offset=".85" stop-color="#fff"/><stop offset="1" stop-color="#555"/></linearGradient>
<mask id="mnd"><rect width="1600" height="1000" fill="url(#gn)"/></mask>
<mask id="mnp"><rect width="1600" height="1000" fill="url(#gp)"/></mask>
<pattern id="bay" width="28" height="28" patternUnits="userSpaceOnUse">${bayer}</pattern>
<linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#fff"/><stop offset=".78" stop-color="#000"/></linearGradient>
<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#000"/><stop offset=".78" stop-color="#fff"/></linearGradient>
<linearGradient id="gc" x1="0" y1="0" x2="1" y2="0"><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".5"/><stop offset=".7" stop-color="#fff" stop-opacity=".5"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="gc2" x1="0" y1="0" x2="1" y2="0"><stop offset=".12" stop-color="#2b3a8c" stop-opacity="0"/><stop offset=".32" stop-color="#2b3a8c" stop-opacity=".3"/><stop offset=".68" stop-color="#2b3a8c" stop-opacity=".3"/><stop offset=".88" stop-color="#2b3a8c" stop-opacity="0"/></linearGradient>
<linearGradient id="gm" x1="0" y1="0" x2="1" y2="0"><stop offset=".12" stop-color="#fff"/><stop offset=".3" stop-color="#505050"/><stop offset=".7" stop-color="#505050"/><stop offset=".88" stop-color="#fff"/></linearGradient>
<linearGradient id="gs" x1="0" y1="0" x2="1" y2="0"><stop offset=".18" stop-color="#fff"/><stop offset=".33" stop-color="#3c3c3c"/><stop offset=".67" stop-color="#3c3c3c"/><stop offset=".82" stop-color="#fff"/></linearGradient>
<mask id="mt"><rect width="1600" height="1000" fill="url(#gt)"/></mask>
<mask id="mb"><rect width="1600" height="1000" fill="url(#gb)"/></mask>
<mask id="mbay"><rect width="1600" height="1000" fill="url(#gm)"/></mask>
<mask id="msw"><rect width="1600" height="1000" fill="url(#gs)"/></mask>
<filter id="nz" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><feTurbulence type="fractalNoise" baseFrequency=".17" numOctaves="1" seed="7"/><feColorMatrix values="1.2 0 0 0 -.1  1.2 0 0 0 -.1  1.2 0 0 0 -.1  0 0 0 0 1"/></filter>
<filter id="q" filterUnits="userSpaceOnUse" x="0" y="0" width="1603" height="1001" color-interpolation-filters="sRGB"><feFlood x="3" y="3" width="1" height="1"/><feComposite width="7" height="7" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="3"/><feColorMatrix values="1 0 0 0 0  0 .84 0 0 0  0 0 1 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncR type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncG type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncB type="discrete" tableValues="0.06 .22 .4 .56 .72 .88"/></feComponentTransfer></filter>
<filter id="q2" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000" color-interpolation-filters="sRGB"><feFlood x="2" y="2" width="1" height="1"/><feComposite width="5" height="5" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="2"/><feColorMatrix values="1 0 0 0 0  0 .84 0 0 0  0 0 1 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncR type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncG type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncB type="discrete" tableValues="0.06 .22 .4 .56 .72 .88"/></feComponentTransfer></filter>
<filter id="q3" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000" color-interpolation-filters="sRGB"><feFlood x="4" y="4" width="1" height="1"/><feComposite width="8" height="8" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="4"/><feColorMatrix values="1 0 0 0 0  0 .84 0 0 0  0 0 1 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncR type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncG type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncB type="discrete" tableValues="0.06 .22 .4 .56 .72 .88"/></feComponentTransfer></filter>
<filter id="sb" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="1800"><feGaussianBlur stdDeviation="26"/></filter>
</defs>
<style>
svg *{pointer-events:none} svg .hit, svg .hit *{pointer-events:all}
.bre{animation:br ${busy ? 7 : 18}s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes br{0%,100%{opacity:${busy ? 0.85 : 0.75};transform:scale(1)}50%{opacity:1;transform:scale(${busy ? 1.1 : 1.05})}}
.dr{animation:dr ${busy ? 9 : 40}s ease-in-out infinite alternate}
@keyframes dr{from{transform:translate(0,0)}to{transform:translate(${busy ? '90px,60px' : '14px,8px'})}}
.sw{animation:sw 14s ease-in-out infinite alternate}
@keyframes sw{from{transform:translateY(-170px)}to{transform:translateY(170px)}}
.lum{opacity:0;animation:lm 7s ease-in-out infinite alternate}
@keyframes lm{to{opacity:.05}}
.gl{fill:#ffe6f2;opacity:0;transition:opacity .25s}
.hit:hover+.gl{opacity:.25}
.hit{cursor:pointer}
#ga,#gb,#bm{transform-origin:0 0}
#pgl,#pbl,#pcal{display:none}
.bnd{animation:bnd 5s ease-in-out infinite alternate}
@keyframes bnd{from{transform:translateY(170px)}to{transform:translateY(720px)}}
@media (max-aspect-ratio:1/1){
#fq{filter:url(#q3)}
#pgl,#pbl,#pcal{display:inline}
#pfr{opacity:.6}
#bw{mask:none}
#bands{opacity:.45;filter:url(#sbp)}
#bayr{fill:url(#bay3);mask:url(#mph);opacity:.9}
#gapr{fill:url(#gaps3)}
#nzr{display:none}
#ga{transform:translate(380px,60px)}
#gb{transform:translate(-520px,40px);opacity:.5}
#bm{transform:translate(420px,0)}
#brl{transform:translate(639px,500px) scale(.27,.88) translate(-230px,-480px)}
#brr{transform:translate(961px,500px) scale(.27,.88) translate(-1370px,-480px)}
#ripL{transform:translate(629px,0)}
#cellsL{transform:translate(569px,0)}
#ripR{transform:translate(-622px,0)}
#cellsR{transform:translate(-577px,0)}
#cellsM,#ripM,.ph{display:none}
}
@media (prefers-reduced-motion: reduce){*{animation:none !important}}
</style>
<rect width="1600" height="1000" fill="#090a1a"/>
<g id="fq" filter="url(#q)">
<rect width="1600" height="1000" fill="url(#base)"/>
<g class="dr">
<g id="ga"><ellipse cx="160" cy="90" rx="470" ry="340" fill="url(#rl)" class="bre"/></g>
<g id="gb"><ellipse cx="1460" cy="140" rx="440" ry="360" fill="url(#ro)" opacity=".95" class="bre" style="animation-delay:-5s"/></g>
<ellipse cx="800" cy="520" rx="640" ry="260" fill="url(#rt)" opacity=".62" class="bre" style="animation-delay:-9s"/>
<ellipse cx="1560" cy="700" rx="300" ry="300" fill="url(#rt)" opacity=".45"/>
<g id="bm"><ellipse cx="120" cy="40" rx="420" ry="280" fill="url(#rc)" opacity=".7" class="bre" style="animation-delay:-3s"/></g>
<ellipse cx="90" cy="760" rx="360" ry="260" fill="url(#rm)" opacity=".6"/>
</g>
<ellipse cx="800" cy="1040" rx="1100" ry="360" fill="url(#rn)"/>
${busy ? `<g id="bw" mask="url(#msw)"><g id="bands" filter="url(#sb)"><g transform="rotate(-38 800 500)"><g class="sw">${bands}</g></g></g></g><rect width="1600" height="1000" fill="#fff" class="lum"/>` : ''}
<rect width="1600" height="1000" fill="url(#veil)"/>
<rect width="1600" height="1000" fill="url(#gc2)"/>
<rect width="1600" height="1000" fill="#090a1a" opacity="${busy ? 0.0 : 0.14}"/>
<ellipse id="pgl" cx="1010" cy="300" rx="320" ry="300" fill="url(#ro)" opacity=".8"/>
<rect id="pbl" x="250" y="760" width="1100" height="240" fill="url(#pm)"/>
<rect id="pfr" y="660" width="1600" height="340" fill="url(#pf)"/>
<rect id="pcal" x="650" width="300" height="1000" fill="url(#pcm)"/>
${brace('brl', '{', 230, cellsL, c => c.cy, 'clL')}
${brace('brr', '}', 1370, cellsR, c => c.cy, 'clR')}
<rect id="nzr" width="1600" height="1000" filter="url(#nz)" opacity=".16" mask="url(#mnd)"/>
<rect id="bayr" width="1600" height="1000" fill="url(#bay)" mask="url(#mbay)"/>
</g>
<g mask="url(#gapm)"><rect id="gapr" width="1600" height="1000" fill="url(#gaps)"/></g>
<rect width="1600" height="1000" fill="url(#vg)"/>
<g id="fxl">${ripple("L", cellsL)}${ripple("R", cellsR)}${ripple("M", cellsM)}</g>
${cellG("L", cellsL)}${cellG("R", cellsR)}${cellG("M", cellsM)}
</svg>`
}
