// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc

let seed = 7
function rnd(): number {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const f = (n: number) => n.toFixed(1)

function branch(n: number, len: number, leaf: number): string {
  let out = ''
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    pts.push([t * len, Math.sin(t * 2.2) * len * 0.12 + t * t * len * 0.18])
  }
  out += `<path d="M0 0 ${pts.map(p => `L${f(p[0])} ${f(p[1])}`).join(' ')}" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>`
  for (let i = 1; i <= n; i++) {
    const [x, y] = pts[i]
    for (const side of [-1, 1]) {
      if (rnd() < 0.18) continue
      const s = leaf * (0.7 + rnd() * 0.6) * (1 - i / (n * 1.6))
      const a = side * (38 + rnd() * 30) + 20
      out += `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})" d="M0 0 C${f(s * 0.3)} ${f(-s * 0.42)} ${f(s * 0.8)} ${f(-s * 0.36)} ${f(s * 1.3)} 0 C${f(s * 0.8)} ${f(s * 0.36)} ${f(s * 0.3)} ${f(s * 0.42)} 0 0Z" fill="#000"/>`
    }
  }
  return out
}

export function terracottaScene(): string {
  seed = 7
  const leavesA = branch(11, 520, 120)
  const leavesB = branch(8, 380, 100)
  const leavesC = branch(9, 430, 105)
  const pane = (x: number, y: number, w: number, h: number) =>
    `<path d="M${x} ${y} L${x + w} ${y - 70} L${x + w + 40} ${y + h - 70} L${x + 40} ${y + h}Z"/>`
  const sun = pane(1140, 60, 190, 230) + pane(1360, 0, 190, 230) + pane(1180, 330, 190, 230) + pane(1400, 270, 190, 230)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
.D{display:none}.L{display:block}.sun{fill:url(#sunG)}.shade{fill:#8a3216}
.drift{animation:drift 34s ease-in-out infinite alternate}
.drift2{animation:drift 26s ease-in-out -9s infinite alternate-reverse}
.swayA{transform-origin:0 0;animation:sway 14s ease-in-out infinite alternate}
.swayB{transform-origin:0 0;animation:sway 19s ease-in-out -6s infinite alternate-reverse}
.breathe{animation:breathe 9s ease-in-out infinite alternate}
.pulse{transform-origin:1330px 380px;animation:pulse 11s ease-in-out infinite alternate}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(-46px,34px)}}
@keyframes sway{from{transform:rotate(-2.6deg)}to{transform:rotate(2.4deg)}}
@keyframes breathe{from{opacity:.84}to{opacity:1}}
@keyframes pulse{from{transform:scale(.97)}to{transform:scale(1.04)}}
@media (prefers-color-scheme:dark){.L{display:none}.D{display:block}.shade{fill:#0b0605}.leafD .shade{fill:#0b0605}}
@media (max-aspect-ratio:1/1){.subj{transform:translate(-580px,40px)}.subjDark{transform:translate(-560px,-140px)}.leafD{transform:translate(570px,0)}.leafL{transform:translate(520px,-120px)}}
@media (prefers-reduced-motion:reduce){*{animation:none !important}}
</style>
<defs>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .1  0 0 0 0 .05  0 0 0 .9 -.25"/></filter>
<filter id="dither" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.4 0 0 0 -.2"/></filter>
<filter id="b8"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b14"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="b30"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="b60"><feGaussianBlur stdDeviation="60"/></filter>
<linearGradient id="wallL" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eba872"/><stop offset=".45" stop-color="#d6794a"/><stop offset="1" stop-color="#b4512c"/></linearGradient>
<linearGradient id="sunG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1cf"/><stop offset="1" stop-color="#ffc98a"/></linearGradient>
<linearGradient id="beam" gradientUnits="userSpaceOnUse" x1="1600" y1="0" x2="900" y2="800"><stop offset="0" stop-color="#ffe3b0" stop-opacity=".75"/><stop offset=".55" stop-color="#ffc07e" stop-opacity=".3"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></linearGradient>
<linearGradient id="wallD" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#3a2620"/><stop offset=".6" stop-color="#2c2422"/><stop offset="1" stop-color="#262120"/></linearGradient>
<radialGradient id="glowD" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd7a0" stop-opacity="1"/><stop offset="0.08" stop-color="#ffbd82" stop-opacity="0.97"/><stop offset="0.18" stop-color="#f59a60" stop-opacity="0.88"/><stop offset="0.3" stop-color="#de7442" stop-opacity="0.7"/><stop offset="0.42" stop-color="#c25c34" stop-opacity="0.52"/>
<stop offset="0.55" stop-color="#a24a2b" stop-opacity="0.36"/><stop offset="0.68" stop-color="#82392a" stop-opacity="0.22"/><stop offset="0.8" stop-color="#663228" stop-opacity="0.11"/><stop offset="0.9" stop-color="#4a2a24" stop-opacity="0.045"/><stop offset="1" stop-color="#3a2620" stop-opacity="0"/></radialGradient>
<radialGradient id="rim" cx=".5" cy=".5" r=".5"><stop offset=".78" stop-color="#ffb27a" stop-opacity="0"/><stop offset=".88" stop-color="#ffb27a" stop-opacity=".08"/><stop offset="1" stop-color="#ffb27a" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#2a0f06" stop-opacity="0"/><stop offset="1" stop-color="#2a0f06" stop-opacity=".3"/></radialGradient>
</defs>

<g class="L">
  <rect width="1600" height="1000" fill="url(#wallL)"/>
  <g class="subj">
    <path d="M1700 -100 L1000 -100 L560 1000 L1000 1000Z" fill="url(#beam)" filter="url(#b60)"/>
    <g class="drift" filter="url(#b14)" opacity=".8"><g class="sun">${sun}</g></g>
    <g class="drift2" filter="url(#b30)" opacity=".4"><g class="sun" transform="translate(-40 40) scale(1.05)">${sun}</g></g>
  </g>
  <rect width="1600" height="1000" filter="url(#grain)" opacity=".16" style="mix-blend-mode:multiply"/>
  <g class="leafL">
    <g transform="translate(-30 1010) rotate(-52)"><g class="swayA"><g filter="url(#b14)" opacity=".2" class="shade">${leavesA}</g></g></g>
    <g transform="translate(-20 760) rotate(-20)"><g class="swayB"><g filter="url(#b14)" opacity=".15" class="shade">${leavesB}</g></g></g>
  </g>
  <rect width="1600" height="1000" fill="url(#vig)"/>
</g>

<g class="D">
  <rect width="1600" height="1000" fill="url(#wallD)"/>
  <g class="subjDark">
    <g class="pulse"><g class="breathe">
      <circle cx="1330" cy="380" r="520" fill="url(#glowD)" filter="url(#b14)"/>
    </g></g>
  </g>
  <rect width="1600" height="1000" filter="url(#grain)" opacity=".14" style="mix-blend-mode:multiply"/>
  <rect width="1600" height="1000" filter="url(#dither)" opacity=".22" style="mix-blend-mode:overlay"/>
  <g class="leafD">
    <g transform="translate(-30 1010) rotate(-52)"><g class="swayA"><g filter="url(#b8)" opacity=".4" class="shade">${leavesA}</g></g></g>
    <g transform="translate(-20 760) rotate(-20)"><g class="swayB"><g filter="url(#b8)" opacity=".3" class="shade">${leavesC}</g></g></g>
  </g>
  <rect width="1600" height="1000" fill="url(#vig)"/>
</g>
</svg>`
}
