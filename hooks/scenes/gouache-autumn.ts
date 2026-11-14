// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// «Осень»: a November night in flat gouache. A lone maple on a hill sheds its leaves by a lamp and a bench with a cat;
// far off, a village and a lighthouse over a bay. Resting: leaves fall one by one. Working: the wind takes them.
// Light and dark live in one SVG, switched by prefers-color-scheme. Pure string building.

/** A seeded generator, so the scene draws the same picture every time. */
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const r0 = (n: number) => Math.round(n)
let rnd = rng(31)

// the foot of the tree, and the hill it stands on: a long slope to the left, a steep fall to the right
const TX = 1370
const TY = 646
const CREST = TX + 10
const LEFT = CREST - 1101 // where the long slope leaves the picture
const hillY = (x: number) => TY + (x < CREST ? 0.0003 : 0.006) * (x - CREST) ** 2
// the far ridges
const ridge2 = (x: number) => 700 + 5 * Math.sin(x / 170) + 3 * Math.sin(x / 61 + 1)
const ridge1 = (x: number) => 648 - (18 + 9 * Math.sin(x / 260 + 0.6) + 5 * Math.sin(x / 97)) * Math.min(1, (x - 440) / 220)

/** One painted leaf: a pointed oval from (x,y), len long, bulging wid to each side. */
function leaf(x: number, y: number, len: number, wid: number, ang: number): string {
  const dx = Math.cos(ang) * len
  const dy = Math.sin(ang) * len
  const nx = -Math.sin(ang) * wid
  const ny = Math.cos(ang) * wid
  return `M${r0(x)} ${r0(y)}q${r0(dx / 2 + nx)} ${r0(dy / 2 + ny)} ${r0(dx)} ${r0(dy)}q${r0(-dx / 2 - nx)} ${r0(-dy / 2 - ny)} ${r0(-dx)} ${r0(-dy)}`
}

/** The crown, around the tree's foot: three groups that rock apart, four tones each, lit from the lamp side. */
function crown(): string {
  const d = [0, 1, 2].map(() => ['', '', '', ''])
  for (let i = 0; i < 2000; i++) {
    const a = rnd() * Math.PI * 2
    const rr = Math.pow(rnd(), 0.5) * 1.28
    const u = Math.cos(a) * rr
    const v = Math.sin(a) * rr
    const keep = rr < 1 ? (0.58 + 0.42 * rr) * (v > 0.3 ? Math.max(0.12, 1 - (v - 0.3) * 1.5) : 1) : u < 0.2 ? 0.16 * (1.28 - rr) / 0.28 : 0.04
    if (rnd() > keep) continue
    const x = u * 195
    const y = -300 + v * 225
    let light = 0.5 - 0.28 * u - 0.1 * v + (rnd() - 0.5) * 0.55
    const lamp = Math.hypot(x + 185, y + 190)
    if (lamp < 230) light += ((230 - lamp) / 230) * 0.5
    const tone = light > 0.78 ? 3 : light > 0.5 ? 2 : light > 0.25 ? 1 : 0
    const g = y < -330 ? (x < 0 ? 0 : 1) : 2
    d[g][tone] += leaf(x, y, 11 + rnd() * 7, 6.5 + rnd() * 3.5, Math.atan2(v, u) + (rnd() - 0.5) * 2.4)
  }
  let under = ''
  for (let i = 0; i < 16; i++) {
    const a = rnd() * Math.PI * 2
    const rr = Math.sqrt(rnd()) * 0.62
    under += `<circle cx="${r0(Math.cos(a) * rr * 195)}" cy="${r0(-310 + Math.sin(a) * rr * 215)}" r="${r0(52 + rnd() * 30)}"/>`
  }
  return `<g class="u" filter="url(#b6)">${under}</g>${d.map((g, i) => `<g class="c${i}">${g.map((p, t) => `<path class="k${t}" d="${p}"/>`).join('')}</g>`).join('')}`
}

/** Leaves in the air. Resting they come down near the tree; working the wind carries them across the whole picture. */
function falling(busy: boolean): string {
  let out = ''
  const n = busy ? 46 : 18
  for (let i = 0; i < n; i++) {
    const tree = rnd() < (busy ? 0.55 : 0.7)
    const x = tree ? TX - 190 + rnd() * 380 : busy ? 300 + rnd() * 1500 : 150 + rnd() * 1300
    const y = tree ? TY - 500 + rnd() * 380 : 60 + rnd() * 420
    const dur = busy ? 4 + rnd() * 4.5 : 11 + rnd() * 10
    const w = busy ? -(650 + rnd() * 900) : -(40 + rnd() * 260)
    const h = busy ? 60 + rnd() * 380 : 260 + rnd() * 330
    const turn = (rnd() < 0.5 ? -1 : 1) * (200 + rnd() * 520)
    out += `<g class="f" style="--x:${r0(x)}px;--y:${r0(y)}px;--w:${r0(w)}px;--h:${r0(h)}px;--r:${r0(turn)}deg;animation-duration:${dur.toFixed(1)}s;animation-delay:-${(rnd() * dur).toFixed(1)}s"><g class="sw" style="animation-delay:-${(rnd() * 3).toFixed(1)}s"><use href="#lf" class="l${i % 3}" transform="scale(${(busy ? 0.6 + rnd() * 0.55 : 0.75 + rnd() * 0.85).toFixed(2)})"/></g></g>`
  }
  if (busy)
    for (let i = 0; i < 3; i++) {
      const dur = 4.5 + rnd() * 2.5
      out += `<g class="f nf" style="--x:${r0(1500 + rnd() * 300)}px;--y:${r0(560 + rnd() * 260)}px;--w:-2100px;--h:${r0(40 + rnd() * 120)}px;--r:${r0(300 + rnd() * 300)}deg;animation-duration:${dur.toFixed(1)}s;animation-delay:-${(rnd() * dur).toFixed(1)}s"><g class="sw"><use href="#lf" class="l${i}" transform="scale(${(2.1 + rnd() * 0.7).toFixed(1)})"/></g></g>`
    }
  return out
}

/** Leaves that drop out of the crown when #id is clicked (tree coordinates). */
function flurry(id: string): string {
  let out = ''
  for (let i = 0; i < 12; i++) {
    const begin = `${id}.click+${(rnd() * 0.6).toFixed(2)}s`
    const dur = (2.6 + rnd() * 1.4).toFixed(1)
    const dx = r0(-40 - rnd() * 150)
    out += `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.8;1" dur="${dur}s" begin="${begin}"/><animateMotion dur="${dur}s" begin="${begin}" rotate="auto" path="M${r0(-170 + rnd() * 340)} ${r0(-470 + rnd() * 300)}q${dx} 110 ${r0(dx * 0.4)} 230t${dx} 200"/><use href="#lf" class="l${i % 3}" transform="scale(1.3)"/></g>`
  }
  return out
}

/** Out-of-focus leaves close to the eye, fanning from a bottom corner. */
function sprig(x: number, y: number, side: number, n: number): string {
  let stems = ''
  let leaves = ''
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + side * (0.08 + i * 0.2) + (rnd() - 0.5) * 0.16
    const len = 110 + rnd() * 130
    const ex = x + Math.cos(a) * len
    const ey = y + Math.sin(a) * len
    stems += `M${r0(x)} ${r0(y)}Q${r0((x + ex) / 2 - side * 16)} ${r0((y + ey) / 2)} ${r0(ex)} ${r0(ey)}`
    for (let j = 0; j < 4; j++) {
      const t = 0.42 + j * 0.2
      const tone = (i + j) % 5 === 0 ? 'dk' : `k${(i * 2 + j) % 4}`
      leaves += `<use href="#lf" class="${tone}" transform="translate(${r0(x + (ex - x) * t)} ${r0(y + (ey - y) * t)}) rotate(${r0((a * 180) / Math.PI + 90 + (j % 2 ? 55 : -55) + (rnd() - 0.5) * 30)}) scale(${(2.6 + rnd() * 1.4).toFixed(1)})"/>`
    }
  }
  return `<path class="st" d="${stems}" fill="none" stroke-width="4" stroke-linecap="round"/>${leaves}`
}

export function gouacheAutumnScene(activity: 'idle' | 'busy' = 'idle'): string {
  rnd = rng(31)
  const busy = activity === 'busy'

  // sky: stars of three sizes, a few that twinkle, a few four-pointed ones
  const dots = ['', '', '']
  let sparks = ''
  let twinkle = ''
  for (let i = 0; i < 120; i++) {
    const x = r0(-120 + rnd() * 1840)
    const y = r0(16 + Math.pow(rnd(), 1.3) * 570)
    const k = rnd()
    if (i % 17 === 0) sparks += `M${x} ${y - 7}q1 6 7 7q-6 1 -7 7q-1 -6 -7 -7q6 -1 7 -7z`
    else if (i % 11 === 0) twinkle += `<circle class="tw" cx="${x}" cy="${y}" r="1.8" style="animation-delay:-${(rnd() * 4).toFixed(1)}s"/>`
    else dots[k < 0.55 ? 0 : k < 0.88 ? 1 : 2] += `M${x} ${y}h0`
  }

  // far land
  let r1 = 'M430 1010V664'
  for (let x = 440; x <= 2300; x += 40) r1 += `L${x} ${r0(ridge1(x))}`
  r1 += 'V1010Z'
  let r2 = 'M-700 1010'
  for (let x = -700; x <= 2300; x += 40) r2 += `L${x} ${r0(ridge2(x))}`
  r2 += 'V1010Z'
  let glitter = ''
  for (let i = 0; i < 16; i++) glitter += `M${r0(300 + rnd() * 150)} ${r0(652 + i * 3.2)}h${r0(8 + rnd() * 22)}`

  const house = (x: number, y: number, w: number, h: number, lit: boolean) =>
    `<path class="hw" d="M${x} ${y}v${-h}h${w}v${h}z"/><path class="hr" d="M${x - 2} ${y - h}l${w / 2 + 2} ${-r0(h * 0.62)}l${w / 2 + 2} ${r0(h * 0.62)}z"/>${lit ? `<circle class="wh D" cx="${x + 5}" cy="${y - h + 6}" r="9"/><path class="wn" d="M${x + 3} ${y - h + 4}h4v5h-4z${w > 16 ? `M${x + w - 7} ${y - h + 4}h4v5h-4z` : ''}"/>` : ''}`
  const fir = (x: number, y: number, h: number) => `<path class="cf" d="M${x} ${y - h}l${r0(h * 0.3)} ${h}h${-r0(h * 0.6)}z"/>`
  const bush = (x: number, y: number, r: number) => `<circle class="ab" cx="${x}" cy="${y}" r="${r}"/>`
  const on2 = (x: number) => r0(ridge2(x)) + 2
  const village =
    fir(510, on2(510), 24) + bush(522, on2(522) - 5, 7) + house(528, on2(528), 16, 12, true) + house(550, on2(550), 22, 15, true) + fir(580, on2(580), 30) +
    house(590, on2(590), 14, 11, false) + bush(612, on2(612) - 6, 8) + house(620, on2(620), 18, 13, true) + fir(646, on2(646), 20) + house(654, on2(654), 16, 11, true) + bush(678, on2(678) - 4, 6)
  const hamlet = `<path class="r2" d="M1430 716C1466 699 1560 697 1640 702V730H1430Z"/>${fir(1474, 702, 26)}${house(1486, 701, 20, 14, true)}${bush(1514, 696, 8)}${house(1522, 700, 16, 12, true)}${fir(1548, 701, 32)}${house(1558, 701, 22, 15, true)}${bush(1590, 696, 7)}`

  // the lighthouse on its headland, drawn with the foot of the tower at (0,0)
  const tower = `<g transform="translate(118 606) scale(1.8)">
<g class="D bm"><path d="M0 -44L190 -62V-26Z" fill="url(#beam)"/></g>
<circle class="D lhh" cx="0" cy="-44" r="30" fill="url(#lhg)"/>
<circle class="D" cx="0" cy="-44" r="46" fill="url(#lhg)" opacity="0"><animate attributeName="opacity" values="0;1;0;1;0" dur="1.6s" begin="lh.click"/></circle>
<path class="hw" d="M9 0v-9h16v9z"/><path class="hr" d="M7 -9l10 -6l10 6z"/><path class="wn" d="M14 -6h3v3h-3z"/>
<path class="lw" d="M-7 0L-5 -38H5L7 0Z"/><path class="lr" d="M-5.6 -27H5.6L5 -38H-5Z"/><path class="wn" d="M-1.5 -20h3v5h-3zM-1.5 -9h3v5h-3z"/>
<path class="lk" d="M-7.5 -40h15v2.4h-15zM-5.5 -48L0 -55L5.5 -48Z"/><path class="ll" d="M-4 -48h8v8h-8z"/>
<rect class="hit" id="lh" x="-20" y="-62" width="52" height="64"/></g>`

  // the hill: grass strokes that lean with the wind, tufts on the crest, leaves that already fell
  const grass = ['', '']
  for (let i = 0; i < 210; i++) {
    const x = LEFT + 20 + rnd() * (CREST + 230 - LEFT)
    const top = hillY(x)
    if (top > 990) continue
    const y = top + 5 + Math.pow(rnd(), 1.3) * (1000 - top)
    const k = 0.6 + ((y - 640) / 360) * 0.9
    const len = (8 + rnd() * 15) * k
    const lean = (3 + rnd() * 8) * k
    grass[rnd() < 0.68 ? 0 : 1] += `M${r0(x)} ${r0(y)}q${r0(-lean * 0.3)} ${r0(-len * 0.6)} ${r0(-lean)} ${r0(-len)}`
  }
  let tufts = ''
  for (let i = 0; i < 90; i++) {
    const x = LEFT + 60 + rnd() * (CREST + 150 - LEFT)
    tufts += `M${r0(x)} ${r0(hillY(x) + 2)}l${r0(-2 - rnd() * 5)} ${r0(-5 - rnd() * 9)}`
  }
  const fallen = ['', '']
  for (let i = 0; i < 120; i++) {
    const x = i < 84 ? TX + (rnd() + rnd() + rnd() - 1.5) * 560 : 300 + rnd() * 1000
    const top = hillY(x)
    const y = top + 9 + rnd() * rnd() * 250
    if (x < LEFT + 10 || y > 992 || top > 990) continue
    const near = 0.7 + ((y - top) / 250) * 1.1
    fallen[i % 3 === 0 ? 1 : 0] += leaf(x, y, (7 + rnd() * 8) * near, (2.6 + rnd() * 2.4) * near, (rnd() - 0.5) * 1.1 + (rnd() < 0.5 ? 0 : Math.PI))
  }

  // the tree, around its foot
  const limbs: [string, number][] = [
    ['M-9 -180C-50 -215 -105 -225 -160 -262', 9], ['M9 -165C50 -200 100 -218 150 -246', 8.5],
    ['M-8 -245C-42 -295 -92 -328 -138 -378', 7], ['M8 -232C42 -285 84 -318 132 -356', 7],
    ['M-5 -318C-28 -368 -58 -402 -84 -452', 5.5], ['M5 -305C28 -358 54 -398 78 -446', 5.5],
    ['M0 -400C-4 -440 6 -470 2 -508', 4], ['M-110 -244C-128 -262 -150 -300 -150 -332', 4],
    ['M104 -230C126 -252 150 -284 156 -318', 4], ['M-70 -300C-70 -330 -92 -366 -80 -402', 3.5],
    ['M66 -292C70 -322 96 -352 92 -394', 3.5], ['M-40 -200C-70 -196 -110 -170 -152 -174', 4],
    ['M40 -188C76 -180 110 -160 150 -168', 4], ['M-128 -366C-150 -380 -166 -400 -170 -424', 3], ['M124 -346C146 -360 164 -384 166 -410', 3],
  ]
  const tree = `<ellipse class="sh" cx="34" cy="10" rx="62" ry="10"/>
<path class="tk" d="M-34 8C-19 -6 -15 -70 -13 -190L-8 -300L-3 -430H3L9 -300L13 -190C15 -70 20 -6 36 8Z"/>
<g class="br" fill="none" stroke-linecap="round">${limbs.map(([p, w]) => `<path d="${p}" stroke-width="${w}"/>`).join('')}</g>
<path class="tr" d="M-11 -16C-10 -80 -9 -140 -8 -205M-5 -8C-5 -90 -4 -170 -3 -262M-16 -2C-13 -34 -12 -66 -11 -104M-7 -212L-5 -296" fill="none" stroke-width="3" stroke-linecap="round"/>
${crown()}
<path class="g2" d="M-30 8l-5 -12M-20 9l-2 -14M24 9l4 -13M34 8l6 -10M-40 8l-8 -9" fill="none" stroke-width="2" stroke-linecap="round"/>
${flurry('cr')}<rect class="hit" id="cr" x="-205" y="-535" width="410" height="440"/>`

  // the lamp, around its foot
  const lamp = `<g transform="translate(-185 11)">
<g class="glo"><circle class="glw" cx="0" cy="-186" r="150"/><animate attributeName="opacity" values="1;.1;1;.25;1;.08;.08;1" dur="2.2s" begin="lm.click"/></g>
<path class="post" d="M-10 0h20l-4 -11h-12zM-3.2 -11h6.4v-158h-6.4zM-6 -62h12v5h-12zM-11 -172h22v4h-22zM-17 -201h34l-8 -9h-18z"/><circle class="post" cx="0" cy="-213" r="3.4"/>
<path class="glass" d="M-9 -172L-13 -201H13L9 -172Z"/>
<rect class="hit" id="lm" x="-30" y="-222" width="60" height="226"/></g>`

  // the bench and the cat, around the middle of the bench's feet
  const cat = busy
    ? `<path class="cat" d="M15 -20C12 -36 18 -47 27 -48C36 -47 42 -36 40 -20Z"/><g class="ch"><circle class="cat" cx="26" cy="-53" r="7.2"/><path class="cat" d="M20 -57l-1 -9l7 5zM28 -60l5 -6l1 9z"/></g><path class="cs tl" d="M39 -23c10 1 16 -5 14 -15" fill="none" stroke-width="3.6" stroke-linecap="round"/><path class="rm" d="M17 -30C15 -39 20 -46 26 -47M19 -55a7.2 7.2 0 0 1 5 -5" fill="none" stroke-width="1.3" stroke-linecap="round"/>`
    : `<g class="zz"><ellipse class="cat" cx="27" cy="-28" rx="18" ry="9"/></g><circle class="cat" cx="10" cy="-31" r="6.8"/><path class="cat" d="M4 -35l-1 -8l7 4zM12 -37l4 -7l2 8z"/><path class="cs" d="M44 -26c7 3 4 9 -7 8" fill="none" stroke-width="3.6" stroke-linecap="round"/><path class="rm" d="M4 -30q-1 -7 6 -8M13 -36q13 -4 25 1" fill="none" stroke-width="1.3" stroke-linecap="round"/>`
  let kicked = ''
  for (let i = 0; i < 7; i++) {
    const dx = r0((i - 3) * 22 + (rnd() - 0.5) * 16)
    const up = r0(50 + rnd() * 70)
    const begin = `bn.click+${(rnd() * 0.15).toFixed(2)}s`
    kicked += `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.8;1" dur="1.4s" begin="${begin}"/><animateMotion dur="1.4s" begin="${begin}" rotate="auto" path="M${r0(-30 + i * 9)} -18q${r0(dx * 0.5)} ${-up * 2} ${dx} ${r0(up * 0.4)}"/><use href="#lf" class="l${i % 3}"/></g>`
  }
  const bench = `<g transform="translate(-96 5)">
<ellipse class="sh" cx="18" cy="2" rx="80" ry="8"/>
<path class="bw" d="M-54 -54h108v7h-108zM-54 -44h108v7h-108zM-54 -34h108v6h-108zM-58 -24h116l6 11h-128z"/>
<path class="rm" d="M-54 -54h108M-54 -44h108M-58 -24h116" fill="none" stroke-width="1.4"/>
<path class="bi" d="M-55 -56C-64 -42 -62 -26 -59 -13L-61 2M-57 -13L-46 2M55 -56C64 -42 62 -26 59 -13L61 2M57 -13L46 2M-62 -30c-9 -2 -11 8 -3 9M62 -30c9 -2 11 8 3 9" fill="none" stroke-width="3.4" stroke-linecap="round"/>
<path class="k2" d="${leaf(-38, -22, 10, 4, 0.3)}${leaf(-12, -19, 9, 4, 2.6)}"/>
<g>${cat}<animateTransform attributeName="transform" type="translate" values="0 0;0 -18;0 0" dur=".45s" begin="bn.click"/></g>
${kicked}<rect class="hit" id="bn" x="-66" y="-66" width="132" height="72"/></g>`


  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
.D{display:none}.hit{fill:#000;fill-opacity:0;pointer-events:all;cursor:pointer}
.s0{stop-color:#d3d1c8}.s1{stop-color:#e5dfd1}.s2{stop-color:#f4e5c7}
.cl{stroke:#fcf6e8;opacity:.3}.sun{fill:#fffaee}
.sea{fill:#bcc7c2}.gt{stroke:#f6f1e4;opacity:.75}.hd{fill:#8b886a}
.r1{fill:#c9c4b0}.r2{fill:#aaa685}.r3{fill:#938e62}
.h0{stop-color:#ba955a}.h1{stop-color:#8a6c3e}.hb{fill:#5a4020;opacity:.12}
.g1{stroke:#f0ddaa;opacity:.6}.g2{stroke:#6a4e24;opacity:.5}
.hw{fill:#f3ebdc}.hr{fill:#7d4c3c}.wn{fill:#75624f}.cf{fill:#5c6748}.ab{fill:#c9742a}
.lw{fill:#f6f0e4}.lr{fill:#b3402e}.lk{fill:#3a302c}.ll{fill:#fff0c0}
.tk{fill:#3d2b22}.br{stroke:#3d2b22}.tr{stroke:#6a4a34;opacity:.55}
.u{fill:#e6a25c;opacity:.2}.wh{fill:#ffb84a;opacity:.32}.fs{fill:#a29c6e}.k0{fill:#a84e18}.k1{fill:#d06a1c}.k2{fill:#ea8a2a}.k3{fill:#f7b050}.dk{fill:#4a2a18}.st{stroke:#4a2a18}
.l0{fill:#c9601c}.l1{fill:#e8862a}.l2{fill:#f09c38}
.fa{fill:#c2601c}.fb{fill:#e68c2e}
.post{fill:#2b2420}.glass{fill:#fff1c8}.glw{fill:url(#lgL)}
.bw{fill:#4a3a30}.bi{stroke:#2b2420}.rm{stroke:#fff1d0;opacity:.55}.cat{fill:#1f1917}.cs{stroke:#1f1917}
.sh{fill:#3a2a10;opacity:.16}.rg{stroke:#fff}
.grain{opacity:.1;mix-blend-mode:multiply;pointer-events:none}
.fall,.spL,.spR{pointer-events:none}.tree{transform-origin:${TX}px ${TY}px}
.f{transform:translate(var(--x),var(--y));animation:fall linear infinite}.nf{filter:url(#b2);opacity:.55}
@keyframes fall{0%{transform:translate(var(--x),var(--y)) rotate(0deg);opacity:0}6%{opacity:1}88%{opacity:1}100%{transform:translate(calc(var(--x) + var(--w)),calc(var(--y) + var(--h))) rotate(var(--r));opacity:0}}
.sw{animation:sw 2.8s ease-in-out infinite alternate}
@keyframes sw{from{transform:translate(-12px,0) rotate(-25deg)}to{transform:translate(12px,0) rotate(30deg)}}
.c0,.c1,.c2{transform-origin:0 -210px;animation:rock ${busy ? '2.4s' : '7s'} ease-in-out infinite alternate}.c1{animation-delay:-1.1s}.c2{animation-delay:-2.3s}
@keyframes rock{from{transform:rotate(${busy ? -2.2 : -0.4}deg)}to{transform:rotate(${busy ? 0.5 : 0.4}deg)}}
.tw{fill:#fff;animation:tw 3.6s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.2}to{opacity:1}}
.glw{animation:lamp ${busy ? '1.7s' : '5s'} ease-in-out infinite alternate}
@keyframes lamp{from{opacity:.82}to{opacity:1}}
.bm{transform-origin:0 -44px;animation:${busy ? 'sweep 6s linear infinite' : 'lamp 6s ease-in-out infinite alternate'}}
@keyframes sweep{0%{transform:scaleX(1);opacity:.8}24%{transform:scaleX(.04);opacity:1}50%{transform:scaleX(-1);opacity:.8}76%{transform:scaleX(-.04);opacity:.2}100%{transform:scaleX(1);opacity:.8}}
.sy{transform-origin:40px 1010px;animation:sy ${busy ? '1.9s' : '6s'} ease-in-out infinite alternate}.sz{transform-origin:1570px 1010px;animation:sy ${busy ? '2.3s' : '7s'} ease-in-out -2s infinite alternate}
@keyframes sy{from{transform:rotate(${busy ? -3.5 : -1}deg)}to{transform:rotate(${busy ? 1 : 1.2}deg)}}
.zz{transform-origin:27px -19px;animation:zz 3.4s ease-in-out infinite alternate}
@keyframes zz{from{transform:scaleY(1)}to{transform:scaleY(1.09)}}
.tl{transform-origin:39px -23px;animation:tl 1.1s ease-in-out infinite alternate}
@keyframes tl{from{transform:rotate(-16deg)}to{transform:rotate(20deg)}}
.ch{transform-origin:26px -47px;animation:ch 2.6s ease-in-out infinite alternate}
@keyframes ch{from{transform:rotate(-13deg)}to{transform:rotate(7deg)}}
@media (prefers-color-scheme:dark){.D{display:block}.L{display:none}
.s0{stop-color:#10131d}.s1{stop-color:#1a2034}.s2{stop-color:#2e3556}
.cl{stroke:#3a4263;opacity:.22}
.sea{fill:#27325a}.gt{stroke:#d5dbf4;opacity:.5}.hd{fill:#151a22}
.r1{fill:#222a41}.r2{fill:#1a2120}.r3{fill:#141910}
.h0{stop-color:#5c4829}.h1{stop-color:#2a2114}.hb{fill:#000;opacity:.17}
.g1{stroke:#d2bd88;opacity:.32}.g2{stroke:#150f08;opacity:.55}
.hw{fill:#b5ab9b}.hr{fill:#272220}.wn{fill:#ffc864}.cf{fill:#0e120d}.ab{fill:#8a4718}
.lw{fill:#c6bfb2}.lr{fill:#9a3a2c}.lk{fill:#15120f}.ll{fill:#ffe08a}
.tk{fill:#231814}.br{stroke:#231814}.tr{stroke:#6a4226;opacity:.6}
.u{fill:#6e3a14;opacity:.55}.fs{fill:#1a2015}.k0{fill:#9a4a16}.k1{fill:#cf6c1c}.k2{fill:#f0902e}.k3{fill:#ffb85c}.dk{fill:#160d0a}.st{stroke:#160d0a}
.l0{fill:#cf6c1c}.l1{fill:#f0902e}.l2{fill:#ffb85c}
.fa{fill:#b85c1a}.fb{fill:#e88a2a}
.post{fill:#0f0d0c}.glass{fill:#ffe9a6}.glw{fill:url(#lgD)}
.bw{fill:#3a2c20}.bi{stroke:#0f0d0c}.rm{stroke:#f0a85a;opacity:.85}.cat{fill:#0b090c}.cs{stroke:#0b090c}
.sh{fill:#000;opacity:.3}.rg{stroke:#eadbc8}
.grain{opacity:.16;mix-blend-mode:overlay}}
@media (max-aspect-ratio:1/1){.fore,.fall{transform:translate(-560px,0)}.tree{transform:scale(.82)}.sky2{transform:translate(545px,-22px)}.spL{transform-origin:40px 1010px;transform:translate(530px,0) scale(.68)}.spR{transform-origin:1570px 1010px;transform:translate(-550px,0) scale(.68)}}
@media (prefers-reduced-motion:reduce){*{animation:none !important}}
</style>
<defs>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .2 0 0 0 0 .16 0 0 0 0 .14 0 0 0 1.5 -.5"/></filter>
<filter id="b2"><feGaussianBlur stdDeviation="2"/></filter><filter id="b4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2"/></filter>
<filter id="b6" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter><filter id="b9" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
<linearGradient id="sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="720"><stop offset="0" class="s0"/><stop offset=".55" class="s1"/><stop offset="1" class="s2"/></linearGradient>
<linearGradient id="hg" gradientUnits="userSpaceOnUse" x1="0" y1="640" x2="0" y2="1000"><stop offset="0" class="h0"/><stop offset="1" class="h1"/></linearGradient>
<linearGradient id="beam" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="190" y2="0"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></linearGradient>
<radialGradient id="lgD"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".95"/><stop offset=".22" stop-color="#ffab52" stop-opacity=".4"/><stop offset="1" stop-color="#ff8a3a" stop-opacity="0"/></radialGradient>
<radialGradient id="lgL"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset=".28" stop-color="#ffd27a" stop-opacity=".55"/><stop offset=".8" stop-color="#ffc45a" stop-opacity="0"/></radialGradient>
<radialGradient id="pool"><stop offset="0" stop-color="#f6a444" stop-opacity=".62"/><stop offset=".6" stop-color="#e88a30" stop-opacity=".2"/><stop offset="1" stop-color="#e88a30" stop-opacity="0"/></radialGradient>
<radialGradient id="lhg"><stop offset="0" stop-color="#ffe08a" stop-opacity=".85"/><stop offset="1" stop-color="#ffc860" stop-opacity="0"/></radialGradient>
<radialGradient id="mh"><stop offset="0" stop-color="#d6dcff" stop-opacity=".2"/><stop offset="1" stop-color="#d6dcff" stop-opacity="0"/></radialGradient>
<radialGradient id="sh"><stop offset="0" stop-color="#fff8e4" stop-opacity=".85"/><stop offset="1" stop-color="#fff8e4" stop-opacity="0"/></radialGradient>
<path id="lf" d="M0 -9C6 -5 7 3 0 9C-7 3 -6 -5 0 -9Z"/>
<path id="hp" d="M${LEFT} 1010Q${r0((LEFT + CREST) / 2)} ${TY} ${CREST} ${TY}Q${CREST + 130} ${TY} ${CREST + 260} ${r0(hillY(CREST + 260))}V1010Z"/>
<clipPath id="hc"><use href="#hp"/></clipPath>
</defs>

<rect x="-700" width="3000" height="724" fill="url(#sky)"/>
<g class="cl" fill="none" stroke-linecap="round" filter="url(#b9)"><path d="M-60 120q180 -30 420 -6" stroke-width="56"/><path d="M640 250q200 -34 470 4" stroke-width="44"/><path d="M1180 70q160 -20 380 10" stroke-width="60"/><path d="M150 390q220 -30 460 0" stroke-width="40"/><path d="M900 450q140 -18 300 6" stroke-width="34"/><path d="M-40 530q160 -20 330 0" stroke-width="38"/></g>
<g class="D" fill="none" stroke="#fff" stroke-linecap="round"><path d="${dots[0]}" stroke-width="1.7" opacity=".7"/><path d="${dots[1]}" stroke-width="2.6" opacity=".85"/><path d="${dots[2]}" stroke-width="3.8"/><path d="${sparks}" fill="#fff" stroke="none"/>${twinkle}</g>
<g class="sky2"><circle class="D" cx="410" cy="170" r="120" fill="url(#mh)"/><path class="D" fill="#eadbc8" transform="translate(410 170) rotate(-28)" d="M0 -30A30 30 0 1 0 23 19A24 24 0 1 1 0 -30Z"/>
<circle class="L" cx="410" cy="170" r="150" fill="url(#sh)"/><circle class="L sun" cx="410" cy="170" r="27"/>
<circle class="rg" cx="410" cy="170" r="30" fill="none" stroke-width="2" opacity="0"><animate attributeName="r" values="30;100" dur="1.4s" begin="mn.click"/><animate attributeName="opacity" values=".8;0" dur="1.4s" begin="mn.click"/></circle>
<g class="D"><g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.7;1" dur="1.1s" begin="mn.click+.2s"/><animateMotion dur="1.1s" begin="mn.click+.2s" path="M640 80L930 220"/><path d="M0 0l-80 -38" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/></g></g>
<circle class="hit" id="mn" cx="410" cy="170" r="48"/></g>

<rect class="sea" x="-700" y="646" width="1300" height="90"/><path class="gt" d="${glitter}" fill="none" stroke-width="1.6" stroke-linecap="round"/>
${tower}
<path class="hd" d="M-700 1010V626C-400 622 -120 618 40 606C100 600 150 600 176 612C196 624 204 640 214 662V1010Z"/>
<path class="r1" d="${r1}"/>
<path class="r2" d="${r2}"/>
${village}
<g class="fore">${hamlet}</g>
<path class="r3" d="M-700 764C-200 746 300 774 700 754S1300 744 2300 772V1010H-700Z"/>
<path class="fs" d="M-700 842C-300 812 100 850 420 826S760 800 900 812V850C700 838 500 868 300 872S-300 868 -700 890ZM-700 950C-360 924 -80 952 200 936S520 962 660 1010H-700Z"/>

<g class="fore">
<use href="#hp" fill="url(#hg)"/>
<path class="hb" d="M${LEFT} 1010Q${CREST - 540} 772 ${CREST} 748Q${CREST + 110} 750 ${CREST + 190} 1010Z" clip-path="url(#hc)"/>
<path class="g2" d="${tufts}" fill="none" stroke-width="1.8" stroke-linecap="round"/>
<path class="g1" d="${grass[0]}" fill="none" stroke-width="1.5" stroke-linecap="round"/><path class="g2" d="${grass[1]}" fill="none" stroke-width="1.7" stroke-linecap="round"/>
<path class="fa" d="${fallen[0]}"/><path class="fb" d="${fallen[1]}"/>
<g class="tree"><ellipse class="D" cx="${TX - 185}" cy="${TY + 19}" rx="215" ry="50" fill="url(#pool)" clip-path="url(#hc)"/><g transform="translate(${TX} ${TY})">
${tree}
${lamp}
${bench}
</g></g>
</g>
<g class="fall">${falling(busy)}</g>
<g class="spL"><g class="sy" filter="url(#b4)">${sprig(40, 1010, 1, 5)}</g></g>
<g class="spR"><g class="sz" filter="url(#b4)">${sprig(1570, 1010, -1, 4)}</g></g>
<rect class="grain" width="1600" height="1000" filter="url(#grain)"/>
</svg>`
}
