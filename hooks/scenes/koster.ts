// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Koster: a campfire at night, seen low, in the bottom-left corner. Only the fire changes between states.
// Pure string building, seeded LCG, CSS animation only.

type State = 'idle' | 'busy' | 'burst'

const FX = 500 // fire centre x
const FY = 870 // fire base y

function lcg(seed: number) {
  let s = seed >>> 0
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296)
}
const f = (n: number) => Math.round(n * 10) / 10

function stars(): string {
  const r = lcg(7)
  let o = ''
  for (let i = 0; i < 46; i++) {
    const x = 30 + r() * 1540
    const y = 20 + r() * 520
    const big = r() > 0.88
    o += `<circle class="st" cx="${f(x)}" cy="${f(y)}" r="${big ? 1.6 : 0.9}" style="animation-delay:-${f(r() * 9)}s;animation-duration:${f(5 + r() * 6)}s"/>`
  }
  return o
}

function pines(seed: number, k: number, lift: number): string {
  const r = lcg(seed)
  let o = ''
  let x = -20
  while (x < 1640) {
    const h = (70 + r() * 110 + (x < 700 ? 40 : 0)) * k + 90
    const w = 26 + r() * 22
    const base = 990 - lift
    o += `<path d="M${f(x)} ${base} L${f(x + w * 0.5)} ${f(base - h)} L${f(x + w)} ${base} Z"/>`
    x += w * (0.55 + r() * 0.35)
  }
  return o
}

function tongue(x: number, w: number, h: number, cls: string, dur: number, delay: number, fill: string): string {
  const d = `M${-w} 0 C${f(-w * 1.15)} ${f(-h * 0.35)} ${f(-w * 0.35)} ${f(-h * 0.62)} ${f(w * 0.05)} ${-h} C${f(w * 0.4)} ${f(-h * 0.6)} ${f(w * 1.15)} ${f(-h * 0.35)} ${w} 0 Z`
  return `<g transform="translate(${x} 0)"><path class="fl ${cls}" d="${d}" fill="${fill}" style="animation-duration:${dur}s;animation-delay:-${delay}s"/></g>`
}

function flames(scale: number): string {
  const s = scale
  const t = (x: number, w: number, h: number, c: string, dur: number, dl: number, fill: string) =>
    tongue(x * s, w * s, h * s, c, dur, dl, fill)
  return (
    // outer, red-orange
    t(-44, 26, 120, 'a', 2.3, 0.4, 'url(#fOut)') +
    t(40, 24, 105, 'b', 2.7, 1.1, 'url(#fOut)') +
    t(-12, 34, 175, 'c', 3.1, 0.2, 'url(#fOut)') +
    t(16, 28, 150, 'a', 2.5, 1.6, 'url(#fOut)') +
    // mid, accent
    t(-26, 22, 105, 'b', 1.9, 0.7, 'url(#fMid)') +
    t(26, 20, 92, 'c', 2.2, 0.1, 'url(#fMid)') +
    t(0, 26, 135, 'a', 2.0, 1.3, 'url(#fMid)') +
    // inner, warning
    t(-8, 15, 82, 'c', 1.6, 0.5, 'url(#fIn)') +
    t(12, 13, 70, 'b', 1.8, 1.0, 'url(#fIn)') +
    // core
    t(0, 9, 44, 'a', 1.4, 0.3, '#F6E7B4')
  )
}

type Spark = { x: number; dx: number; h: number; fall: number; r: number; dur: number; dl: number; c: string }

function sparks(n: number, o: { spread: number; h: [number, number]; fall: number; dur: [number, number]; r: [number, number]; seed: number; period?: number }): string {
  const r = lcg(o.seed)
  const cols = ['#F6D27A', '#E8943A', '#E3B341', '#F3A94E', '#E8943A']
  let out = ''
  for (let i = 0; i < n; i++) {
    const dur = o.dur[0] + r() * (o.dur[1] - o.dur[0])
    const sp: Spark = {
      x: (r() - 0.5) * 50,
      dx: (r() - 0.35) * o.spread,
      h: o.h[0] + r() * (o.h[1] - o.h[0]),
      fall: o.fall * (0.5 + r()),
      r: o.r[0] + r() * (o.r[1] - o.r[0]),
      dur,
      dl: r() * dur,
      c: cols[Math.floor(r() * cols.length)],
    }
    out += `<g transform="translate(${f(sp.x)} -20)"><g class="sx" style="--dx:${f(sp.dx)}px;animation-duration:${f(sp.dur)}s;animation-delay:-${f(sp.dl)}s"><circle class="sy" r="${f(sp.r)}" fill="${sp.c}" style="--h:${f(-sp.h)}px;--fall:${f(-sp.h + sp.fall)}px;animation-duration:${f(sp.dur)}s;animation-delay:-${f(sp.dl)}s"/></g></g>`
  }
  return out
}

function smoke(strength: number, n: number): string {
  const r = lcg(99)
  let o = ''
  for (let i = 0; i < n; i++) {
    const dur = 14 + r() * 8
    o += `<g transform="translate(${f(8 + (r() - 0.5) * 20)} -40)"><g class="sm" style="--sx:${f((r() - 0.2) * 90)}px;--op:${f(strength * (0.7 + r() * 0.5))};animation-duration:${f(dur)}s;animation-delay:-${f((i / n) * dur)}s"><ellipse rx="${f(20 + r() * 12)}" ry="${f(26 + r() * 14)}" fill="url(#smk)"/></g></g>`
  }
  return o
}

function plume(o: number): string {
  return `<path class="pl" opacity="${o}" fill="url(#plm)" d="M-14 -90 C-30 -170 20 -230 -6 -320 C-14 -370 20 -410 10 -460 C40 -410 50 -360 34 -310 C14 -240 52 -170 16 -90 Z"/>`
}

export function kosterScene(state: 'idle' | 'busy' | 'burst'): string {
  const idle = state === 'idle'
  const burst = state === 'burst'
  const glowR = idle ? 380 : burst ? 640 : 540
  const glowO = idle ? 0.8 : burst ? 1 : 0.9
  const flameScale = idle ? 0.25 : burst ? 1.15 : 1
  const sparkSvg = idle
    ? sparks(3, { spread: 80, h: [60, 110], fall: -20, dur: [9, 13], r: [0.8, 1.2], seed: 5 })
    : sparks(12, { spread: 90, h: [110, 220], fall: -30, dur: [4.5, 7.5], r: [0.9, 1.6], seed: 11 }) +
      (burst
        ? sparks(30, { spread: 200, h: [140, 280], fall: 100, dur: [2.2, 3.4], r: [1.2, 2.4], seed: 23 })
        : '')

  const css = `
.st{fill:#E9E2D3;opacity:.35;animation:tw 7s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.12}50%{opacity:.55}}
.glow{animation:gl ${idle ? 7 : 3.2}s ease-in-out infinite}
@keyframes gl{0%,100%{opacity:${glowO * (idle ? 0.7 : 0.82)}}50%{opacity:${glowO}}}
.fl{transform-box:fill-box;transform-origin:50% 100%;animation:fk 2.4s ease-in-out infinite}
.fl.a{--sk:-5deg}.fl.b{--sk:4deg}.fl.c{--sk:-2deg}
@keyframes fk{0%,100%{transform:scale(1,.82) skewX(var(--sk))}25%{transform:scale(.92,1.06) skewX(calc(var(--sk)*-1.2))}55%{transform:scale(1.05,.9) skewX(calc(var(--sk)*.6))}80%{transform:scale(.96,1.12) skewX(calc(var(--sk)*-.5))}}
.em{animation:eb 5.5s ease-in-out infinite}
@keyframes eb{0%,100%{opacity:${idle ? 0.55 : 0.85}}50%{opacity:1}}
.bed{animation:bd ${idle ? 6.5 : 3}s ease-in-out infinite}
@keyframes bd{0%,100%{opacity:${idle ? 0.6 : 0.85}}50%{opacity:1}}
.sx{animation:sxk linear infinite;opacity:1}
@keyframes sxk{from{transform:translateX(0)}to{transform:translateX(var(--dx))}}
.sy{animation:syk infinite;opacity:0}
@keyframes syk{0%{transform:translateY(0);opacity:0;animation-timing-function:cubic-bezier(.2,.7,.4,1)}8%{opacity:1}40%{transform:translateY(var(--h));opacity:.95;animation-timing-function:cubic-bezier(.5,0,.9,.6)}100%{transform:translateY(var(--fall));opacity:0}}
.sm{animation:smk linear infinite;opacity:0}
@keyframes smk{0%{transform:translate(0,0) scale(.6);opacity:0}15%{opacity:var(--op)}100%{transform:translate(var(--sx),-420px) scale(2.6);opacity:0}}
.ring{transform-box:fill-box;transform-origin:50% 50%;animation:rg 4s ease-out infinite;opacity:0}
@keyframes rg{0%{transform:scale(.4);opacity:.5}60%,100%{transform:scale(1.5);opacity:0}}
@media (max-aspect-ratio:1/1){.mv{transform:translate(${800 - FX}px,-110px)}.fire{transform:translate(${FX}px,${FY}px) scale(1.27)}}
.bloom{animation:bl 4s ease-out infinite;opacity:0}
@keyframes bl{0%{opacity:0}15%{opacity:1}100%{opacity:.18}}
.pl{animation:pw 9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes pw{0%,100%{transform:skewX(-4deg) scaleY(1)}50%{transform:skewX(5deg) scaleY(1.08)}}
@media (prefers-reduced-motion: reduce){*{animation:none !important}.sy,.sm{opacity:.4}}
`
  const emberBits = (() => {
    const r = lcg(3)
    let o = ''
    for (let i = 0; i < 16; i++) {
      const x = (r() - 0.5) * 110
      const y = -6 - r() * 16
      o += `<ellipse class="em" cx="${f(x)}" cy="${f(y)}" rx="${f(3 + r() * 6)}" ry="${f(1.6 + r() * 2.2)}" fill="${r() > 0.45 ? '#E8943A' : '#D9604A'}" style="animation-delay:-${f(r() * 5)}s;animation-duration:${f(3.5 + r() * 4)}s"/>`
    }
    return o
  })()

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>${css}</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171615"/><stop offset=".6" stop-color="#1B1A18"/><stop offset="1" stop-color="#241F19"/></linearGradient>
<linearGradient id="hor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4468" stop-opacity="0"/><stop offset="1" stop-color="#4A4468" stop-opacity=".34"/></linearGradient>
<linearGradient id="tree" gradientUnits="userSpaceOnUse" x1="120" y1="0" x2="760" y2="0"><stop offset="0" stop-color="#3C2618"/><stop offset=".5" stop-color="#261913"/><stop offset="1" stop-color="#1B1917"/></linearGradient>
<radialGradient id="bloom" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFD58A" stop-opacity=".95"/><stop offset=".4" stop-color="#E8943A" stop-opacity=".4"/><stop offset="1" stop-color="#E8943A" stop-opacity="0"/></radialGradient>
<linearGradient id="plm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#9A9183" stop-opacity="0"/><stop offset=".2" stop-color="#9A9183" stop-opacity=".5"/><stop offset="1" stop-color="#9A9183" stop-opacity="0"/></linearGradient>
<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#E8943A" stop-opacity=".55"/><stop offset=".35" stop-color="#C9692F" stop-opacity=".22"/><stop offset="1" stop-color="#E8943A" stop-opacity="0"/></radialGradient>
<radialGradient id="bed" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F3A94E" stop-opacity=".95"/><stop offset=".5" stop-color="#D9604A" stop-opacity=".5"/><stop offset="1" stop-color="#D9604A" stop-opacity="0"/></radialGradient>
<radialGradient id="smk" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8F8778" stop-opacity=".5"/><stop offset="1" stop-color="#8F8778" stop-opacity="0"/></radialGradient>
<linearGradient id="fOut" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#D9604A" stop-opacity=".85"/><stop offset="1" stop-color="#B8432F" stop-opacity="0"/></linearGradient>
<linearGradient id="fMid" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E8943A"/><stop offset=".8" stop-color="#E8943A" stop-opacity=".7"/><stop offset="1" stop-color="#D9604A" stop-opacity="0"/></linearGradient>
<linearGradient id="fIn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F3C45A"/><stop offset="1" stop-color="#E3B341" stop-opacity="0"/></linearGradient>
<linearGradient id="log" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2C20"/><stop offset="1" stop-color="#1E1712"/></linearGradient>
<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1A16" stop-opacity="0"/><stop offset=".5" stop-color="#1E1A16" stop-opacity=".6"/><stop offset="1" stop-color="#1B1815"/></linearGradient>
<radialGradient id="lit" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#E8943A" stop-opacity=".42"/><stop offset="1" stop-color="#E8943A" stop-opacity="0"/></radialGradient>
<linearGradient id="hor2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55507A" stop-opacity="0"/><stop offset="1" stop-color="#55507A" stop-opacity=".4"/></linearGradient>
<radialGradient id="moon" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#D0D4EC" stop-opacity=".08"/><stop offset="1" stop-color="#D0D4EC" stop-opacity="0"/></radialGradient>
<linearGradient id="stL" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#8E5C34"/><stop offset=".4" stop-color="#3A3430"/><stop offset="1" stop-color="#24222B"/></linearGradient>
<linearGradient id="stR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E5C34"/><stop offset=".4" stop-color="#3A3430"/><stop offset="1" stop-color="#1B1E2A"/></linearGradient>
<radialGradient id="coal" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F6C26A"/><stop offset=".5" stop-color="#E8943A"/><stop offset="1" stop-color="#D9604A" stop-opacity="0"/></radialGradient>
<filter id="bl6" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<rect x="0" y="560" width="1600" height="340" fill="url(#hor)"/>
<rect x="0" y="770" width="1600" height="130" fill="url(#hor2)"/>
<circle cx="1250" cy="220" r="180" fill="url(#moon)"/><circle cx="1250" cy="220" r="7" fill="#D8DBEA" opacity=".22"/>
<g>${stars()}</g>
<g fill="#2A2638" opacity=".85">${pines(61, 0.8, 12)}</g>
<g fill="url(#tree)">${pines(31, 1.5, 0)}</g>
<g class="mv"><ellipse cx="${FX}" cy="${FY - 60}" rx="${glowR}" ry="${f(glowR * 0.8)}" fill="url(#glow)" class="glow"/></g>
<rect x="0" y="790" width="1600" height="210" fill="url(#gnd)"/>
${burst ? `<g class="mv"><ellipse class="bloom" cx="${FX}" cy="${FY - 90}" rx="560" ry="460" fill="url(#bloom)"/></g>` : ''}
<g class="mv"><ellipse cx="${FX}" cy="${FY + 20}" rx="${f(glowR * 0.95)}" ry="${f(glowR * 0.16)}" fill="url(#lit)" class="glow"/>
<g class="fire" transform="translate(${FX} ${FY}) scale(2.2)">
<g class="bed"><ellipse cx="0" cy="-4" rx="${idle ? 100 : 125}" ry="${idle ? 26 : 34}" fill="url(#bed)"/></g>
<g transform="scale(.6)" filter="url(#bl6)">${plume(idle ? 0.1 : 0.14)}</g>
<g>${flames(flameScale)}</g>
<!-- stones -->
<g><ellipse cx="-112" cy="-4" rx="26" ry="14" fill="url(#stL)"/><ellipse cx="-70" cy="10" rx="22" ry="12" fill="url(#stL)"/><ellipse cx="-20" cy="16" rx="24" ry="12" fill="url(#stL)"/><ellipse cx="34" cy="16" rx="23" ry="12" fill="url(#stR)"/><ellipse cx="82" cy="10" rx="22" ry="12" fill="url(#stR)"/><ellipse cx="116" cy="-4" rx="26" ry="14" fill="url(#stR)"/></g>
<g fill="#F3A94E" opacity="${idle ? 0.14 : 0.3}"><ellipse cx="-104" cy="-11.700000000000001" rx="11.700000000000001" ry="3"/><ellipse cx="-62" cy="3.3999999999999995" rx="9.9" ry="3"/><ellipse cx="-12" cy="9.399999999999999" rx="10.8" ry="3"/><ellipse cx="26" cy="9.399999999999999" rx="10.35" ry="3"/><ellipse cx="74" cy="3.3999999999999995" rx="9.9" ry="3"/><ellipse cx="108" cy="-11.700000000000001" rx="11.700000000000001" ry="3"/></g>
<!-- logs -->
<g>
${[-9, 10].map((r) => `<g transform="rotate(${r})"><rect x="-84" y="-18" width="170" height="20" rx="9" fill="url(#log)"/><rect x="-74" y="-17" width="150" height="3.5" rx="1.7" fill="#7A5A3E" opacity=".45"/><ellipse class="em" cx="-80" cy="-8" rx="6" ry="9" fill="url(#coal)" opacity="${idle ? 0.7 : 1}"/><ellipse class="em" cx="82" cy="-8" rx="6" ry="9" fill="url(#coal)" style="animation-delay:-2s" opacity="${idle ? 0.7 : 1}"/></g>`).join('')}
</g>
<g>${sparkSvg}</g>
</g>
</g>
</svg>`
}