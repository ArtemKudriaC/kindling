// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
export function rasterScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  let seed = 9173
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
  const f = (n: number) => +n.toFixed(1)

  // Bayer 4x4 threshold cells (6px each): ordered dither fed into the quantizer
  const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
  const bayer = B.map((v, i) => {
    const t = (v + 0.5) / 16 - 0.5
    const a = Math.abs(t) * 0.5
    return `<rect x="${(i % 4) * 7}" y="${Math.floor(i / 4) * 7}" width="7" height="7" fill="${t > 0 ? '#ffffff' : '#000000'}" opacity="${a.toFixed(3)}"/>`
  }).join('')

  // wide soft diagonal bands: the busy sweep (carries the dither)
  const bands = ([[-420, 110, '#f0f8a0', 0.8], [-130, 80, '#05202a', 0.75], [150, 120, '#d8f070', 0.7], [430, 90, '#041a24', 0.7]] as [number, number, string, number][])
    .map(([y, h, c, o]) => `<rect x="-1200" y="${y}" width="4000" height="${h}" fill="${c}" opacity="${o}"/>`).join('')

  // tapered organic stem
  const bez = (p: number[][], t: number) => {
    const u = 1 - t
    return [0, 1].map(k => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k])
  }
  const taper = (p: number[][], w0: number, w1: number) => {
    const L: number[][] = [], R: number[][] = []
    const n = 18
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
  const stems: string[] = []
  let leaves = ''
  const main = [[1660, -40], [1520, 90], [1400, 150], [1215, 330]]
  stems.push(taper(main, 64, 12))
  const leaf = (x: number, y: number, ang: number, s: number) => {
    const g = ['lit', 'mid', 'dk'][Math.floor(rnd() * rnd() * 3 + (rnd() < 0.5 ? 0 : 0.4))] || 'mid'
    return `<use href="#lf" fill="url(#l-${g})" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(${s.toFixed(2)})"/>`
  }
  const twigs = [
    { t: 0.12, e: [1600, 300], bow: 60 }, { t: 0.3, e: [1505, 470], bow: -50 }, { t: 0.5, e: [1395, 560], bow: 70 },
    { t: 0.72, e: [1300, 450], bow: -60 }, { t: 0.9, e: [1235, 560], bow: 40 },
  ]
  twigs.forEach(tw => {
    const a = bez(main, tw.t)
    const e = tw.e
    const p = [a, [a[0] + (e[0] - a[0]) * 0.2 + tw.bow, a[1] + (e[1] - a[1]) * 0.45], [a[0] + (e[0] - a[0]) * 0.8, a[1] + (e[1] - a[1]) * 0.75 - tw.bow * 0.3], e]
    stems.push(taper(p, 26, 6))
    for (let k = 1; k <= 7; k++) {
      const t = k / 7
      const q = bez(p, t)
      const side = k % 2 ? -1 : 1
      const base = Math.atan2(e[1] - a[1], e[0] - a[0]) * 180 / Math.PI
      leaves += leaf(q[0], q[1], base + side * (35 + rnd() * 30) + (rnd() - 0.5) * 20, 1.3 + rnd() * 0.8 - t * 0.4)
    }
    if (tw.t !== 0.72) { for (let k = 0; k < 6; k++) leaves += `<circle cx="${f(e[0] + Math.cos(k * 1.047 + tw.t * 5) * 24)}" cy="${f(e[1] + Math.sin(k * 1.047 + tw.t * 5) * 24)}" r="22" fill="url(#bl-c)"/>`; leaves += `<circle cx="${f(e[0])}" cy="${f(e[1])}" r="15" fill="#e8b84a"/>` }
    leaves += leaf(e[0], e[1], Math.atan2(e[1] - a[1], e[0] - a[0]) * 180 / Math.PI, 0.9)
  })
  for (let k = 0; k < 7; k++) {
    const q = bez(main, 0.08 + k * 0.13)
    leaves += leaf(q[0], q[1], -70 - rnd() * 60, 1.1 + rnd() * 0.4)
  }

  // soft out-of-focus foliage on the opposite edge for depth
  let bokeh = ''
  for (let i = 0; i < 6; i++) {
    bokeh += `<use href="#lf" fill="url(#l-dk)" opacity="${(0.55 + rnd() * 0.3).toFixed(2)}" transform="translate(${f(-30 + rnd() * 160)} ${f(520 + i * 80 + rnd() * 40)}) rotate(${f(-50 + rnd() * 100)}) scale(${(2 + rnd() * 1.6).toFixed(2)})"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<defs>
<linearGradient id="base" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#a8d040"/><stop offset=".3" stop-color="#3f9a5c"/><stop offset=".62" stop-color="#14566a"/><stop offset="1" stop-color="#070d1a"/></linearGradient>
<radialGradient id="rl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#d4f060"/><stop offset=".55" stop-color="#a8d44a" stop-opacity=".55"/><stop offset="1" stop-color="#8fbf3c" stop-opacity="0"/></radialGradient>
<radialGradient id="rc" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f8efb8"/><stop offset=".5" stop-color="#e8e090" stop-opacity=".8"/><stop offset="1" stop-color="#e8e090" stop-opacity="0"/></radialGradient>
<radialGradient id="rt" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#1fa59a"/><stop offset=".6" stop-color="#18808a" stop-opacity=".5"/><stop offset="1" stop-color="#14707a" stop-opacity="0"/></radialGradient>
<radialGradient id="rn" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#050a16"/><stop offset=".6" stop-color="#07101d" stop-opacity=".7"/><stop offset="1" stop-color="#07101d" stop-opacity="0"/></radialGradient>
<radialGradient id="rm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#6c9a2c"/><stop offset="1" stop-color="#4a7a28" stop-opacity="0"/></radialGradient>
<radialGradient id="veil" cx="50%" cy="46%" r="50%"><stop offset="0" stop-color="#06101a" stop-opacity=".4"/><stop offset=".6" stop-color="#06101a" stop-opacity=".18"/><stop offset="1" stop-color="#06101a" stop-opacity="0"/></radialGradient>
<radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset=".6" stop-color="#04070d" stop-opacity="0"/><stop offset="1" stop-color="#04070d" stop-opacity=".55"/></radialGradient>
<linearGradient id="l-lit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f9d3c"/><stop offset=".5" stop-color="#566a28"/><stop offset="1" stop-color="#42602c"/></linearGradient>
<linearGradient id="l-mid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6c7c36"/><stop offset=".5" stop-color="#4e6330"/><stop offset="1" stop-color="#34472a"/></linearGradient>
<linearGradient id="l-dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#46592a"/><stop offset=".6" stop-color="#35482c"/><stop offset="1" stop-color="#25331e"/></linearGradient>
<linearGradient id="bl-c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6dc"/><stop offset="1" stop-color="#e8c898"/></linearGradient>
<linearGradient id="stem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c6742"/><stop offset=".5" stop-color="#5e4c30"/><stop offset="1" stop-color="#3c3022"/></linearGradient>
<linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stop-color="#000"/><stop offset=".85" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient>
<path id="lf" d="M0 0C16-26 54-30 96 0C54 30 16 26 0 0Z"/>
<pattern id="gaps" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0H7M0 0V7" stroke="#050913" stroke-width="2.4"/></pattern>
<linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset=".62" stop-color="#000"/><stop offset=".95" stop-color="#fff"/></linearGradient>
<mask id="gapm"><rect width="1600" height="1000" fill="url(#gg)"/></mask>
<pattern id="gaps2" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0H5M0 0V5" stroke="#050913" stroke-width="1.8"/></pattern>
<linearGradient id="gn" x1="0" y1="0" x2="0" y2="1"><stop offset=".65" stop-color="#fff"/><stop offset="1" stop-color="#555"/></linearGradient>
<linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset=".18" stop-color="#fff"/><stop offset=".3" stop-color="#666"/><stop offset=".7" stop-color="#666"/><stop offset=".85" stop-color="#fff"/><stop offset="1" stop-color="#555"/></linearGradient>
<mask id="mnd"><rect width="1600" height="1000" fill="url(#gn)"/></mask>
<mask id="mnp"><rect width="1600" height="1000" fill="url(#gp)"/></mask>
<pattern id="bay" width="28" height="28" patternUnits="userSpaceOnUse">${bayer}</pattern>
<linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#fff"/><stop offset=".78" stop-color="#000"/></linearGradient>
<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#000"/><stop offset=".78" stop-color="#fff"/></linearGradient>
<linearGradient id="gc" x1="0" y1="0" x2="1" y2="0"><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".5"/><stop offset=".7" stop-color="#fff" stop-opacity=".5"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="gc2" x1="0" y1="0" x2="1" y2="0"><stop offset=".12" stop-color="#1a7480" stop-opacity="0"/><stop offset=".32" stop-color="#1a7480" stop-opacity=".3"/><stop offset=".68" stop-color="#1a7480" stop-opacity=".3"/><stop offset=".88" stop-color="#1a7480" stop-opacity="0"/></linearGradient>
<linearGradient id="gm" x1="0" y1="0" x2="1" y2="0"><stop offset=".12" stop-color="#fff"/><stop offset=".3" stop-color="#808080"/><stop offset=".7" stop-color="#808080"/><stop offset=".88" stop-color="#fff"/></linearGradient>
<linearGradient id="gs" x1="0" y1="0" x2="1" y2="0"><stop offset=".18" stop-color="#fff"/><stop offset=".33" stop-color="#666"/><stop offset=".67" stop-color="#666"/><stop offset=".82" stop-color="#fff"/></linearGradient>
<mask id="mt"><rect width="1600" height="1000" fill="url(#gt)"/></mask>
<mask id="mb"><rect width="1600" height="1000" fill="url(#gb)"/></mask>
<mask id="mbay"><rect width="1600" height="1000" fill="url(#gm)"/></mask>
<mask id="msw"><rect width="1600" height="1000" fill="url(#gs)"/></mask>
<filter id="nz" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><feTurbulence type="fractalNoise" baseFrequency=".17" numOctaves="1" seed="7"/><feColorMatrix values="1.2 0 0 0 -.1  0 1.2 0 0 -.1  0 0 1.2 0 -.1  0 0 0 0 1"/></filter>
<filter id="q" filterUnits="userSpaceOnUse" x="0" y="0" width="1603" height="1001" color-interpolation-filters="sRGB"><feFlood x="3" y="3" width="1" height="1"/><feComposite width="7" height="7" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="3"/><feComponentTransfer><feFuncR type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncG type="discrete" tableValues="0.04 .22 .46 .68 .88 .99"/><feFuncB type="discrete" tableValues="0.06 .22 .4 .56 .72 .88"/></feComponentTransfer></filter>
<filter id="q2" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000" color-interpolation-filters="sRGB"><feFlood x="2" y="2" width="1" height="1"/><feComposite width="5" height="5" result="px"/><feTile in="px" result="tl"/><feComposite in="SourceGraphic" in2="tl" operator="in"/><feMorphology operator="dilate" radius="2"/><feComponentTransfer><feFuncR type="discrete" tableValues="0.02 .2 .42 .64 .85 .98"/><feFuncG type="discrete" tableValues="0.04 .22 .46 .68 .88 .99"/><feFuncB type="discrete" tableValues="0.06 .22 .4 .56 .72 .88"/></feComponentTransfer></filter>
<filter id="sb" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="1800"><feGaussianBlur stdDeviation="26"/></filter>
<filter id="bs" filterUnits="userSpaceOnUse" x="800" y="-200" width="1000" height="1000"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="bk" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1400"><feGaussianBlur stdDeviation="${busy ? '7 3.6' : '12'}"/></filter>
</defs>
<style>
.bre{animation:br ${busy ? 7 : 18}s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes br{0%,100%{opacity:${busy ? 0.85 : 0.75};transform:scale(1)}50%{opacity:1;transform:scale(${busy ? 1.1 : 1.05})}}
.dr{animation:dr ${busy ? 9 : 40}s ease-in-out infinite alternate}
@keyframes dr{from{transform:translate(0,0)}to{transform:translate(${busy ? '90px,60px' : '14px,8px'})}}
.sw{animation:sw 14s ease-in-out infinite alternate}
@keyframes sw{from{transform:translateY(-170px)}to{transform:translateY(170px)}}
.lum{opacity:0;animation:lm 7s ease-in-out infinite alternate}
@keyframes lm{to{opacity:.07}}
.sway{transform-origin:1660px -40px;animation:sy ${busy ? 6 : 14}s ease-in-out infinite alternate}
@keyframes sy{from{transform:rotate(-1.2deg)}to{transform:rotate(${busy ? 2.2 : 1.2}deg)}}
#br,#ga,#gb,#bkh,#bm{transform-origin:0 0}
@media (max-aspect-ratio:1/1){
#br{transform:translate(230px,10px) scale(.5)}
#bkh{display:none}
#bands{opacity:.9}
#bw{mask:none}
#fq{filter:url(#q2)}
#bayr{display:none}
#nzr{opacity:.3;mask:url(#mnp)}
#gapr{fill:url(#gaps2)}
#ga{transform:translate(380px,60px)}
#gb{transform:translate(-460px,60px)}
#bm{transform:translate(420px,0)}
}
@media (prefers-reduced-motion: reduce){*{animation:none !important}}
</style>
<rect width="1600" height="1000" fill="#060b16"/>
<g id="fq" filter="url(#q)">
<rect width="1600" height="1000" fill="url(#base)"/>
<g class="dr">
<g id="ga"><ellipse cx="260" cy="110" rx="680" ry="360" fill="url(#rl)" class="bre"/></g>
<g id="gb"><ellipse cx="1400" cy="170" rx="620" ry="400" fill="url(#rl)" opacity=".95" class="bre" style="animation-delay:-5s"/></g>
<ellipse cx="800" cy="540" rx="760" ry="300" fill="url(#rt)" opacity=".75" class="bre" style="animation-delay:-9s"/>

<ellipse cx="1560" cy="700" rx="360" ry="320" fill="url(#rt)" opacity=".6"/>
<g id="bm"><ellipse cx="150" cy="30" rx="560" ry="320" fill="url(#rc)" opacity=".85" class="bre" style="animation-delay:-3s"/></g>
<ellipse cx="90" cy="680" rx="400" ry="280" fill="url(#rm)" opacity=".6"/>
</g>
<ellipse cx="800" cy="1040" rx="1100" ry="360" fill="url(#rn)"/>
${busy ? `<g id="bw" mask="url(#msw)"><g id="bands" filter="url(#sb)"><g transform="rotate(-38 800 500)"><g class="sw">${bands}</g></g></g></g><rect width="1600" height="1000" fill="#fff" class="lum"/>` : ''}
<g id="bkh" filter="url(#bk)" opacity=".35">${bokeh}</g>
<g id="br"><g class="sway"><g filter="url(#${busy ? 'bk' : 'bs'})">
${stems.map(d => `<path d="${d}" fill="url(#stem)"/>`).join('')}
${leaves}
</g></g></g>
<rect width="1600" height="1000" fill="url(#veil)"/>
<rect width="1600" height="1000" fill="url(#gc2)"/>
<rect width="1600" height="1000" fill="#050b15" opacity="${busy ? 0.0 : 0.16}"/>
<rect id="nzr" width="1600" height="1000" filter="url(#nz)" opacity=".16" mask="url(#mnd)"/>
<rect id="bayr" width="1600" height="1000" fill="url(#bay)" mask="url(#mbay)"/>
</g>
<g mask="url(#gapm)"><rect id="gapr" width="1600" height="1000" fill="url(#gaps)"/></g>
<rect width="1600" height="1000" fill="url(#vg)"/>
</svg>`
}
