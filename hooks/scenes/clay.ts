// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc

type P = [number, number]

let seed = 7
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)

const f = (n: number) => Math.round(n * 10) / 10

function spline(p: P[], closed: boolean): string {
  const n = p.length
  const at = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))])
  let d = `M${f(p[0][0])} ${f(p[0][1])}`
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const a = at(i - 1), b = at(i), c = at(i + 1), e = at(i + 2)
    d += `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`
  }
  return d + (closed ? 'Z' : '')
}

function stone(cx: number, cy: number, rx: number, ry: number, s: number): string {
  seed = s
  const pts: P[] = []
  const n = 10
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const w = 1 + (rnd() - 0.5) * 0.14
    let y = Math.sin(a) * ry * w
    if (y > 0) y *= 0.86
    pts.push([cx + Math.cos(a) * rx * w, cy + y])
  }
  return spline(pts, true)
}

function loop(cx: number, cy: number, rx: number, ry: number, s: number, tilt: number): string {
  const pts: P[] = []
  const n = 20
  for (let i = 0; i < n; i++) {
    const a = Math.PI / 2 + (i / n) * Math.PI * 2
    const k = 1 + Math.sin(2 * a + s) * 0.03 + Math.sin(3 * a + 2 * s) * 0.02
    const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k
    pts.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)])
  }
  return spline(pts, true)
}

interface Stone { id: string; cx: number; cy: number; rx: number; ry: number; seed: number; kind: 't' | 's' | 'd' }

const LEFT: Stone[] = [
  { id: 'a', cx: 250, cy: 790, rx: 205, ry: 140, seed: 11, kind: 't' },
  { id: 'b', cx: 268, cy: 628, rx: 148, ry: 104, seed: 23, kind: 's' },
  { id: 'c', cx: 248, cy: 494, rx: 98, ry: 76, seed: 37, kind: 'd' },
]
const RIGHT: Stone[] = [
  { id: 'd', cx: 1370, cy: 845, rx: 165, ry: 100, seed: 51, kind: 's' },
  { id: 'e', cx: 1350, cy: 735, rx: 78, ry: 56, seed: 64, kind: 't' },
]

function body(s: Stone): string {
  const d = stone(s.cx, s.cy, s.rx, s.ry, s.seed)
  const hx = f(s.cx + s.rx * 0.34), hy = f(s.cy - s.ry * 0.5)
  return `<clipPath id="c${s.id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#g${s.kind})"/>` +
    `<path d="${d}" fill="url(#sh)"/>` +
    `<path d="${d}" fill="url(#core)"/>` +
    `<path d="${d}" fill="url(#warm)" class="warm"/>` +
    `<path d="${d}" fill="url(#spec)"/>` +
    `<path d="${d}" fill="none" stroke="url(#bev)" stroke-width="22" clip-path="url(#c${s.id})" filter="url(#soft2)"/>` +
    `<ellipse cx="${hx}" cy="${hy}" rx="${f(s.rx * 0.2)}" ry="${f(s.ry * 0.1)}" transform="rotate(-24 ${hx} ${hy})" class="gloss" clip-path="url(#c${s.id})" filter="url(#blur5)"/>` +
    `<path d="${d}" fill="#000" filter="url(#grain)" opacity=".3"/>` +
    `<path d="${d}" fill="#fff" filter="url(#grain2)" opacity=".16"/>` +
    `<path d="${d}" fill="none" stroke="url(#rim)" stroke-width="6" filter="url(#soft2)" opacity=".9"/>` +
    `<path d="${d}" fill="none" stroke="url(#rim)" stroke-width="2" opacity=".9"/>`
}

function shadows(list: Stone[], long: number): string {
  let o = ''
  for (const s of list) {
    const ground = s.id === 'a' || s.id === 'd'
    if (ground) {
      o += `<ellipse cx="${f(s.cx - s.rx * 0.55)}" cy="${f(s.cy + s.ry * 0.86)}" rx="${f(s.rx * long)}" ry="${f(s.ry * 0.28)}" class="cast" filter="url(#blur18)"/>`
      o += `<ellipse cx="${f(s.cx)}" cy="${f(s.cy + s.ry * 0.88)}" rx="${f(s.rx * 0.85)}" ry="${f(s.ry * 0.1)}" class="contact" filter="url(#blur5)"/>`
    } else {
      o += `<ellipse cx="${f(s.cx - s.rx * 0.2)}" cy="${f(s.cy + s.ry * 0.85)}" rx="${f(s.rx * 0.9)}" ry="${f(s.ry * 0.2)}" class="contact" filter="url(#blur8)" opacity="1"/>`
    }
  }
  return o
}

function ink(cx: number, cy: number, rx: number, ry: number, s: number, tilt: number): string {
  const d = loop(cx, cy, rx, ry, s, tilt)
  return `<path class="base" d="${d}"/>` + `<path class="ink glow" pathLength="100" d="${d}" filter="url(#soft2)"/>` +
    `<path class="ink line" pathLength="100" d="${d}"/>` +
    `<g class="head" style="offset-path:path('${d}')"><circle r="16" fill="url(#headG)"/><circle r="4.2" class="dot"/></g>`
}

export function clayScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  const breathe = busy ? 5 : 14
  const inkSecs = busy ? 8 : 40
  const motes = (() => {
    seed = 99
    let o = ''
    const count = busy ? 18 : 8
    for (let i = 0; i < count; i++) {
      const x = 100 + rnd() * 1400, y = 300 + rnd() * 600, r = 1.4 + rnd() * 2.4
      o += `<circle class="mote" style="animation-duration:${f((busy ? 7 : 16) + rnd() * 6)}s;animation-delay:-${f(rnd() * 16)}s" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`
    }
    return o
  })()

  const stop = (o: string, c: string) => `<stop offset="${o}" class="${c}"/>`
  const grad = (k: string, c: string) =>
    `<radialGradient id="g${k}" cx=".62" cy=".4" r=".78" fx=".74" fy=".2">${stop('0', c + '0')}${stop('.38', c + '1')}${stop('.78', c + '2')}${stop('1', c + '3')}</radialGradient>`
  const A = busy ? 1 : 0

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
:root{--w0:#d9d2c6;--w1:#e4ddd1;--f0:#d6cdbf;--f1:#bdb2a2;--sun:#ffc88c;--shade:#4a2a1a;--shadeA:.55;--ink:#4a3a30;--inkB:#d4491f;--inkL:#c9663f;--spotK:1;--sw0:#d98a5a;--sw1:#4a4038;--swA:.34;--mote:#fff1d6;--vig:#5a4a3c;--vigA:.42;
--t0:#f4a674;--t1:#dc6a3c;--t2:#b04a28;--t3:#7e2f1b;
--s0:#f6cda4;--s1:#e5a574;--s2:#c27a4c;--s3:#8c5230;
--d0:#d0693c;--d1:#aa4b28;--d2:#7e341c;--d3:#55220f;
--rim:#fff0d2;--bounce:#f0a070}
@media (prefers-color-scheme: dark){:root{--w0:#1b1a19;--w1:#242220;--f0:#201e1c;--f1:#131211;--sun:#ff9650;--shade:#050403;--shadeA:.75;--ink:#d9c3b0;--inkB:#ffb070;--inkL:#e0a070;--spotK:.7;--sw0:#a35a32;--sw1:#000;--swA:.3;--mote:#ffc489;--vig:#000;--vigA:.5;
--t0:#f09a68;--t1:#c0603a;--t2:#80391f;--t3:#4a2013;
--s0:#e0ad84;--s1:#ae7a50;--s2:#704730;--s3:#412718;
--d0:#b2603a;--d1:#7e3f25;--d2:#4d2415;--d3:#2c140b;
--rim:#ffb878;--bounce:#8a4a2c}}
.w0{stop-color:var(--w0)}.w1{stop-color:var(--w1)}.f0{stop-color:var(--f0)}.f1{stop-color:var(--f1)}
.t0{stop-color:var(--t0)}.t1{stop-color:var(--t1)}.t2{stop-color:var(--t2)}.t3{stop-color:var(--t3)}
.s0{stop-color:var(--s0)}.s1{stop-color:var(--s1)}.s2{stop-color:var(--s2)}.s3{stop-color:var(--s3)}
.d0{stop-color:var(--d0)}.d1{stop-color:var(--d1)}.d2{stop-color:var(--d2)}.d3{stop-color:var(--d3)}
.sw0{stop-color:var(--sw0)}.sw1{stop-color:var(--sw1)}.sunc{stop-color:var(--sun)}.shc{stop-color:var(--shade)}.rimc{stop-color:var(--rim)}.vigc{stop-color:var(--vig)}.bnc{stop-color:var(--bounce)}.inkc{stop-color:var(--inkB)}
.cast{fill:var(--shade);opacity:calc(var(--shadeA) * .55)}
.contact{fill:var(--shade);opacity:var(--shadeA)}
.gloss{fill:#fff8e8;opacity:.75}
.cnt{font:500 18px -apple-system,'Helvetica Neue',Arial,sans-serif;fill:var(--ink);text-anchor:middle}
.mote{fill:var(--mote);opacity:0;animation:mote 12s ease-in-out infinite}
.ink{fill:none;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;opacity:0;animation:ink ${inkSecs}s ease-in-out infinite}
.base{fill:none;stroke:var(--ink);stroke-width:2;opacity:.28}
.ink.line{stroke:${busy ? 'var(--inkL)' : 'var(--ink)'};stroke-width:${busy ? 3 : 2}}
.ink.glow{stroke:var(--inkB);stroke-width:${busy ? 10 : 6};animation-name:inkg}
.head{offset-rotate:0deg;offset-distance:0%;opacity:0;animation:head ${inkSecs}s ease-in-out infinite}
.dot{fill:${busy ? '#fff4e0' : 'var(--inkB)'}}
.spot{animation:breathe ${breathe}s ease-in-out infinite}
.warm{opacity:${busy ? 0.55 : 0.12};animation:warm ${breathe}s ease-in-out infinite}
@keyframes breathe{0%,100%{opacity:${busy ? 0.78 : 0.72}}50%{opacity:1}}
@keyframes warm{0%,100%{opacity:${busy ? 0.4 : 0.08}}50%{opacity:${busy ? 0.75 : 0.2}}}
@keyframes ink{0%{stroke-dashoffset:100;opacity:0}4%{opacity:.95}72%{stroke-dashoffset:0;opacity:.95}90%{stroke-dashoffset:0;opacity:.95}100%{stroke-dashoffset:0;opacity:0}}
@keyframes inkg{0%{stroke-dashoffset:100;opacity:0}4%{opacity:${busy ? 0.5 : 0.18}}72%{stroke-dashoffset:0;opacity:${busy ? 0.5 : 0.18}}90%{stroke-dashoffset:0;opacity:${busy ? 0.5 : 0.18}}100%{stroke-dashoffset:0;opacity:0}}
@keyframes head{0%{offset-distance:0%;opacity:0}4%{opacity:1}72%{offset-distance:100%;opacity:1}78%{offset-distance:100%;opacity:0}100%{offset-distance:100%;opacity:0}}
@keyframes mote{0%,100%{opacity:0;transform:translate(0,0)}30%{opacity:${busy ? 0.75 : 0.45}}60%{opacity:${busy ? 0.55 : 0.3};transform:translate(-16px,-26px)}}
@media (max-aspect-ratio:1/1){
 .gl{transform:translate(580px,-130px) scale(.88)}
 .gr{display:none}
}
@media (prefers-reduced-motion: reduce){*{animation:none !important}.ink.line{opacity:.95;stroke-dashoffset:0}}
</style>
<defs>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">${stop('0', 'w0')}${stop('.6', 'w1')}${stop('.68', 'f0')}${stop('1', 'f1')}</linearGradient>
<linearGradient id="sweep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="sw0" stop-opacity="1"/><stop offset=".5" class="sw0" stop-opacity=".12"/><stop offset="1" class="sw1" stop-opacity=".85"/></linearGradient>
<radialGradient id="spotG" cx=".5" cy=".5" r=".5"><stop offset="0" class="sunc" stop-opacity=".85"/><stop offset=".35" class="sunc" stop-opacity=".45"/><stop offset=".7" class="sunc" stop-opacity=".12"/><stop offset="1" class="sunc" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".5" class="vigc" stop-opacity="0"/><stop offset="1" class="vigc" stop-opacity="1"/></radialGradient>
<radialGradient id="headG" cx=".5" cy=".5" r=".5"><stop offset="0" class="inkc" stop-opacity=".95"/><stop offset="1" class="inkc" stop-opacity="0"/></radialGradient>
<radialGradient id="warm" cx=".7" cy=".3" r=".8"><stop offset="0" class="inkc" stop-opacity=".9"/><stop offset="1" class="inkc" stop-opacity="0"/></radialGradient>
${grad('t', 't')}${grad('s', 's')}${grad('d', 'd')}
<linearGradient id="sh" x1="1" y1="0" x2="0" y2="1"><stop offset=".3" class="shc" stop-opacity="0"/><stop offset="1" class="shc" stop-opacity=".72"/></linearGradient>
<radialGradient id="core" cx=".2" cy=".92" r=".55"><stop offset="0" class="bnc" stop-opacity=".5"/><stop offset="1" class="bnc" stop-opacity="0"/></radialGradient>
<linearGradient id="bev" x1="1" y1="0" x2="0" y2="1"><stop offset="0" class="rimc" stop-opacity=".55"/><stop offset=".45" class="rimc" stop-opacity="0"/><stop offset=".6" class="shc" stop-opacity="0"/><stop offset="1" class="shc" stop-opacity=".85"/></linearGradient>
<filter id="grain2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="12" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -3 1.5" result="a"/><feComposite in="a" in2="SourceAlpha" operator="in"/></filter>
<radialGradient id="spec" cx=".7" cy=".24" r=".26"><stop offset="0" class="rimc" stop-opacity=".65"/><stop offset="1" class="rimc" stop-opacity="0"/></radialGradient>
<linearGradient id="rim" x1="1" y1="0" x2="0" y2="1"><stop offset="0" class="rimc" stop-opacity=".95"/><stop offset=".38" class="rimc" stop-opacity=".25"/><stop offset=".6" class="rimc" stop-opacity="0"/></linearGradient>
<filter id="blur18" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="blur8" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur5" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="soft2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 .85" result="a"/><feComposite in="a" in2="SourceAlpha" operator="in"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .12  0 0 0 -1.6 1.0"/></filter>
</defs>
<rect width="1600" height="1000" fill="url(#wall)"/>
<rect width="1600" height="1000" fill="url(#sweep)" opacity="var(--swA)"/>
<g class="gl" transform="translate(85 0) scale(.9)"><g style="opacity:var(--spotK)"><ellipse class="spot" cx="330" cy="620" rx="640" ry="620" fill="url(#spotG)"/></g>${shadows(LEFT, 1.4)}${ink(255, 660, 238, 310, 5, 0.04)}${LEFT.map(body).join('')}<text class="cnt" x="250" y="1018">${busy ? '3 из 5' : '5 из 5'}</text></g>
<g class="gr" transform="translate(-430 -234) scale(1.25)"><ellipse class="spot" cx="1400" cy="760" rx="520" ry="400" fill="url(#spotG)"/>${shadows(RIGHT, 1.7)}${ink(1368, 790, 195, 150, 13, -0.05)}${RIGHT.map(body).join('')}</g>
<g>${motes}</g>
<rect width="1600" height="1000" fill="url(#vig)" opacity="var(--vigA)"/>
<rect width="1600" height="1000" filter="url(#paper)" opacity=".1" style="mix-blend-mode:multiply"/>
</svg>`
}
