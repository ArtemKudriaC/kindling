// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Stipple lake: a wooded slope over a still lake, painted in dabs.
// Light: a warm morning, blue hills behind a green wood, a fisherman in an orange boat.
// Dark: the same lake under a moon, all in blues, a lantern on the bow.
// idle: the boat rests and the float bobs. busy: the boat is paddled across the lake and pulls a wake.
// Click the water for rings and a jumping fish, click the boat to rock it.
// Light and dark live in one SVG, switched by prefers-color-scheme. Pure string building.

let seed = 11
function rnd(): number {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const r0 = (n: number) => Math.round(n)
const SHORE = 640
const ROWS = 9
const SIZES = [30, 38, 46, 56, 68]

/** Top of the wooded slope at x: a tall hill on the left, a saddle, a lower hill on the right. */
const ridge = (x: number) => 300 - 190 * Math.exp(-(((x - 360) / 340) ** 2)) - 120 * Math.exp(-(((x - 1300) / 280) ** 2))

const hex = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))
/** Mix two #rrggbb colours. */
const mix = (a: string, b: string, t: number) =>
  '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('')
/** Colour at t (0..1) along evenly spaced stops. */
const ramp = (stops: string[], t: number) => {
  const k = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)))
  return mix(stops[k], stops[k + 1], t * (stops.length - 1) - k)
}

// far ridge .. shore: crown top, crown bottom, and the three dab hues laid on the lit side
const TONE = {
  light: {
    top: ['#26388f', '#2b5c9c', '#2f8273', '#93c088'],
    bot: ['#101a55', '#143a66', '#17524c', '#4a8558'],
    a: ['#4f6cd2', '#4f93c8', '#5fb39a', '#dcebb0'],
    b: ['#6a86e6', '#74b4da', '#93d2a6', '#f8f0cc'],
    c: ['#3d9cb8', '#58b6a8', '#c2d67c', '#f6d6a2'],
  },
  dark: {
    top: ['#0d1436', '#16225c', '#243480', '#4159b4'],
    bot: ['#02041a', '#040722', '#070b2e', '#0c1442'],
    a: ['#141e56', '#22317a', '#3a4ea6', '#6d83d6'],
    b: ['#1b2868', '#2c3e90', '#4a60bc', '#93a6ee'],
    c: ['#10305a', '#1f4a80', '#3a6aa8', '#b9c6f6'],
  },
}

/** A crown: one big ball and five smaller ones on its shoulders. Each ball takes the row gradient on its own box. */
function crown(id: string, r: number, flip: boolean): string {
  const lobes = flip
    ? [[0, 0, 1], [0.6, 0.04, 0.6], [-0.64, 0.14, 0.52], [0.32, -0.5, 0.55], [-0.42, -0.38, 0.6], [-0.05, -0.68, 0.44]]
    : [[0, 0, 1], [-0.62, 0.1, 0.56], [0.6, 0.06, 0.58], [-0.4, -0.42, 0.56], [0.36, -0.46, 0.54], [0, -0.62, 0.5]]
  return `<g id="${id}">${lobes.map(([x, y, k]) => `<circle cx="${r0(x * r)}" cy="${r0(y * r)}" r="${r0(k * r)}"/>`).join('')}</g>`
}
/** A tall narrow crown that stands above its row. */
const tall = (id: string, r: number) =>
  `<g id="${id}"><ellipse cx="0" cy="${r0(-r)}" rx="${r0(r * 0.46)}" ry="${r0(r * 1.5)}"/><ellipse cx="${r0(r * 0.16)}" cy="${r0(-r * 0.5)}" rx="${r0(r * 0.42)}" ry="${r0(r * 0.9)}"/></g>`

type Row = { uses: string; trunks: string; y0: number; y1: number }
/** Rows of crowns from the ridge down to the shore, far to near, then a row of bushes on the bank. */
function forest(): Row[] {
  const rows: Row[] = []
  for (let i = 0; i <= ROWS; i++) {
    const bank = i === ROWS
    const t = i / (ROWS - 1)
    const base = bank ? 0 : i < 3 ? 1 : i < 6 ? 2 : 3
    const row: Row = { uses: '', trunks: '', y0: 1e9, y1: -1e9 }
    let x = -40 * rnd()
    while (x < 1640) {
      const si = Math.max(0, Math.min(4, base + Math.floor(rnd() * (bank ? 2 : 3)) - (bank ? 0 : 1)))
      const rad = SIZES[si]
      const top = ridge(x) + 30
      const y = bank ? SHORE - 20 + (rnd() - 0.5) * 8 : top + t * (SHORE - 40 - top) + (rnd() - 0.5) * 22
      if (!bank && i >= 3 && rnd() < 0.13) {
        const k = rnd() < 0.5 ? 0 : 1
        row.uses += `<use href="#t${k}" x="${r0(x)}" y="${r0(y)}"/>`
        row.y0 = Math.min(row.y0, y - [34, 44][k] * 2.6)
      }
      row.uses += `<use href="#c${si}${rnd() < 0.5 ? 'a' : 'b'}" x="${r0(x)}" y="${r0(y)}"/>`
      row.y0 = Math.min(row.y0, y - rad * 1.25)
      row.y1 = Math.max(row.y1, y + rad)
      x += rad * (bank ? 0.8 + rnd() * 0.4 : 1 + rnd() * 0.5)
    }
    rows.push(row)
  }
  return rows
}

/** Short round-capped strokes scattered over a w x h tile that repeats without seams. One path per hue. */
function dabTile(counts: number[], w: number, h: number, len: number, lean: number): string[] {
  return counts.map(n => {
    let d = ''
    for (let i = 0; i < n; i++) {
      const x = rnd() * w
      const y = rnd() * h
      const l = rnd() < 0.25 ? 0 : len * (0.35 + rnd() * 0.65)
      const a = (rnd() - 0.5) * lean
      const seg = `l${r0(Math.cos(a) * l)} ${r0(Math.sin(a) * l)}`
      for (const ox of x > w - 10 ? [0, -w] : x < 10 ? [0, w] : [0])
        for (const oy of y > h - 10 ? [0, -h] : y < 10 ? [0, h] : [0]) d += `M${r0(x + ox)} ${r0(y + oy)}${seg}`
    }
    return d
  })
}

/** Short horizontal strokes on the water, longer toward the viewer. */
function ripples(n: number, x0: number, x1: number, y0: number): string {
  let d = ''
  for (let i = 0; i < n; i++) {
    const k = rnd() ** 0.8
    d += `M${r0(x0 + rnd() * (x1 - x0))} ${r0(y0 + k * (1000 - y0))}h${r0(5 + 26 * k * (0.4 + rnd()))}`
  }
  return d
}

/** Rings and a jumping fish that play when #id is clicked, centred on (x,y). */
function splash(id: string, x: number, y: number, fish = true): string {
  const ring = (rx: number, delay: number) =>
    `<ellipse class="ring" cx="${x}" cy="${y}" rx="4" ry="1" opacity="0"><animate attributeName="rx" values="4;${rx}" dur="2.4s" begin="${id}.click+${delay}s"/><animate attributeName="ry" values="1;${r0(rx * 0.26)}" dur="2.4s" begin="${id}.click+${delay}s"/><animate attributeName="opacity" values="0;.9;0" keyTimes="0;.12;1" dur="2.4s" begin="${id}.click+${delay}s"/></ellipse>`
  const jump = `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.85;1" dur=".9s" begin="${id}.click"/><animateMotion dur=".9s" begin="${id}.click" rotate="auto" path="M${x - 26} ${y} Q${x} ${y - 96} ${x + 26} ${y}"/><path class="fish" d="M-11 0C-5 -6 6 -5 11 0C6 5 -5 6 -11 0ZM-10 0L-18 -6V6Z"/></g>`
  return (fish ? jump : '') + ring(64, fish ? 0.55 : 0) + ring(104, fish ? 0.8 : 0.25) + ring(150, fish ? 1.05 : 0.5)
}

export function stippleLakeScene(activity: 'idle' | 'busy' = 'idle'): string {
  seed = 11
  const busy = activity === 'busy'
  const rows = forest()
  const g = (i: number) => Math.min(i, ROWS - 1)

  // per-row gradients, dab patterns and their colours in both schemes
  let grads = ''
  let cssL = ''
  let cssD = ''
  for (let i = 0; i < ROWS; i++) {
    const t = i / (ROWS - 1)
    grads += `<linearGradient id="b${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="t${i}"/><stop offset="1" class="o${i}"/></linearGradient>`
    for (const [css, tone] of [['L', TONE.light], ['D', TONE.dark]] as const) {
      const line = `.t${i}{stop-color:${ramp(tone.top, t)}}.o${i}{stop-color:${ramp(tone.bot, t)}}.a${i}{stroke:${ramp(tone.a, t)}}.e${i}{stroke:${ramp(tone.b, t)}}.c${i}{stroke:${ramp(tone.c, t)}}`
      if (css === 'L') cssL += line
      else cssD += line
    }
  }
  cssL += `.bk0{stop-color:${TONE.light.bot[0]}}.bk1{stop-color:${TONE.light.bot[3]}}`
  cssD += `.bk0{stop-color:${TONE.dark.bot[0]}}.bk1{stop-color:${TONE.dark.bot[3]}}`
  let pats = ''
  let masks = ''
  for (let i = 0; i <= ROWS; i++) {
    pats += `<pattern id="p${i}" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="translate(${i * 37} ${i * 53}) rotate(${((i % 3) - 1) * 11})"><use href="#dA" class="a${g(i)}"/><use href="#dB" class="e${g(i)}"/><use href="#dC" class="c${g(i)}"/></pattern>`
    masks += `<mask id="m${i}" maskUnits="userSpaceOnUse" x="-20" y="${r0(rows[i].y0 - 10)}" width="1640" height="${r0(rows[i].y1 - rows[i].y0 + 20)}"><g fill="url(#mg)">${rows[i].uses}</g></mask>`
  }

  // the slope behind the crowns, so no sky shows through
  let back = `M-20 ${SHORE}`
  for (let x = -20; x <= 1620; x += 40) back += `L${x} ${r0(ridge(x) + 44)}`
  back += `L1620 ${SHORE}Z`

  const trees = rows
    .map(
      (r, i) =>
        `<g fill="url(#b${g(i)})">${r.uses}</g><rect class="dl" x="-20" y="${r0(r.y0 - 10)}" width="1640" height="${r0(r.y1 - r.y0 + 20)}" fill="url(#p${i})" mask="url(#m${i})"/>${r.trunks ? `<path class="tr" d="${r.trunks}"/>` : ''}`,
    )
    .join('')
  const mirror = rows.map((r, i) => `<g fill="url(#b${g(i)})">${r.uses}</g>`).join('')

  const [dA, dB, dC] = dabTile([560, 480, 150], 180, 180, 4.5, 1.4)
  const [wA, wB] = dabTile([64, 56], 240, 120, 14, 0.12)

  // stars above the ridge (dark only)
  const star = ['', '']
  for (let i = 0; i < 90; i++) {
    const x = rnd() * 1600
    const y = rnd() * 300
    if (y > ridge(x) - 26) continue
    star[i % 2] += `M${r0(x)} ${r0(y)}h0`
  }
  const clouds = [[760, 236, 90, 44], [850, 212, 112, 58], [960, 240, 100, 46], [1040, 258, 70, 34], [662, 262, 72, 30], [1490, 212, 82, 40], [1566, 236, 70, 30]]
    .map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`)
    .join('')

  // wake: a V of foam flecks behind the stern, thinning with distance
  let foam = ''
  for (let i = 0; i < 120; i++) {
    const t = rnd() ** 1.25
    const arm = i % 3
    const spread = 4 + t * 54
    const y = arm === 0 ? 10 + (rnd() - 0.5) * 6 : arm === 1 ? 12 + spread * (0.8 + rnd() * 0.3) : 9 - spread * 0.42 * (0.8 + rnd() * 0.3)
    foam += `M${r0(-68 - t * 560)} ${r0(y)}h${r0(4 + rnd() * 13 * (1 - t * 0.5))}`
  }
  const wake = `<path d="${foam}" fill="none" stroke="url(#wk)" stroke-width="3" stroke-linecap="round"/><path d="M-66 13Q-320 34 -640 70M-66 8Q-320 -2 -640 -18" fill="none" stroke="url(#wk)" stroke-width="1.8" opacity=".8"/><path d="M-62 10H-250" fill="none" stroke="url(#wk)" stroke-width="3.4" stroke-linecap="round"/><path class="foam" d="M68 9h8M79 12h6M72 15h5M-70 12h10M-90 10h7" fill="none" stroke-width="2.2" stroke-linecap="round"/>`

  const hull = `<path class="hu" d="M-62 -6C-58 8 -46 14 -30 14H34C50 14 60 6 66 -8C40 -2 -30 -2 -62 -6Z"/><path class="hk" d="M-53 8C-46 13 -38 14 -30 14H34C44 14 52 11 57 5C30 9 -30 9 -53 8Z"/><path class="hr" d="M-61 -5C-30 -1 40 -1 65 -7" fill="none" stroke-width="2" stroke-linecap="round"/>`
  const torso = `<path class="mn" d="M-23 -4C-24 -21 -18 -29 -10 -29C-3 -29 1 -21 1 -4Z"/><circle class="mn" cx="-10" cy="-33" r="5.5"/>`
  const body = `${torso}<path class="hat" d="M-27 -33Q-10 -38 7 -33L-8 -46Q-10 -47 -12 -46Z"/>`
  const man = busy ? `<g transform="rotate(13 -10 -4)">${body}</g>` : body
  const lamp = `<path class="pole" d="M50 -7V-27" fill="none" stroke-width="1.6"/><rect class="lamp" x="46.5" y="-36" width="7" height="9" rx="2"/>`
  const rod = `<path class="pole" d="M-2 -15L60 -60" fill="none" stroke-width="1.6" stroke-linecap="round"/><path class="line" d="M60 -60Q84 -30 98 4" fill="none" stroke-width=".8"/><g class="float"><circle class="fl" cx="98" cy="5" r="3"/><circle class="flt" cx="98" cy="3.4" r="1.6"/></g>`
  const paddle = `<g class="oar"><path class="pole" d="M-6 -24L30 20" fill="none" stroke-width="2.6" stroke-linecap="round"/><path class="blade" d="M22 10L36 17L32 31L18 22Z"/></g>`
  const floatRings = `<ellipse class="ring fr" cx="98" cy="8" rx="18" ry="5"/><ellipse class="ring fr fr2" cx="98" cy="8" rx="18" ry="5"/>`

  const boat = `<g class="bx"><g transform="translate(0 778)"><g><animateTransform attributeName="transform" type="rotate" values="0;-7;6;-4;2;0" dur="2.2s" begin="bt.click"/>
<g class="bob">
<ellipse class="glowR D" cx="50" cy="40" rx="6" ry="24"/>
<g transform="matrix(1 0 0 -.8 0 25)" class="brf">${hull}${torso}</g>
<path class="fleck" d="M-44 30h10M6 36h13M-14 44h8M30 28h7M-30 52h6M16 50h9" fill="none" stroke-width="2.2" stroke-linecap="round"/>
${busy ? wake : floatRings}
<circle class="glow D" cx="50" cy="-31" r="44"/>
${lamp}${hull}${man}${busy ? paddle : rod}
</g></g>
${splash('bt', 0, 16, false)}
<rect class="hit" id="bt" x="-90" y="-70" width="200" height="110"/>
</g></g>`

  const zones = [0, 1, 2, 3, 4, 5]
    .map(k => {
      const x = (k % 3) * 534
      const y = k < 3 ? SHORE + 6 : 820
      const h = k < 3 ? 820 - SHORE - 6 : 180
      return splash(`w${k}`, x + 180 + r0(rnd() * 170), y + r0(h * (0.4 + rnd() * 0.3))) + `<rect class="hit" id="w${k}" x="${x}" y="${y}" width="534" height="${h}"/>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
.D{display:none}.hit{fill:#000;fill-opacity:0;pointer-events:all;cursor:pointer}
${cssL}
.sk0{stop-color:#b4c3ee}.sk1{stop-color:#fdead4}.wa0{stop-color:#f6dcc6}.wa1{stop-color:#bccaf0}.cl{stop-color:#fff7e8}.mi{stop-color:#fff4e2}
.s1{stroke:#fffaf0}.s2{stroke:#a3b4ec}.sky3{opacity:.42}.cld{opacity:.95}
.kd{stroke:#0c1650}.kx{opacity:.3}.dl{opacity:1}.tr{stroke:#cf8a58}
.w1{stroke:#fff8ea}.w2{stroke:#3f5ec8}.wx{opacity:.9}
.sh{fill:#fff9f0}.shs{opacity:.75}.rl{stroke:#fff6e8;opacity:.6}.gl{stroke:#fff0cc;opacity:.6}
.orb{fill:#fff5d8}.st{display:none}
.rl,.gl,.st,.tr{fill:none;stroke-linecap:round}.tr{stroke-width:3.4}
.hu{fill:#f2561d}.hk{fill:#bb3b10}.hr{stroke:#ffb48c}.mn{fill:#161d4a}.hat{fill:#f6e7b6}.brf{opacity:.5}.fleck{stroke:#f4703a;opacity:.6}
.pole{stroke:#20264f}.line{stroke:#fff;opacity:.8}.fl{fill:#e63f26}.flt{fill:#fff}.lamp{fill:#f7e9bd;stroke:#20264f;stroke-width:1}.blade{fill:#20264f}
.ring{fill:none;stroke:#fffdf6;stroke-width:1.8}.fish{fill:#f4f6ff}.foam{stroke:#fff}
.grain{opacity:.1;mix-blend-mode:multiply;pointer-events:none}.glow{fill:url(#lg)}.glowR{fill:#ffb060;opacity:.5;filter:url(#b3)}
.rfl{opacity:.92}.mists{opacity:.42}
.bx{transform:translate(1345px,0)}
.bob{animation:bob 5s ease-in-out infinite alternate}
.float{animation:dip 2.6s ease-in-out infinite alternate}
.fr{stroke-dasharray:3 5;stroke-linecap:round;transform-box:fill-box;transform-origin:center;animation:ring 6s ease-out infinite;opacity:0}.fr2{animation-delay:-3s}
.sA{animation:shA ${busy ? 5 : 9}s steps(${busy ? 10 : 9}) infinite alternate}
.tw{animation:tw 7s steps(7) infinite alternate}.tw2{animation:tw 9s steps(9) -4s infinite alternate-reverse}
.oar{transform-box:fill-box;transform-origin:14% 6%;animation:row 1.7s ease-in-out infinite alternate}
${busy ? '.bx{animation:sail 84s linear -65.8s infinite}' : ''}
@keyframes bob{from{transform:translateY(-.8px) rotate(-.8deg)}to{transform:translateY(1px) rotate(.9deg)}}
@keyframes dip{from{transform:translateY(-1.4px)}to{transform:translateY(1.6px)}}
@keyframes ring{0%{transform:scale(.2);opacity:0}12%{opacity:.7}60%,100%{transform:scale(2.6);opacity:0}}
@keyframes shA{from{transform:translateX(-14px)}to{transform:translateX(14px)}}
@keyframes tw{from{opacity:.35}to{opacity:1}}
@keyframes row{from{transform:rotate(-24deg)}to{transform:rotate(20deg)}}
@keyframes sail{from{transform:translate(-160px,0)}to{transform:translate(1760px,0)}}
@keyframes sailP{from{transform:translate(430px,0)}to{transform:translate(1170px,0)}}
@media (prefers-color-scheme:dark){.D{display:block}.L{display:none}
${cssD}
.sk0{stop-color:#050818}.sk1{stop-color:#1a2760}.wa0{stop-color:#1c2a68}.wa1{stop-color:#080d2c}.cl{stop-color:#2c3c88}.mi{stop-color:#6176cc}
.s1{stroke:#22307a}.s2{stroke:#0a1030}.sky3{opacity:.5}.cld{opacity:.4}
.kd{stroke:#02041a}.kx{opacity:.22}.dl{opacity:.5}.tr{stroke:#1c2764}
.w1{stroke:#6c82da}.w2{stroke:#02051a}.wx{opacity:.6}
.sh{fill:#93a6ee}.shs{opacity:.35}.rl{stroke:#7389dc;opacity:.4}.gl{stroke:#f4f5ff;opacity:.7}
.orb{fill:#f6f6ff}.st{display:block;stroke:#dfe5ff;stroke-width:2.2}
.hu{fill:#e2531f}.hk{fill:#8e2c0c}.hr{stroke:#ffc79a}.mn{fill:#090d2a}.hat{fill:#e9c98a}.brf{opacity:.45}.fleck{stroke:#f08a4a;opacity:.5}
.pole{stroke:#0a0d28}.line{stroke:#c9d2f6;opacity:.6}.lamp{fill:#ffd98a;stroke:#3a1c08}.blade{fill:#0a0d28}
.ring{stroke:#b9c6f8}.fish{fill:#c9d4fa}.foam{stroke:#dfe6ff}
.grain{opacity:.18;mix-blend-mode:overlay}.rfl{opacity:.85}.mists{opacity:.12}}
@media (max-aspect-ratio:1/1){.land{transform:translate(260px,0)}.sky2{transform:translate(-480px,0)}.bx{transform:translate(790px,0)}${busy ? '.bx{animation:sailP 44s linear -21.4s infinite}' : ''}}
@media (prefers-reduced-motion:reduce){*{animation:none !important}}
</style>
<defs>
<filter id="rb" x="0" y="0" width="100%" height="100%"><feGaussianBlur stdDeviation="1.5 6"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .12 0 0 0 0 .14 0 0 0 0 .34 0 0 0 1.5 -.5"/></filter>
<filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
<clipPath id="wc"><rect x="-20" y="${SHORE}" width="1640" height="380"/></clipPath>
<clipPath id="fc"><path d="${back}"/></clipPath>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sk0"/><stop offset=".55" class="sk1"/></linearGradient>
<linearGradient id="bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="bk0"/><stop offset="1" class="bk1"/></linearGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="wa0"/><stop offset="1" class="wa1"/></linearGradient>
<linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="mi" stop-opacity="0"/><stop offset="1" class="mi"/></linearGradient>
<linearGradient id="cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="cl"/><stop offset=".9" class="cl" stop-opacity="0"/></linearGradient>
<linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#fff" stop-opacity=".85"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="mgs" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="340"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
<linearGradient id="mgw" gradientUnits="userSpaceOnUse" x1="0" y1="${SHORE}" x2="0" y2="1000"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity=".95"/></linearGradient>
<linearGradient id="mgr" gradientUnits="userSpaceOnUse" x1="0" y1="${SHORE}" x2="0" y2="1000"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient>
<linearGradient id="wk" gradientUnits="userSpaceOnUse" x1="-64" y1="0" x2="-640" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="haloL"><stop offset="0" stop-color="#fff0cf" stop-opacity=".9"/><stop offset=".35" stop-color="#ffd9b0" stop-opacity=".4"/><stop offset="1" stop-color="#ffd9b0" stop-opacity="0"/></radialGradient>
<radialGradient id="haloD"><stop offset="0" stop-color="#e9edff" stop-opacity=".5"/><stop offset=".3" stop-color="#b9c6ff" stop-opacity=".18"/><stop offset="1" stop-color="#b9c6ff" stop-opacity="0"/></radialGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#ffd58a" stop-opacity=".95"/><stop offset=".3" stop-color="#ff9d4a" stop-opacity=".4"/><stop offset="1" stop-color="#ff8a3a" stop-opacity="0"/></radialGradient>
<path id="dA" d="${dA}" fill="none" stroke-width="2.6" stroke-linecap="round"/><path id="dB" d="${dB}" fill="none" stroke-width="2.4" stroke-linecap="round"/><path id="dC" d="${dC}" fill="none" stroke-width="2.8" stroke-linecap="round"/>
<path id="wA" d="${wA}" fill="none" stroke-width="2.6" stroke-linecap="round"/><path id="wB" d="${wB}" fill="none" stroke-width="2.6" stroke-linecap="round"/>
<pattern id="pk" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="translate(71 23) rotate(31)"><use href="#dC" class="kd"/><use href="#dA" class="kd" opacity=".5"/></pattern>
<pattern id="ps" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(90)"><use href="#dA" class="s1"/><use href="#dC" class="s2"/></pattern>
<pattern id="pw" width="240" height="120" patternUnits="userSpaceOnUse"><use href="#wA" class="w1"/><use href="#wB" class="w2"/></pattern>
<mask id="ms" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="${SHORE}"><rect width="1600" height="${SHORE}" fill="url(#mgs)"/></mask>
<mask id="mr" maskUnits="userSpaceOnUse" x="-20" y="${SHORE}" width="1640" height="360"><rect x="-20" y="${SHORE}" width="1640" height="360" fill="url(#mgr)"/></mask>
<mask id="mw" maskUnits="userSpaceOnUse" x="-20" y="${SHORE}" width="1640" height="360"><rect x="-20" y="${SHORE}" width="1640" height="360" fill="url(#mgw)"/></mask>
${grads}${pats}${masks}
${SIZES.map((r, i) => crown(`c${i}a`, r, false) + crown(`c${i}b`, r, true)).join('')}${tall('t0', 34)}${tall('t1', 44)}
</defs>

<g class="land">
<rect x="-300" width="2200" height="${SHORE}" fill="url(#sky)"/>
<g class="cld" fill="url(#cl)">${clouds}</g>
<rect class="sky3" width="1600" height="${SHORE}" fill="url(#ps)" mask="url(#ms)"/>
<g class="sky2">
<circle class="L" cx="1095" cy="118" r="130" fill="url(#haloL)"/><circle class="D" cx="1095" cy="118" r="150" fill="url(#haloD)"/>
<circle class="orb" cx="1095" cy="118" r="25"/>
</g>
<path class="st tw" d="${star[0]}"/><path class="st tw2" d="${star[1]}"/>

<path d="${back}" fill="url(#bk)"/>
${trees}
<rect class="kx" x="-20" y="100" width="1640" height="${SHORE - 100}" fill="url(#pk)" clip-path="url(#fc)"/>
<rect class="mists" x="-20" y="${SHORE - 46}" width="1640" height="46" fill="url(#mist)"/>

<rect x="-300" y="${SHORE}" width="2200" height="360" fill="url(#water)"/>
<g clip-path="url(#wc)" mask="url(#mr)"><g class="rfl" transform="matrix(1 0 0 -.62 0 ${r0(SHORE * 1.62)})" filter="url(#rb)"><path d="${back}" fill="url(#bk)"/>${mirror}</g></g>
<rect class="wx" x="-20" y="${SHORE}" width="1640" height="360" fill="url(#pw)" mask="url(#mw)"/>
<path class="rl sA" d="${ripples(40, -40, 1600, SHORE + 40)}" stroke-width="2"/>
<g class="sky2"><path class="gl sA" d="${ripples(40, 1045, 1145, SHORE + 20)}" stroke-width="2.4"/></g>
<rect class="sh shs" x="-20" y="${SHORE - 5}" width="1640" height="10" filter="url(#b3)"/>
<rect class="sh" x="-20" y="${SHORE - 1}" width="1640" height="2.4" opacity=".9"/>
</g>

${zones}
${boat}
<rect class="grain" width="1600" height="1000" filter="url(#grain)"/>
</svg>`
}
