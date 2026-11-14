// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Garden of habits: a potted plant in the lower-left corner grows with the number of habits kept this week
// (stage 0..7): seed, sprout, leaves, buds, full bloom with drifting petals. Seven small pebbles show the week.
// Warm paper cream, sage greens, one blush. Pure string building, deterministic.

const f = (n: number): string => (Math.round(n * 10) / 10).toString()

function petal(w: number, h: number, ang: number, fill: string): string {
  return `<path d="M0 0C${f(-w)} ${f(-h * 0.35)} ${f(-w * 0.7)} ${f(-h)} 0 ${f(-h)}C${f(w * 0.7)} ${f(-h)} ${f(w)} ${f(-h * 0.35)} 0 0Z" fill="${fill}" transform="rotate(${f(ang)})"/>`
}

function leaf(len: number, ang: number, tone: number, delay: number): string {
  const w = len * 0.26
  const fill = `url(#lg${tone % 3})`
  const d = `M0 0C${f(len * 0.25)} ${f(-w)} ${f(len * 0.72)} ${f(-w)} ${f(len)} 0C${f(len * 0.72)} ${f(w * 0.85)} ${f(len * 0.25)} ${f(w * 0.85)} 0 0Z`
  return `<g transform="rotate(${f(ang)})"><g class="lf" style="animation-delay:${f(delay)}s"><path d="${d}" fill="${fill}" stroke="#F6E7B8" stroke-opacity=".45" stroke-width="1"/><path d="M0 0Q${f(len * 0.5)} ${f(-w * 0.1)} ${f(len * 0.92)} 0" stroke="#4E6E4A" stroke-opacity=".5" stroke-width="1.3" fill="none" stroke-linecap="round"/></g></g>`
}

function bud(r: number, open: number): string {
  let s = `<ellipse cx="0" cy="${f(-r * 0.8)}" rx="${f(r * 0.5)}" ry="${f(r * 0.85)}" fill="#E9A9A6"/>`
  s += `<path d="M0 ${f(-r * 1.6)}Q${f(r * 0.12)} ${f(-r * 0.8)} 0 0" stroke="#D68F8E" stroke-width="1.4" fill="none"/>`
  if (open > 0) s += petal(r * 0.42, r * 1.3, -26, '#F0B8B3') + petal(r * 0.42, r * 1.3, 26, '#F0B8B3')
  s += `<path d="M0 ${f(r * 0.1)}C${f(-r * 0.7)} ${f(-r * 0.1)} ${f(-r * 0.7)} ${f(-r * 0.7)} ${f(-r * 0.15)} ${f(-r * 0.95)}C${f(-r * 0.25)} ${f(-r * 0.5)} ${f(-r * 0.1)} ${f(-r * 0.25)} 0 ${f(r * 0.1)}Z" fill="#7C9B76"/>`
  s += `<path d="M0 ${f(r * 0.1)}C${f(r * 0.7)} ${f(-r * 0.1)} ${f(r * 0.7)} ${f(-r * 0.7)} ${f(r * 0.15)} ${f(-r * 0.95)}C${f(r * 0.25)} ${f(-r * 0.5)} ${f(r * 0.1)} ${f(-r * 0.25)} 0 ${f(r * 0.1)}Z" fill="#8DAA84"/>`
  return s
}

function bloom(r: number): string {
  let s = ''
  for (let i = 0; i < 9; i++) s += petal(r * 0.3, r * 0.95, i * 40 + 10, '#F3C6C1')
  for (let i = 0; i < 7; i++) s += petal(r * 0.3, r * 0.72, i * (360 / 7) + 20, '#EBA7A5')
  for (let i = 0; i < 5; i++) s += petal(r * 0.18, r * 0.4, i * 72 + 36, '#E39390')
  s += `<circle r="${f(r * 0.13)}" fill="#E8C98C"/>`
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 + 15) * Math.PI / 180
    s += `<circle cx="${f(Math.cos(a) * r * 0.2)}" cy="${f(Math.sin(a) * r * 0.2)}" r="${f(r * 0.03)}" fill="#C9A260"/>`
  }
  return s
}

export function gardenScene(stageIn: number): string {
  const stage = Math.max(0, Math.min(7, Math.round(Number.isFinite(stageIn) ? stageIn : 0)))
  let seed = 7
  const rnd = (): number => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)

  // ground specks and faint rings in the paper
  let paper = ''
  for (let i = 0; i < 46; i++) {
    const x = rnd() * 1600, y = rnd() * 1000, r = 1 + rnd() * 2.2
    paper += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#B9A987" opacity="${f(0.1 + rnd() * 0.12)}"/>`
  }

  // plant geometry (local coords: soil surface at y=0, growing up)
  const H = [0, 44, 74, 114, 142, 164, 178, 190][stage]
  const sx = (y: number): number => 9 * Math.sin(y / 80)
  let stem = ''
  if (stage > 0) {
    let d = `M0 4`
    for (let y = 10; y <= H; y += 10) d += `L${f(sx(y))} ${f(-y)}`
    d += `L${f(sx(H))} ${f(-H)}`
    stem = `<path d="${d}" stroke="#6F9068" stroke-width="${stage < 3 ? 4 : 5.5}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
  }
  const pairs = [0, 1, 1, 3, 4, 4, 5, 5][stage]
  const baseLen = [0, 26, 40, 56, 62, 64, 66, 68][stage]
  let leaves = ''
  for (let i = 0; i < pairs; i++) {
    const y = pairs === 1 ? H : Math.max(14, H * (0.2 + 0.68 * (1 - i / pairs)) + 0.06 * H)
    const len = baseLen * (pairs === 1 ? 1 : 1 - i * 0.07)
    const up = pairs === 1 ? 38 : 30 + i * 4
    leaves += `<g transform="translate(${f(sx(y))} ${f(-y)})">${leaf(len, -up, i, i * 0.7)}</g>`
    const y2 = Math.max(10, y - 12)
    leaves += `<g transform="translate(${f(sx(y2))} ${f(-y2)})">${leaf(len * 0.94, -180 + up, i + 1, i * 0.7 + 1.3)}</g>`
  }
  // fresh unfurling tip for stages 3-4
  let tip = ''
  if (stage === 3) tip = `<g transform="translate(${f(sx(H))} ${f(-H)})" opacity=".6"><g class="hd">${bud(8, 0)}</g></g>`
  if (stage === 4) tip = `<g transform="translate(${f(sx(H))} ${f(-H)})" opacity=".8"><g class="hd">${bud(11, 0)}</g></g>`

  // heads: top plus branches
  let heads = ''
  const topX = sx(H), topY = -H
  const branch = (frac: number, dx: number, dy: number, kind: 'bud' | 'bloom', r: number, open: number, delay: number): string => {
    const y = H * frac, x0 = sx(y), y0 = -y
    const x1 = x0 + dx, y1 = y0 - dy
    let s = `<path d="M${f(x0)} ${f(y0)}Q${f(x0 + dx * 0.15)} ${f(y0 - dy * 0.7)} ${f(x1)} ${f(y1)}" stroke="#6F9068" stroke-width="3.6" stroke-linecap="round" fill="none"/>`
    s += `<g transform="translate(${f(x1)} ${f(y1)}) rotate(${dx > 0 ? 14 : -14})"><g class="hd" style="animation-delay:${delay}s">${kind === 'bud' ? bud(r, open) : bloom(r)}</g></g>`
    return s
  }
  if (stage >= 5 && stage < 7) {
    const r = stage === 5 ? 15 : 19
    heads += `<g transform="translate(${f(topX)} ${f(topY)})"><g class="hd">${bud(r, stage === 6 ? 1 : 0)}</g></g>`
    heads += branch(0.56, 52, 50, 'bud', stage === 5 ? 11 : 13, 0, 1.2)
    if (stage === 6) heads += branch(0.4, -48, 42, 'bud', 11, 0, 2.2)
  }
  let drift = ''
  if (stage === 7) {
    heads += `<g transform="translate(${f(topX)} ${f(topY - 32)})"><g class="hd">${bloom(52)}</g></g>`
    heads += branch(0.58, 70, 56, 'bloom', 26, 1, 1.2)
    heads += branch(0.4, -66, 46, 'bloom', 22, 1, 2.2)
    const dp = [[10, 0, 'dr1', 0, 15], [-14, 10, 'dr2', 5, 19], [18, -6, 'dr1', 9.5, 17], [-4, 6, 'dr2', 13, 21]]
    for (const [dx, dy, k, dl, du] of dp as [number, number, string, number, number][]) {
      drift += `<g transform="translate(${f(topX + dx)} ${f(topY - 32 + dy)})"><g class="pd ${k}" style="animation-delay:${dl}s;animation-duration:${du}s">${petal(7, 15, 0, '#F0B8B3')}</g></g>`
    }
  }

  // seed in soil for stage 0
  const seedMark = stage === 0
    ? `<g class="hd"><path d="M0 0Q-3 -14 3 -24" stroke="#7FA374" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/><g transform="translate(3 -24)">${leaf(12, -30, 0, 0)}${leaf(11, -150, 1, 1)}</g><ellipse cx="-16" cy="-1" rx="8" ry="5.5" fill="url(#sd)"/><path d="M-21 -2Q-16 -6 -11 -2" stroke="#7A5A34" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`
    : ''

  // week dots under the pot
  let dots = ''
  for (let i = 0; i < 7; i++) {
    const on = i < stage
    dots += `<circle cx="${(i - 3) * 30}" cy="236" r="8" fill="${on ? '#4F7A4A' : 'none'}" stroke="${on ? '#E2EDD4' : '#6F9068'}" stroke-opacity="${on ? 1 : 0.7}" stroke-width="2"/>`
  }
  dots += `<text x="124" y="242" font-family="-apple-system,'Segoe UI',Helvetica,Arial,sans-serif" font-size="18" font-weight="500" fill="#3F4B31">${stage} из 7</text>`

  const pot = `<ellipse cx="-62" cy="92" rx="125" ry="10" fill="#5F6E40" opacity=".3" filter="url(#bl)"/>
<path d="M-52 10L-44 78Q-43 86 -34 86L34 86Q43 86 44 78L52 10Z" fill="url(#pt)"/>
<path d="M30 10L36 80Q38 86 34 86L44 78L52 10Z" fill="#FFE9C4" opacity=".55"/>
<path d="M-52 10L-44 78Q-43 86 -34 86L-26 86L-34 10Z" fill="#9C6B4C" opacity=".35"/>
<rect x="-58" y="-6" width="116" height="20" rx="9" fill="url(#rm)"/>
<rect x="-54" y="-5" width="108" height="4" rx="2" fill="#FFF0D6" opacity=".75"/>
<path d="M-50 -2Q0 -12 50 -2L50 4Q0 -6 -50 4Z" fill="#7A5B43"/>
<path d="M-46 -1Q0 -10 46 -1" stroke="#5C4231" stroke-width="2" fill="none" opacity=".5"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
.pl{transform-box:view-box}
.sw{animation:sw 9s ease-in-out infinite alternate;transform-origin:0 0}
.lf{animation:lf 6.5s ease-in-out infinite alternate;transform-origin:0 0}
.hd{animation:hd 8s ease-in-out infinite alternate;transform-origin:0 0}
.pd{opacity:0;transform-origin:0 0}
.bgl{animation:gi 3s ease-out both}
@keyframes gi{from{opacity:0}to{opacity:1}}
.dr1{animation:dr1 16s ease-in infinite}
.dr2{animation:dr2 19s ease-in infinite}
.bk1{animation:bk 30s ease-in-out infinite alternate}
@keyframes sw{from{transform:rotate(-0.9deg)}to{transform:rotate(1deg)}}
@keyframes lf{from{transform:rotate(-3deg)}to{transform:rotate(3.2deg)}}
@keyframes hd{from{transform:rotate(-2deg) scale(1)}to{transform:rotate(2deg) scale(1.025)}}
@keyframes dr1{0%{opacity:0;transform:translate(0,0) rotate(0)}10%{opacity:.95}80%{opacity:.8}100%{opacity:0;transform:translate(120px,250px) rotate(260deg)}}
@keyframes dr2{0%{opacity:0;transform:translate(0,0) rotate(30deg)}10%{opacity:.95}80%{opacity:.8}100%{opacity:0;transform:translate(-40px,260px) rotate(-210deg)}}
@keyframes bk{from{transform:translate(0,0)}to{transform:translate(14px,-8px)}}
@media (max-aspect-ratio:1/1){.pl{transform:translate(770px,640px) scale(.85)}}
@media (prefers-reduced-motion: reduce) { * { animation: none !important } }
</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7EBD9"/><stop offset=".55" stop-color="#F6E0CE"/><stop offset="1" stop-color="#EBE0C4"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F6C8C0" stop-opacity=".6"/><stop offset="1" stop-color="#F6C8C0" stop-opacity="0"/></radialGradient>
<radialGradient id="bgl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD9D0" stop-opacity=".95"/><stop offset=".45" stop-color="#F8C2BC" stop-opacity=".45"/><stop offset="1" stop-color="#F8C2BC" stop-opacity="0"/></radialGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF1CF" stop-opacity=".9"/><stop offset="1" stop-color="#FFF1CF" stop-opacity="0"/></radialGradient>
<linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D3E0C2"/><stop offset="1" stop-color="#C6D8B6"/></linearGradient>
<linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9CFA6"/><stop offset="1" stop-color="#A9C294"/></linearGradient>
<linearGradient id="h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DB989"/><stop offset="1" stop-color="#86A673"/></linearGradient>
<linearGradient id="pt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#BE8C6A"/><stop offset=".45" stop-color="#D9AE8A"/><stop offset="1" stop-color="#EDCBA6"/></linearGradient>
<linearGradient id="rm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C79B76"/><stop offset=".4" stop-color="#E0B994"/><stop offset="1" stop-color="#F5DDBF"/></linearGradient>
<linearGradient id="lg0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B2CBA3"/><stop offset="1" stop-color="#6E9566"/></linearGradient>
<linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A3BF94"/><stop offset="1" stop-color="#5F885A"/></linearGradient>
<linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#BDD3AF"/><stop offset="1" stop-color="#7BA073"/></linearGradient>
<radialGradient id="sd" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#D3AB78"/><stop offset="1" stop-color="#8F6A3E"/></radialGradient>
<filter id="bl" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .42 0 0 0 0 .38 0 0 0 0 .28 0 0 0 .55 -.12"/></filter>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<circle cx="1380" cy="130" r="420" fill="url(#sun)"/>
${paper}
<g class="bk1"><path d="M1600 0L1600 260Q1480 245 1430 160Q1405 90 1450 0Z" fill="#D5E0C6" opacity=".6"/><path d="M1600 0L1600 150Q1540 140 1515 90Q1500 40 1530 0Z" fill="#C3D4B3" opacity=".6"/></g>
<path d="M0 745C300 700 640 770 980 735S1430 690 1600 735L1600 1000L0 1000Z" fill="#E4E7D0" opacity=".75"/>
<path d="M0 800C260 740 560 830 880 790S1400 745 1600 800L1600 1000L0 1000Z" fill="url(#h1)"/>
<path d="M0 880C230 835 520 905 820 880S1360 845 1600 890L1600 1000L0 1000Z" fill="url(#h2)"/>
<path d="M0 935C200 905 430 950 700 958S1300 935 1600 955L1600 1000L0 1000Z" fill="url(#h3)"/>
<circle cx="1330" cy="840" r="520" fill="url(#sun)" opacity=".75"/>
<rect width="1600" height="1000" filter="url(#gr)" opacity=".4"/>
<ellipse cx="360" cy="560" rx="380" ry="420" fill="url(#glow)"/>
<g class="pl" transform="translate(360 728)">
<g transform="scale(2.4)">
${pot}
${stage === 7 ? `<circle class="bgl" cx="${f(topX)}" cy="${f(topY - 32)}" r="140" fill="url(#bgl)"/>` : ''}
<g class="sw">${stem}${leaves}${tip}${heads}${seedMark}</g>
${drift}
</g>
${dots}
</g>
</svg>`
}
