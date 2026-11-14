// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Dark side: deep black-red space, a varied drifting starfield, violet-red nebulae. A tall hooded figure stands
// at the left edge in silhouette, seen from behind, holding one straight red energy blade pointed down.
// idle: steady dim blade, small bloom. busy: bright blade, wide bloom and floor pool, slow pulse, rising embers.
// Portrait screens slide the figure into view. Original art, pure string building, deterministic.

function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}
const f = (n: number) => Math.round(n * 10) / 10

export function darkSideScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  const r = lcg(7311)

  // stars: varied size and brightness, none in the centre panel zone
  let stars = ''
  let n = 0
  while (n < 120) {
    const x = r() * 1600
    const y = r() * 800
    if (x > 440 && x < 1160) continue
    n++
    const p = r()
    const sz = p > 0.985 ? 2.6 + r() * 0.9 : p > 0.94 ? 1.7 + r() * 0.6 : p > 0.75 ? 0.9 + r() * 0.4 : 0.25 + r() * 0.4
    const o = p > 0.94 ? 0.95 : 0.18 + r() * 0.6
    const col = n % 6 === 0 ? '#ffa0ae' : n % 7 === 0 ? '#b9c4ff' : '#d3dbef'
    const tw = n % 7 === 0 ? ` class="tw" style="animation-delay:-${f(r() * 9)}s"` : ''
    if (p > 0.94) stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(sz * 2.6)}" fill="${col}" opacity=".07"/>`
    stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(sz)}" fill="${col}" opacity="${f(o * 100) / 100}"${tw}/>`
  }

  let embers = ''
  if (busy) {
    for (let i = 0; i < 20; i++) {
      const x = 368 + (r() - 0.5) * 80
      const y = 640 + r() * 190
      const dx = (r() - 0.3) * 90
      const dy = -(200 + r() * 300)
      const dur = 6 + r() * 6
      embers += `<circle class="em" cx="${f(x)}" cy="${f(y)}" r="${f(1 + r() * 1.6)}" fill="${i % 3 ? '#ff6a5a' : '#ffb59a'}" style="--dx:${f(dx)}px;--dy:${f(dy)}px;animation-duration:${f(dur)}s;animation-delay:-${f(r() * dur)}s"/>`
    }
  }

  const cls = busy ? 'pu' : ''
  const rim = busy ? 0.95 : 0.55
  // soft cloak: smooth curves, scalloped hem, hood with a shadowed opening shoulder
  const cloak =
    'M215,288 C242,288 268,318 274,372 C278,402 294,420 314,444 C338,484 358,540 372,588 L360,600 C346,590 332,572 320,556 C318,640 330,740 352,826 C340,836 326,826 312,832 C298,840 284,826 268,832 C252,840 238,826 222,833 C206,840 190,826 174,832 C158,838 144,826 128,832 C112,838 100,828 92,824 C100,700 112,600 128,500 C138,450 166,420 174,388 C178,376 170,368 170,358 C176,320 190,288 215,288 Z'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
.fig{transform-origin:230px 830px;transform:translate(50px,0) scale(1.4)}
@media (max-aspect-ratio: 1/1){.fig{transform:translate(500px,0) scale(1)}}
.dr{animation:dr 48s ease-in-out infinite alternate}
@keyframes dr{from{transform:translate(0,0)}to{transform:translate(-34px,10px)}}
.tw{animation:tw 7s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.2}50%{opacity:.9}}
.neb{animation:neb 30s ease-in-out infinite alternate}
@keyframes neb{from{opacity:.75}to{opacity:1}}
.pu{animation:pu 5s ease-in-out infinite}
@keyframes pu{0%,100%{opacity:1}50%{opacity:.82}}
.em{animation-name:em;animation-timing-function:ease-out;animation-iteration-count:infinite;opacity:0}
@keyframes em{0%{opacity:0;transform:translate(0,0)}12%{opacity:.85}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@media (prefers-reduced-motion: reduce) { * { animation: none !important } }
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07080d"/><stop offset=".7" stop-color="#0c0a12"/><stop offset="1" stop-color="#17090f"/></linearGradient>
<radialGradient id="n1" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8a1a3a" stop-opacity=".5"/><stop offset=".55" stop-color="#5a1050" stop-opacity=".24"/><stop offset="1" stop-color="#5a1050" stop-opacity="0"/></radialGradient>
<radialGradient id="n2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7a1760" stop-opacity=".42"/><stop offset=".6" stop-color="#4a1048" stop-opacity=".16"/><stop offset="1" stop-color="#4a1048" stop-opacity="0"/></radialGradient>
<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0a10" stop-opacity="0"/><stop offset=".3" stop-color="#0d0b12" stop-opacity=".85"/><stop offset="1" stop-color="#050509"/></linearGradient>
<radialGradient id="fl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff3a4a" stop-opacity=".8"/><stop offset=".45" stop-color="#c01e36" stop-opacity=".34"/><stop offset="1" stop-color="#7a1228" stop-opacity="0"/></radialGradient>
<radialGradient id="aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff3a4a" stop-opacity=".38"/><stop offset="1" stop-color="#ff3a4a" stop-opacity="0"/></radialGradient>
<linearGradient id="cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0c15"/><stop offset=".5" stop-color="#090b12"/><stop offset="1" stop-color="#1a0c14"/></linearGradient>
<linearGradient id="lw" x1="92" y1="0" x2="372" y2="0" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#8a1228" stop-opacity="0"/><stop offset="1" stop-color="#8a1228" stop-opacity=".34"/></linearGradient>
<radialGradient id="lh" cx="352" cy="826" r="190" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a01a30" stop-opacity=".4"/><stop offset="1" stop-color="#a01a30" stop-opacity="0"/></radialGradient>
<clipPath id="cc"><path d="${cloak}"/></clipPath>
<linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0a11" stop-opacity="0"/><stop offset="1" stop-color="#2a0e18" stop-opacity=".85"/></linearGradient>
<linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff4a5a" stop-opacity=".55"/><stop offset="1" stop-color="#ff4a5a" stop-opacity="0"/></linearGradient>
<linearGradient id="mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="rm" maskUnits="userSpaceOnUse" x="0" y="826" width="600" height="200"><rect x="0" y="826" width="600" height="170" fill="url(#mf)"/></mask>
<filter id="b3" x="-100%" y="-20%" width="300%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b9" x="-300%" y="-20%" width="700%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b24" x="-100%" y="-400%" width="300%" height="900%"><feGaussianBlur stdDeviation="24"/></filter>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<g class="neb"><ellipse cx="1400" cy="360" rx="330" ry="560" fill="url(#n2)" transform="rotate(20 1400 360)"/><ellipse cx="1400" cy="340" rx="190" ry="470" fill="url(#n1)" transform="rotate(20 1400 340)"/><ellipse cx="240" cy="130" rx="380" ry="190" fill="url(#n2)" opacity=".55"/></g>
<g class="dr">${stars}</g>
<rect y="770" width="1600" height="230" fill="url(#gnd)"/>
<ellipse cx="560" cy="840" rx="900" ry="30" fill="#2a0e1c" opacity=".35" filter="url(#b24)"/>
<g class="fig">
<ellipse cx="368" cy="${busy ? 640 : 710}" rx="${busy ? 210 : 85}" ry="${busy ? 320 : 170}" fill="url(#aura)" class="${cls}"/>
<ellipse cx="368" cy="830" rx="${busy ? 300 : 150}" ry="${busy ? 44 : 22}" fill="url(#fl)" filter="url(#b24)" class="${cls}"/>
<ellipse cx="368" cy="832" rx="${busy ? 110 : 55}" ry="${busy ? 20 : 10}" fill="#ff6a70" opacity="${busy ? 0.45 : 0.28}" filter="url(#b24)" class="${cls}"/>
<ellipse cx="520" cy="842" rx="${busy ? 330 : 120}" ry="${busy ? 20 : 8}" fill="#ff3a4a" opacity="${busy ? 0.3 : 0.12}" filter="url(#b24)" class="${cls}"/>
<g mask="url(#rm)" opacity=".5"><g transform="translate(0,1660) scale(1,-1)" filter="url(#b3)"><path d="${cloak}" fill="#2a0e1c"/><rect x="361" y="632" width="14" height="190" fill="#ff3347" opacity=".6"/></g></g>
<path d="${cloak}" fill="url(#cl)"/>
<path d="${cloak}" fill="url(#lw)" class="${cls}" opacity="${busy ? 1 : 0.6}"/>
<path d="${cloak}" fill="url(#lh)" class="${cls}" opacity="${busy ? 1 : 0.6}"/>
<g fill="none" stroke="#141826" stroke-width="2.2" stroke-linecap="round" opacity=".95"><path d="M212,330 C196,440 214,620 172,830"/><path d="M240,420 C226,560 262,700 262,832"/><path d="M148,480 C132,610 150,730 126,832"/><path d="M290,470 C282,600 316,720 312,832"/></g>
<g class="${cls}">
<g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${rim}">
<path d="M243,291 C264,312 273,345 276,375 C280,402 294,420 314,444 C338,484 356,540 371,586" stroke="#ff3a4a" stroke-width="8" filter="url(#b3)" opacity=".7"/>
<path d="M243,291 C264,312 273,345 276,375 C280,402 294,420 314,444 C338,484 356,540 371,586" stroke="#ff8a8c" stroke-width="1.8"/>
<path d="M320,558 C318,640 330,740 352,826" stroke="#ff3a4a" stroke-width="7" filter="url(#b3)" opacity=".6"/>
<path d="M320,558 C318,640 330,740 352,826" stroke="#ff7a80" stroke-width="1.5"/>
<path d="M352,826 C340,836 326,826 312,832 C298,840 284,826 268,832" stroke="#ff4a58" stroke-width="2.6" filter="url(#b2)" opacity=".5"/>
</g></g>
<path d="M215,288 C190,288 176,320 170,358 C170,368 178,376 174,388 C166,420 138,450 128,500 C112,600 100,700 92,824" fill="none" stroke="#7a62d0" stroke-width="5" opacity=".28" stroke-linecap="round" filter="url(#b3)"/>
<path d="M215,288 C190,288 176,320 170,358 C170,368 178,376 174,388 C166,420 138,450 128,500 C112,600 100,700 92,824" fill="none" stroke="#9a86e6" stroke-width="1.6" opacity=".5" stroke-linecap="round"/>
<rect x="80" y="790" width="300" height="48" fill="url(#hf)" clip-path="url(#cc)"/>
<circle cx="368" cy="595" r="9" fill="#06070b"/>
<rect x="363" y="598" width="10" height="34" rx="2" fill="#0a0c12" stroke="#2a2f3c" stroke-width="1"/>
<rect x="361" y="630" width="14" height="5" rx="1.5" fill="#12151d" stroke="#3a2a34" stroke-width=".8"/>
<g class="${cls}">
<rect x="${busy ? 346 : 352}" y="632" width="${busy ? 44 : 32}" height="192" rx="${busy ? 22 : 16}" fill="#ff2a40" opacity="${busy ? 0.55 : 0.42}" filter="url(#b9)"/>
<rect x="358" y="632" width="20" height="190" rx="10" fill="#ff3347" opacity="${busy ? 0.8 : 0.55}" filter="url(#b3)"/>
<rect x="364" y="634" width="8" height="186" rx="4" fill="${busy ? '#ff5a64' : '#d8404e'}"/>
<rect x="366.4" y="636" width="3.2" height="182" rx="1.6" fill="${busy ? '#ffe3de' : '#ffb3b0'}"/>
</g>
${embers}
</g>
</svg>`
}
