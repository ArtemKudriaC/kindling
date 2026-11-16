// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc

const RED = [232, 84, 80]
const AMBER = [244, 158, 24]
const GREEN = [64, 214, 150]
const GREY = [112, 138, 162]

function mix(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => v + (b[i] - v) * t)
}
function hex(c: number[]): string {
  return '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}
function smooth(t: number): number {
  t = Math.max(0, Math.min(1, t))
  return t * t * (3 - 2 * t)
}

export function recoveryScene(score: number | undefined): string {
  const known = typeof score === 'number' && isFinite(score)
  const s = known ? Math.max(0, Math.min(100, score as number)) : 0
  let rgb: number[]
  if (!known) rgb = GREY
  else if (s <= 25) rgb = RED
  else if (s <= 50) rgb = mix(RED, AMBER, smooth((s - 25) / 25))
  else if (s <= 72) rgb = mix(AMBER, GREEN, smooth((s - 50) / 22))
  else rgb = GREEN
  const c = hex(rgb)
  const bright = hex(mix(rgb, [235, 242, 248], 0.35))
  const pale = hex(mix(rgb, [235, 242, 248], 0.7))
  const deep = hex(mix(rgb, [8, 14, 22], 0.72))
  const mid = hex(mix(rgb, [8, 14, 22], 0.45))
  const period = known ? 3.8 + (s / 100) * 3.7 : 9
  const p = period.toFixed(2)
  const k = known ? s / 100 : 0.3
  const core = known ? 0.3 + 0.12 * k : 0.2
  const size = 0.7 + 0.5 * k
  const amp = known ? (1.1 - 0.06 * k).toFixed(3) : '1.03'

  const R = 168
  const CX = 1290
  const CY = 500
  const ang = ((s / 100) * 360 - 90) * (Math.PI / 180)
  const dx = (CX + R * Math.cos(ang)).toFixed(1)
  const dy = (CY + R * Math.sin(ang)).toFixed(1)

  const FONT = "'SF Pro Display','Helvetica Neue',system-ui,sans-serif"
  const num = known
    ? `<text x="${CX}" y="${CY + 36}" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="132" letter-spacing="-5"><tspan fill="${pale}">${Math.round(s)}</tspan><tspan fill="${c}" fill-opacity="0.55" font-size="76" letter-spacing="0" dx="4">%</tspan></text>`
    : `<text x="${CX}" y="${CY + 36}" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="132" letter-spacing="-5" fill="${c}" fill-opacity="0.7">${String.fromCharCode(8211)}</text>`
  const label = `<text x="${CX}" y="${CY + 92}" text-anchor="middle" font-family="${FONT}" font-weight="400" font-size="22" fill="${known ? bright : c}" fill-opacity="${known ? 0.85 : 0.75}">${known ? 'Восстановление' : 'Нет данных'}</text>`

  const progress = known
    ? `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${c}" stroke-width="30" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.max(s, 0.5).toFixed(2)} 100" transform="rotate(-90 ${CX} ${CY})" opacity="0.55" filter="url(#blur)"/>
<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="url(#arc)" stroke-width="16" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.max(s, 0.5).toFixed(2)} 100" transform="rotate(-90 ${CX} ${CY})"/>
<circle class="dot" cx="${dx}" cy="${dy}" r="12" fill="${pale}"/>
<circle cx="${dx}" cy="${dy}" r="30" fill="url(#g1)" opacity="0.8"/>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<defs>
<radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c}" stop-opacity="${core.toFixed(2)}"/><stop offset="0.5" stop-color="${c}" stop-opacity="${(core * 0.4).toFixed(2)}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${mid}" stop-opacity="0.8"/><stop offset="1" stop-color="${mid}" stop-opacity="0"/></radialGradient>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c131b"/><stop offset="0.6" stop-color="#0a1017"/><stop offset="1" stop-color="${deep}"/></linearGradient>
<radialGradient id="veil" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#090e14" stop-opacity="0.75"/><stop offset="1" stop-color="#090e14" stop-opacity="0"/></radialGradient>
<linearGradient id="arc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bright}"/><stop offset="1" stop-color="${c}"/></linearGradient>
<filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.85  0 0 0 0 0.9  0 0 0 0.5 -0.12"/></filter>
</defs>
<style>
.aur{transform-box:fill-box;transform-origin:center;animation:breathe ${p}s ease-in-out infinite}
.drift{transform-box:fill-box;transform-origin:center;animation:drift ${(period * 4).toFixed(1)}s ease-in-out infinite alternate}
.pulse{transform-box:fill-box;transform-origin:center;opacity:0;animation:pulse ${(period * 1.5).toFixed(2)}s ease-out infinite}
.dot{animation:dot ${p}s ease-in-out infinite}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(${amp})}}
@keyframes drift{from{transform:translate(-30px,10px) scale(1)}to{transform:translate(30px,-12px) scale(1.06)}}
@keyframes pulse{0%{transform:scale(1);opacity:0}15%{opacity:0.3}100%{transform:scale(1.75);opacity:0}}
@keyframes dot{0%,100%{opacity:0.85}50%{opacity:1}}
@media (max-aspect-ratio:1/1){.hud{transform:translate(-490px,0)}.aur{transform:translateX(-490px)}.aurb{transform:translateX(-300px)}}
@media (prefers-reduced-motion: reduce){*{animation:none !important}.pulse{opacity:0.12}}
</style>
<rect width="1600" height="1000" fill="url(#bg)"/>
<ellipse class="drift" cx="400" cy="60" rx="620" ry="330" fill="url(#g2)" opacity="0.35"/>
<ellipse class="drift aurb" cx="1180" cy="900" rx="${Math.round(900 * size)}" ry="${Math.round(340 * size)}" fill="url(#g1)" opacity="0.7"/>
<ellipse class="aur" cx="${CX}" cy="${CY}" rx="${Math.round(780 * size)}" ry="${Math.round(640 * size)}" fill="url(#g1)"/>
<ellipse cx="800" cy="520" rx="470" ry="520" fill="url(#veil)"/>
<g class="hud">
<circle class="pulse" cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${c}" stroke-width="8"/>
<circle class="pulse" cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${c}" stroke-width="8" style="animation-delay:-${(period * 0.75).toFixed(2)}s"/>
<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${deep}" stroke-width="16" stroke-opacity="0.9"/>
<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${c}" stroke-opacity="0.14" stroke-width="16"/>
${progress}
${num}
${label}
</g>
<rect width="1600" height="1000" filter="url(#grain)" opacity="0.5"/>
</svg>`
}
