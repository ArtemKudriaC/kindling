// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Training: sports-watch-face scene. A lit terracotta running track runs across the whole bottom edge
// (lanes converge toward the centre-right horizon); a heart-rate readout and rest/work ring sit top-right.
// Same composition in both states: busy = work, idle = rest. Pure string building, CSS animation only.

const f = (n: number) => Math.round(n * 10) / 10
const VX = 1020
const VY = 690
const xAt = (b: number, y: number) => VX + ((b - VX) * (y - VY)) / (1000 - VY)

function ecgPath(): string {
  let d = 'M0 0'
  for (let i = 0; i < 7; i++) {
    const x = i * 120
    d += ` L${x + 18} 0 q8 -9 16 0 L${x + 52} 0 L${x + 58} 8 L${x + 66} -46 L${x + 74} 18 L${x + 80} 0 L${x + 92} 0 q10 -14 20 0 L${x + 120} 0`
  }
  return d
}

export function trainingScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  // tapered lane lines: hair-thin at the horizon, wide at the viewer
  let lanes = ''
  for (let b = -500; b <= 2300; b += 560) {
    const xb = xAt(b, 1000)
    lanes += `<polygon points="${VX},${VY} ${f(xb - 2.6)},1000 ${f(xb + 2.6)},1000" fill="#f3e7dc" fill-opacity=".55"/>`
  }
  const bar = (y: number) => `<polygon points="${f(xAt(-500, y))},${y} ${f(xAt(2300 - 560, y))},${y} ${f(xAt(2300 - 560, y + 5))},${y + 5} ${f(xAt(-500, y + 5))},${y + 5}" fill="#f3e7dc" fill-opacity=".16"/>`
  const cross = bar(905) + bar(922) + (busy ? '<ellipse class="sw" cx="1020" cy="720" rx="300" ry="16"/>' : '')
  const C = 276.5
  const arc = busy
    ? `<circle class="arc work" cx="1272" cy="150" r="44" transform="rotate(-90 1272 150)" stroke-dasharray="${C}" stroke-dashoffset="${f(C * 0.7)}"/>`
    : `<circle class="arc" style="stroke-opacity:.28;stroke-width:3" cx="1272" cy="150" r="44" transform="rotate(-90 1272 150)" stroke-dasharray="${C}" stroke-dashoffset="0"/>`
  const halo = busy ? '' : `<circle class="halo" cx="1272" cy="150" r="44"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
.hud{transform-origin:0 0;transform:translate(1560px,-60px) scale(1.3) translate(-1540px,0)}
@media (orientation: portrait){.hud{transform:translate(800px,-40px) scale(1.1) translate(-1384px,0)}.pm{display:block}}
.sw{fill:#ff9a6a;fill-opacity:.2;filter:url(#bl);animation:sw 8s cubic-bezier(.5,.1,.9,.6) infinite}
@keyframes sw{0%{transform:translateY(0) scaleX(.3);opacity:0}15%{opacity:1}100%{transform:translateY(240px) scaleX(2.2);opacity:0}}
.pm{display:none}
.cr{stroke:#f3e7dc;stroke-linecap:butt;animation:run 8s cubic-bezier(.55,.05,.95,.7) infinite}
@keyframes run{0%{transform:translateY(0);stroke-width:.6px;opacity:0}12%{opacity:.18}100%{transform:translateY(300px);stroke-width:4px;opacity:.4}}
.hr{fill:none;stroke:#ff7a4a;stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke;animation:hr ${busy ? '2.8s' : '6s'} linear infinite}
@keyframes hr{to{transform:translateX(-120px)}}
.rt{fill:none;stroke:#e8dccf;stroke-opacity:.1;stroke-width:8}
.arc{fill:none;stroke:#ff6b3d;stroke-width:8;stroke-linecap:round;filter:url(#gl)}
.work{animation:fillw 40s linear infinite}
.rest{animation:fillr 22s ease-in-out infinite}
@keyframes fillw{0%{stroke-dashoffset:193.6}100%{stroke-dashoffset:40}}
@keyframes fillr{0%{stroke-dashoffset:276.5}90%,100%{stroke-dashoffset:30}}
.halo{fill:none;stroke:#ff6b3d;stroke-width:2;transform-origin:1272px 150px;animation:pulse 3.6s ease-out infinite}
@keyframes pulse{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.4);opacity:0}}
.lbl{font:500 14px ui-sans-serif,system-ui,-apple-system,"Helvetica Neue",sans-serif;fill:#dcd3c8}
.num{font:600 40px ui-sans-serif,system-ui,-apple-system,"Helvetica Neue",sans-serif;letter-spacing:-.03em;fill:#f3eee8}
.u{font:500 14px ui-sans-serif,system-ui,sans-serif;fill:#cfc4b8;fill-opacity:.7}
@media (prefers-reduced-motion: reduce){*{animation:none !important}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#111316"/><stop offset=".65" stop-color="#17191d"/><stop offset="1" stop-color="#2a1a16"/></linearGradient>
<radialGradient id="sun" cx="${VX}" cy="${VY}" r="760" gradientUnits="userSpaceOnUse" gradientTransform="translate(${VX} ${VY}) scale(1 .42) translate(${-VX} ${-VY})"><stop offset="0" stop-color="#ff7a4a" stop-opacity="${busy ? '.5' : '.3'}"/><stop offset=".5" stop-color="#c8502f" stop-opacity="${busy ? '.18' : '.1'}"/><stop offset="1" stop-color="#c8502f" stop-opacity="0"/></radialGradient>
<linearGradient id="trk" x1="0" y1="${VY}" x2="0" y2="1000" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a34430" stop-opacity="0"/><stop offset=".14" stop-color="#8f3b29" stop-opacity=".9"/><stop offset=".35" stop-color="#70301f"/><stop offset="1" stop-color="#241210"/></linearGradient>
<linearGradient id="haze" x1="0" y1="${VY}" x2="0" y2="${VY + 150}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2a1b17" stop-opacity=".2"/><stop offset="1" stop-color="#1b1816" stop-opacity="0"/></linearGradient>
<linearGradient id="fadeE" gradientUnits="userSpaceOnUse" x1="1228" y1="0" x2="1540" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="me"><rect x="1228" y="200" width="312" height="150" fill="url(#fadeE)"/></mask>
<filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="bl" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="9"/></filter>
<linearGradient id="pf" gradientUnits="userSpaceOnUse" x1="880" y1="0" x2="1035" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="pmk" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="#fff"/><rect class="pm" x="880" width="155" height="1000" fill="url(#pf)" style="mix-blend-mode:normal"/><rect class="pm" x="1035" width="565" height="1000" fill="#000"/></mask>
<linearGradient id="hz" x1="0" y1="${VY - 50}" x2="0" y2="${VY + 10}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1f1815" stop-opacity="0"/><stop offset="1" stop-color="#3a211b" stop-opacity=".3"/></linearGradient>
<clipPath id="tc"><rect x="0" y="${VY}" width="1600" height="${1000 - VY}"/></clipPath>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<g mask="url(#pmk)">
<rect width="1600" height="1000" fill="url(#sun)"/>
<g clip-path="url(#tc)">
<rect x="0" y="${VY}" width="1600" height="${1000 - VY}" fill="url(#trk)"/>
${lanes}
${cross}
<ellipse cx="1020" cy="760" rx="380" ry="26" fill="#ff8a5a" fill-opacity=".14" filter="url(#bl)"/>
<rect x="0" y="${VY}" width="1600" height="150" fill="url(#haze)"/>
</g>
<rect x="0" y="${VY - 50}" width="1600" height="60" fill="url(#hz)"/>
</g>
<g class="hud">
<circle class="rt" cx="1272" cy="150" r="44"/>
${arc}
${halo}
<text class="lbl" x="1344" y="124">${busy ? 'Working' : 'Waiting'}</text>
<text x="1344" y="164"><tspan class="num">${busy ? '142' : '68'}</tspan><tspan class="u" dx="6">bpm</tspan></text>
<g mask="url(#me)"><g transform="translate(1228 275)"><g transform="scale(1 ${busy ? 1 : 0.2})" filter="url(#gl)"><path class="hr" d="${ecgPath()}"/></g></g></g>
</g>
</svg>`
}
