// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
export function hackerScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  let seed = 4242
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)]
  const LH = 24
  const N = 40
  const src = ['net', 'build', 'auth', 'cache', 'sync', 'index']
  const act = ['fetch pkg/core', 'resolve deps', 'link module', 'ack 10.0.3.', 'rx 1420B', 'verify sha256', 'open stream', 'write chunk']
  const rows: string[] = []
  for (let i = 0; i < N; i++) {
    const t = `04:${String(10 + Math.floor(i / 8)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`
    const s = pick(src)
    const a = pick(act)
    const tail = a.endsWith('.') ? String(Math.floor(rnd() * 250)) : a.endsWith('1420B') ? `10.${Math.floor(rnd() * 9)}.${Math.floor(rnd() * 40)}.${Math.floor(rnd() * 250)}` : `${20 + Math.floor(rnd() * 380)}ms`
    if (i === 13)
      rows.push(`<text x="146" y="${i * LH}" class="t">${t} <tspan class="w">warn  retry 2/3 after 410ms</tspan></text>`)
    else
      rows.push(`<text x="146" y="${i * LH}" class="t">${t} <tspan class="g">${s.padEnd(5)}</tspan> ${a} ${tail}</text>`)
  }
  const setG = (c: string) => `<g class="${c}">${rows.join('')}</g>`
  const log = setG('a') + `<g transform="translate(0 ${N * LH})">${setG('b')}</g>`

  const nodes: [number, number, number][] = [
    [1130, 330, 7], [1215, 230, 9], [1340, 270, 12], [1470, 215, 8], [1550, 330, 7], [1250, 400, 10], [1400, 420, 16],
    [1520, 500, 9], [1170, 500, 7], [1300, 560, 11], [1430, 620, 8], [1540, 660, 6], [1230, 670, 7],
  ]
  const links: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 5], [2, 5], [2, 6], [3, 6], [4, 6], [4, 7], [5, 6], [5, 8], [5, 9],
    [6, 7], [6, 9], [6, 10], [7, 10], [7, 11], [8, 9], [8, 12], [9, 10], [9, 12], [10, 11],
  ]
  const route = [8, 5, 2, 6, 7, 11]
  const rp = route.map(i => `${nodes[i][0]} ${nodes[i][1]}`)
  const routeD = 'M' + rp.join(' L')
  let L = 0
  for (let i = 1; i < route.length; i++) L += Math.hypot(nodes[route[i]][0] - nodes[route[i - 1]][0], nodes[route[i]][1] - nodes[route[i - 1]][1])
  L = Math.ceil(L)
  const AMB = 3
  const linkSvg = links.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" class="lk"/>`).join('')
  const pks = busy ? links.map((_, i) => i) : [3, 11, 17]
  let pk = ''
  pks.forEach((li, pi) => {
    const [a, b] = links[li]
    const fwd = li % 2 === 0
    const s = fwd ? nodes[a] : nodes[b]
    const e = fwd ? nodes[b] : nodes[a]
    const dur = busy ? 2.8 + (pi % 4) * 0.5 : 16 + (pi % 3) * 3
    const del = busy ? -(pi * 0.8) : -(pi * 6)
    pk += `<g class="pk" style="offset-path:path('M${s[0]} ${s[1]} L${e[0]} ${e[1]}');animation-duration:${dur}s;animation-delay:${del.toFixed(1)}s"><circle r="12" fill="url(#pg)"/><circle r="3.4" fill="#ecfff2"/></g>`
  })
  const nodeSvg = nodes.map(([x, y, r], i) => {
    const am = i === AMB
    return `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="url(#${am ? 'haloA' : 'haloG'})"/>` +
      `<circle cx="${x}" cy="${y}" r="${r * 1.7}" class="${am ? 'rA' : busy ? 'rB' : 'r0'}" style="animation-delay:${(busy ? -i * 0.31 : -i * 1.7).toFixed(1)}s"/>` +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${am ? 'nA' : 'nG'})"/>` +
      `<circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.33}" fill="#f4fff7" opacity=".7"/>`
  }).join('')

  const D = 24
  const counts = [96, 214, 312, 471, 658, 842, 1033, 1284]
  const cnt = busy
    ? counts.map((c, i) => `<text x="146" y="0" class="cn" style="animation-name:c${i}"><tspan class="m">compiling </tspan><tspan class="b">${c}</tspan><tspan class="m"> / 1284</tspan></text>`).join('')
    : `<text x="146" y="0" class="idle"><tspan class="m">up to date  </tspan><tspan class="b2">1284</tspan><tspan class="m"> / 1284</tspan></text>`
  const fx = busy ? 1 : 0.55

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17181a"/><stop offset="1" stop-color="#0e0f10"/></linearGradient>
<radialGradient id="tealA" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#14a3a0" stop-opacity="${0.5 * fx + 0.42}"/><stop offset="1" stop-color="#14808a" stop-opacity="0"/></radialGradient>
<radialGradient id="gglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2fd36f" stop-opacity="${busy ? 0.34 : 0.14}"/><stop offset=".6" stop-color="#2fd36f" stop-opacity="${busy ? 0.1 : 0.04}"/><stop offset="1" stop-color="#2fd36f" stop-opacity="0"/></radialGradient>
<radialGradient id="vg" cx="50%" cy="48%" r="75%"><stop offset=".55" stop-color="#050606" stop-opacity="0"/><stop offset="1" stop-color="#050606" stop-opacity=".6"/></radialGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".1"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".04"/><stop offset="1" stop-color="#ffffff" stop-opacity=".07"/></linearGradient>
<linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".3"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".2"/><stop offset="1" stop-color="#ffffff" stop-opacity=".25"/></linearGradient>
<linearGradient id="fy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".14" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="mk" maskUnits="userSpaceOnUse" x="120" y="170" width="420" height="598"><rect x="120" y="170" width="420" height="598" fill="url(#fy)"/></mask>
<radialGradient id="nG" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#a6ffc4"/><stop offset=".55" stop-color="#2fd36f"/><stop offset="1" stop-color="#0f7038"/></radialGradient>
<radialGradient id="nA" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe2a0"/><stop offset=".55" stop-color="#e8a63a"/><stop offset="1" stop-color="#8a5412"/></radialGradient>
<radialGradient id="haloG"><stop offset="0" stop-color="#3ee07a" stop-opacity=".4"/><stop offset="1" stop-color="#3ee07a" stop-opacity="0"/></radialGradient>
<radialGradient id="haloA"><stop offset="0" stop-color="#e8a63a" stop-opacity=".55"/><stop offset="1" stop-color="#e8a63a" stop-opacity="0"/></radialGradient>
<radialGradient id="pg"><stop offset="0" stop-color="#7dffa8" stop-opacity=".9"/><stop offset="1" stop-color="#3ee07a" stop-opacity="0"/></radialGradient>
<filter id="bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="bl2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .8  0 0 0 0 1  0 0 0 0 .9  0 0 0 .5 0"/></filter>
</defs>
<style>
text{font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:14px;white-space:pre}
.t{fill:#9aa09e;opacity:${busy ? 0.78 : 0.45}}
.g{fill:#4fe08a}.w{fill:#e8a63a}
.m{fill:#9aa09e}.b{fill:#7dffa8;font-size:17px}.b2{fill:#7dffa8;font-size:20px}
.cn{opacity:0;fill:#9aa09e;font-size:15px;animation:${D}s steps(1,end) infinite}
.idle{fill:#9aa09e;font-size:18px;opacity:.9}
${busy ? counts.map((_, i) => `@keyframes c${i}{0%{opacity:${i === 0 ? 1 : 0}}${i ? `${i * 12.5}%{opacity:1}` : ''}${(i + 1) * 12.5 < 100 ? `${(i + 1) * 12.5}%{opacity:0}` : ''}}`).join('') : ''}
.lk{stroke:#3ee07a;stroke-width:2.5;stroke-opacity:${busy ? 0.4 : 0.2}}
.scroll{animation:sc ${busy ? 11 : 70}s linear infinite}
@keyframes sc{to{transform:translateY(-${N * LH}px)}}
.pk{animation:pk 5s linear infinite;offset-rotate:0deg;opacity:0}
@keyframes pk{0%{offset-distance:0%;opacity:0}4%{opacity:1}${busy ? 40 : 14}%{opacity:1}${busy ? 46 : 17}%{offset-distance:100%;opacity:0}100%{offset-distance:100%;opacity:0}}
.r0,.rB,.rA{fill:none;stroke:#3ee07a;stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:center}
.rA{stroke:#e8a63a;animation:rp ${busy ? 1.8 : 4.5}s ease-out infinite}
.rB{animation:rp 2.4s ease-out infinite}.r0{animation:rp 11s ease-out infinite}
@keyframes rp{0%{transform:scale(.7);opacity:.7}60%{opacity:0}100%{transform:scale(1.5);opacity:0}}
.route{fill:none;stroke:#6bb6ff;stroke-linecap:round;stroke-linejoin:round}
.rt{stroke-width:${busy ? 5 : 3};stroke-dasharray:${L};${busy ? `stroke-dashoffset:${L};animation:draw ${D}s ease-in-out infinite` : 'opacity:.3'}}
@keyframes draw{0%{stroke-dashoffset:${L}}92%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}
.head{animation:hd ${D}s ease-in-out infinite;offset-rotate:0deg;opacity:0}
@keyframes hd{0%{offset-distance:0%;opacity:1}92%{offset-distance:100%;opacity:1}96%{opacity:0}100%{offset-distance:100%;opacity:0}}
.burst{fill:none;stroke:#6bb6ff;stroke-width:4;opacity:0;transform-box:fill-box;transform-origin:center;animation:bu ${D}s ease-out infinite}
@keyframes bu{0%,90%{transform:scale(.5);opacity:0}91%{opacity:.9}100%{transform:scale(5);opacity:0}}
.prog{transform-origin:146px 0;transform-box:view-box;animation:pr ${D}s ease-in-out infinite}
@keyframes pr{0%{transform:scaleX(.05)}92%,100%{transform:scaleX(1)}}
.cur{fill:#7dffa8;animation:bk 1.1s steps(1) infinite}
@keyframes bk{50%{opacity:0}}
.breathe{animation:br ${busy ? 6 : 14}s ease-in-out infinite}
@keyframes br{0%,100%{opacity:${busy ? 0.85 : 0.7}}50%{opacity:1}}
#pane,#graph{transform-origin:0 0}
@media (max-aspect-ratio:1/1){
#pane{transform:translate(520px,-30px) scale(.5)}
#graph{transform:translate(-225px,230px) scale(.8)}
#tealP{transform:translate(454px,-130px) scale(.7)}
}
@media (prefers-reduced-motion: reduce){*{animation:none !important}}
</style>
<rect width="1600" height="1000" fill="url(#bg)"/>
<g id="tealP"><ellipse cx="330" cy="500" rx="270" ry="300" fill="url(#tealA)" class="breathe"/><ellipse cx="400" cy="620" rx="190" ry="190" fill="#1fb86a" opacity="${busy ? 0.4 : 0.26}" filter="url(#bl2)"/></g>
<ellipse cx="1275" cy="500" rx="470" ry="400" fill="#10707a" opacity="${busy ? 0.22 : 0.12}" filter="url(#bl2)"/>

<g id="graph"><g transform="translate(-60 50)">
<ellipse cx="1335" cy="450" rx="430" ry="380" fill="url(#gglow)" class="breathe"/>
${linkSvg}
<path d="${routeD}" class="route" stroke-width="12" opacity="${busy ? 0.25 : 0}" filter="url(#bl)" ${busy ? `style="stroke-dasharray:${L};stroke-dashoffset:${L};animation:draw ${D}s ease-in-out infinite"` : ''}/>
<path d="${routeD}" class="route rt"/>
${pk}${nodeSvg}
${busy ? `<g class="head" style="offset-path:path('${routeD}');animation-duration:${D}s"><circle r="16" fill="#6bb6ff" opacity=".35"/><circle r="5" fill="#eaf5ff"/></g><circle cx="${nodes[11][0]}" cy="${nodes[11][1]}" r="12" class="burst"/>` : ''}
</g></g>

<g id="pane">
<rect x="116" y="174" width="428" height="680" rx="32" fill="#000" opacity=".4" filter="url(#bl)"/>
<rect x="120" y="160" width="420" height="680" rx="28" fill="#1a1c1d" opacity=".5"/>
<rect x="120" y="160" width="420" height="680" rx="28" fill="url(#glass)"/>
<g mask="url(#mk)"><g transform="translate(0 212)"><g class="scroll">${log}</g></g></g>
<g transform="translate(0 806)">${cnt}
${busy ? `<rect x="146" y="14" width="348" height="4" rx="2" fill="#ffffff" opacity=".24"/><rect x="146" y="14" width="348" height="4" rx="2" fill="#6bb6ff" class="prog"/>` : `<rect class="cur" x="440" y="-16" width="10" height="17"/>`}
</g>
<rect x="120.5" y="160.5" width="419" height="679" rx="27.5" fill="none" stroke="url(#rim)" stroke-width="1"/>
</g>

<rect width="1600" height="1000" fill="url(#vg)"/>
<rect width="1600" height="1000" filter="url(#gr)" opacity=".1" style="mix-blend-mode:screen"/>
</svg>`
}
