// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// glyph-kit: shared engine for the Glyph family of backdrops (objects built from shaded character tiles).
// Pure TS, no imports, deterministic. API is documented in docs/GLYPH-KIT.md.

export type Pt = [number, number]
export interface Grid { w: number; h: number; s: Float32Array; g: Uint8Array } // s < 0 = empty cell

const n1 = (v: number) => String(Math.round(v * 10) / 10)
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

// ---- per-frame() registry (reset when frame() returns, so output is deterministic per call) ----
let css: string[] = [], cssDark: string[] = [], defs: string[] = [], uid = 0, seen = new Set<string>()
const once = (k: string, f: () => void) => { if (!seen.has(k)) { seen.add(k); f() } }

// ---- colour ----
export function mix(a: string, b: string, t: number): string {
  const p = (s: string) => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16))
  const A = p(a), B = p(b)
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

export interface Scheme { lo: string; hi: string; ink: string; k?: number }
/** Register a material: 4 colour steps (0 shadow .. 3 highlight) for light and dark.
 *  Classes: `${id}${q}` (tile fill) and `${id}t${q}` (character fill). */
export function mat(id: string, L: Scheme, D: Scheme): string {
  for (const [S, out] of [[L, css], [D, cssDark]] as [Scheme, string[]][]) {
    if (out === cssDark && JSON.stringify(L) === JSON.stringify(D)) continue
    for (let q = 0; q < 4; q++) {
      const bg = mix(S.lo, S.hi, q / 3), fg = mix(bg, S.ink, S.k ?? 0.42)
      out.push(`.${id}${q}{color:${bg}}.${id}t${q}{fill:${fg}}`)
    }
  }
  return id
}

// ---- rasterizer ----
export interface ShapeOpt {
  b?: number // albedo 0..1 (default .7)
  g?: number // colour group (index into tiles() mats)
  rim?: number // rim light on the side away from the light, 0..1
  ao?: number // ambient occlusion: darken earlier cells within this many cells of the shape
  cyl?: 'x' | 'y' | [number, number] // polygon/rect: cylinder across x or y, or [axis, halfWidth] in cells
  fx?: (x: number, y: number, s: number) => number // per-cell shade tweak (cell coordinates)
}
export interface Shape { t: 'e' | 'p' | 'l'; d: number[]; w?: number; o: ShapeOpt }
export const ell = (cx: number, cy: number, rx: number, ry: number, o: ShapeOpt = {}): Shape => ({ t: 'e', d: [cx, cy, rx, ry], o })
export const poly = (pts: Pt[], o: ShapeOpt = {}): Shape => ({ t: 'p', d: pts.flat(), o })
export const rect = (x: number, y: number, w: number, h: number, o: ShapeOpt = {}): Shape => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o)
export const line = (pts: Pt[], w: number, o: ShapeOpt = {}): Shape => ({ t: 'l', d: pts.flat(), w, o })

export function grid(w: number, h: number): Grid {
  return { w, h, s: new Float32Array(w * h).fill(-1), g: new Uint8Array(w * h) }
}

type Nrm = [number, number, number] | null
function coverage(sh: Shape): (x: number, y: number) => Nrm {
  const d = sh.d
  if (sh.t === 'e') {
    const [cx, cy, rx, ry] = d
    return (x, y) => {
      const nx = (x - cx) / rx, ny = (y - cy) / ry, r2 = nx * nx + ny * ny
      return r2 > 1 ? null : [nx, ny, Math.sqrt(1 - r2)]
    }
  }
  if (sh.t === 'p') {
    const k = d.length / 2
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9
    for (let i = 0; i < k; i++) { x0 = Math.min(x0, d[2 * i]); x1 = Math.max(x1, d[2 * i]); y0 = Math.min(y0, d[2 * i + 1]); y1 = Math.max(y1, d[2 * i + 1]) }
    const cyl = sh.o.cyl
    const ax: [number, number] = Array.isArray(cyl) ? cyl : cyl === 'y' ? [(y0 + y1) / 2, (y1 - y0) / 2] : [(x0 + x1) / 2, (x1 - x0) / 2]
    return (x, y) => {
      let inside = false
      for (let i = 0, j = k - 1; i < k; j = i++) {
        const xi = d[2 * i], yi = d[2 * i + 1], xj = d[2 * j], yj = d[2 * j + 1]
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
      }
      if (!inside) return null
      if (!cyl) return [0, 0, 1]
      const u = Math.max(-1, Math.min(1, ((cyl === 'y' ? y : x) - ax[0]) / ax[1]))
      const z = Math.sqrt(1 - u * u)
      return cyl === 'y' ? [0, u, z] : [u, 0, z]
    }
  }
  const half = Math.max((sh.w ?? 1) / 2, 0.6), k = d.length / 2
  return (x, y) => {
    let best = 1e9, bx = 0, by = 0
    for (let i = 0; i < k - 1; i++) {
      const ax = d[2 * i], ay = d[2 * i + 1], dx = d[2 * i + 2] - ax, dy = d[2 * i + 3] - ay
      const L = dx * dx + dy * dy || 1
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L))
      const px = ax + dx * t, py = ay + dy * t, dd = Math.hypot(x - px, y - py)
      if (dd < best) { best = dd; bx = x - px; by = y - py }
    }
    if (best > half) return null
    const u = best / half, z = Math.sqrt(1 - u * u)
    return [(bx / (best || 1)) * u, (by / (best || 1)) * u, z]
  }
}

/** Rasterize layered shapes (painter order) into a grid of shades. Light is [lx, ly] pointing TO the light
 *  (e.g. [-.7,-.5] = from upper left). */
export function raster(w: number, h: number, shapes: Shape[], o: { light?: Pt; amb?: number; gain?: number; into?: Grid } = {}): Grid {
  const G = o.into ?? grid(w, h), amb = o.amb ?? 0.22, gain = o.gain ?? 1.2
  const lx0 = o.light?.[0] ?? -0.6, ly0 = o.light?.[1] ?? -0.6, lz0 = 0.7
  const ll = Math.hypot(lx0, ly0, lz0), lx = lx0 / ll, ly = ly0 / ll, lz = lz0 / ll
  const lxy = Math.hypot(lx, ly) || 1
  for (const sh of shapes) {
    const cov = coverage(sh), b = sh.o.b ?? 0.7, g = sh.o.g ?? 0, rim = sh.o.rim ?? 0
    const prev = G.s.slice(), mask = new Uint8Array(w * h)
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const nr = cov(x + 0.5, y + 0.5)
      if (!nr) continue
      const i = y * w + x
      mask[i] = 1
      const lam = Math.max(0, nr[0] * lx + nr[1] * ly + nr[2] * lz)
      let s = (amb + (1 - amb) * lam) * (0.3 + 0.7 * b) * gain
      if (rim) s += rim * Math.pow(1 - nr[2], 2) * (0.35 + Math.max(0, -(nr[0] * lx + nr[1] * ly) / lxy))
      if (sh.o.fx) s = sh.o.fx(x, y, s)
      G.s[i] = Math.max(0, Math.min(1, s))
      G.g[i] = g
    }
    const ao = sh.o.ao ?? 0
    if (ao) {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y * w + x
        if (mask[i] || prev[i] < 0) continue
        let hit = 0
        for (let a = 0; a < 8 && !hit; a++) {
          const ca = Math.cos(a * Math.PI / 4), sa = Math.sin(a * Math.PI / 4)
          for (let d = 1; d <= ao; d++) if (cov(x + 0.5 + ca * d, y + 0.5 + sa * d)) { hit = d; break }
        }
        if (hit) G.s[i] *= 1 - 0.4 * (1 - (hit - 1) / ao)
      }
    }
  }
  return G
}

// ---- tile renderer ----
export interface TileOpt {
  c: number // cell px (8 far, 12 mid, 16 near)
  x: number; y: number // px origin of the grid
  mats: string[] // material id per colour group
  ramp?: string // darkest..lightest characters (default ' .:-=+*#%@'; a space draws the tile only)
  dur?: number; delay?: number // pose frame loop seconds (whole loop) and start offset (negative = already running)
  seq?: number[] // frame order per step, e.g. [0,1,2,1]; default 0..n-1
  shimmer?: number // number of tiles that cross-fade to a neighbouring ramp character
  seed?: number
  op?: number // group opacity
}

function frameCss(seq: number[]): string {
  const key = seq.join('x'), L = seq.length
  once('fr' + key, () => {
    for (const f of new Set(seq)) {
      const kf = Array.from({ length: L }, (_, k) => `${n1(Math.round(k * 10000 / L) / 100)}%{opacity:${seq[k] === f ? 1 : 0}}`).join('')
      css.push(`@keyframes q${key}_${f}{${kf}}.q${key}_${f}{opacity:${seq[0] === f ? 1 : 0};animation:q${key}_${f} var(--d,1s) steps(1,end) var(--dl,0s) infinite}`)
    }
  })
  return key
}

export function tiles(fr: Grid | Grid[], o: TileOpt): string {
  const F = Array.isArray(fr) ? fr : [fr]
  const R = o.ramp ?? ' .:-=+*#%@', c = o.c, W = F[0].w, H = F[0].h
  const gap = c >= 16 ? 2 : 1, sw = c >= 16 ? 3 : c >= 12 ? 2 : 1, sd = c - gap - sw, off = (gap + sw) / 2, fs = c * 0.95
  const keys = F.map(G => {
    const k = new Int32Array(W * H).fill(-1)
    for (let i = 0; i < W * H; i++) if (G.s[i] >= 0) k[i] = ((G.g[i] * 16 + Math.min(R.length - 1, Math.floor(G.s[i] * R.length))) << 2) | Math.min(3, Math.floor(G.s[i] * 4))
    return k
  })
  const common: number[] = []
  const only: number[][] = F.map(() => [])
  for (let i = 0; i < W * H; i++) {
    if (keys[0][i] >= 0 && keys.every(k => k[i] === keys[0][i])) common.push(i)
    else F.forEach((_, f) => { if (keys[f][i] >= 0) only[f].push(i) })
  }
  // shimmer picks (from the common cells)
  const rnd = lcg(o.seed ?? 3), sh = new Map<number, number>() // cell -> alt char index
  const cand = common.filter(i => { const ci = (keys[0][i] >> 2) & 15; return ci >= 2 && ci <= R.length - 2 })
  for (let n = 0; n < (o.shimmer ?? 0) && cand.length; n++) {
    const i = cand.splice(Math.floor(rnd() * cand.length), 1)[0], ci = (keys[0][i] >> 2) & 15
    sh.set(i, ci + (rnd() < 0.5 ? 1 : -1))
  }
  const px = (i: number) => o.x + (i % W) * c, py = (i: number) => o.y + Math.floor(i / W) * c
  const layer = (idx: number[], key: ArrayLike<number>, skip?: Map<number, number>) => {
    const bg = new Map<number, number[]>(), tx = new Map<number, number[]>()
    for (const i of idx) {
      const k = key[i], gq = ((k >> 6) << 2) | (k & 3)
      ;(bg.get(gq) ?? bg.set(gq, []).get(gq)!).push(i)
      if (R[(k >> 2) & 15] === ' ' || skip?.has(i)) continue
      ;(tx.get(gq) ?? tx.set(gq, []).get(gq)!).push(i)
    }
    let out = ''
    for (const [gq, cells] of [...bg].sort((a, b) => a[0] - b[0])) {
      let d = '', lx = 0, ly = 0
      cells.forEach((i, n) => {
        const x = px(i) + off, y = py(i) + off
        d += n ? `m${n1(x - lx)} ${n1(y - ly)}` : `M${n1(x)} ${n1(y)}`
        d += `h${n1(sd)}v${n1(sd)}h${n1(-sd)}z`
        lx = x; ly = y
      })
      out += `<path class="tb ${o.mats[gq >> 2]}${gq & 3}" stroke-width="${sw}" d="${d}"/>`
    }
    for (const [gq, cells] of [...tx].sort((a, b) => a[0] - b[0])) {
      const cls = `${o.mats[gq >> 2]}t${gq & 3}`, ch = (i: number) => esc(R[(key[i] >> 2) & 15])
      const ty = (i: number) => n1(o.y + Math.floor(i / W) * c + c / 2 + fs * 0.33)
      let rows = '', cur = -1, xs: number[] = [], s = ''
      const flush = () => { if (xs.length) rows += `<text class="${cls}" x="${xs.map(n1).join(' ')}" y="${ty(cur * W)}">${s}</text>`; xs = []; s = '' }
      for (const i of cells) { const r = Math.floor(i / W); if (r !== cur) { flush(); cur = r } xs.push(px(i) + c / 2); s += ch(i) }
      flush()
      const one = `<text class="${cls}" x="${cells.map(i => n1(px(i) + c / 2)).join(' ')}" y="${cells.map(ty).join(' ')}">${cells.map(ch).join('')}</text>`
      out += one.length < rows.length ? one : rows
    }
    return out
  }
  let body = layer(common, keys[0], sh)
  // shimmering tiles: character A and B swap by steps(1) opacity, one pair per colour step
  const groups = new Map<number, number[]>()
  for (const i of sh.keys()) { const k = keys[0][i], gq = ((k >> 6) << 2) | (k & 3); (groups.get(gq) ?? groups.set(gq, []).get(gq)!).push(i) }
  once('sh', () => css.push('@keyframes shA{0%{opacity:1}55%{opacity:0}100%{opacity:0}}@keyframes shB{0%{opacity:0}55%{opacity:1}100%{opacity:1}}.shA{animation:shA 5s steps(1,end) infinite}.shB{animation:shB 5s steps(1,end) infinite}'))
  let gi = 0
  for (const [gq, cells] of groups) {
    const cls = `${o.mats[gq >> 2]}t${gq & 3}`, dl = `animation-delay:-${n1(gi++ * 1.7 + 0.4)}s`
    for (const [tag, alt] of [['shA', false], ['shB', true]] as [string, boolean][]) {
      body += `<text class="${cls} ${tag}" style="${dl}" x="${cells.map(i => n1(px(i) + c / 2)).join(' ')}" y="${cells.map(i => n1(py(i) + c / 2 + fs * 0.33)).join(' ')}">${cells.map(i => esc(R[alt ? sh.get(i)! : (keys[0][i] >> 2) & 15])).join('')}</text>`
    }
  }
  if (F.length > 1) {
    const seq = o.seq ?? F.map((_, i) => i), key = frameCss(seq)
    F.forEach((_, f) => { body += `<g class="q${key}_${f}">${layer(only[f], keys[f])}</g>` })
  }
  const st = F.length > 1 ? ` style="--d:${o.dur ?? 1.2}s;--dl:${o.delay ?? 0}s"` : ''
  return `<g font-size="${n1(fs)}"${o.op != null ? ` opacity="${o.op}"` : ''}${st}>${body}</g>`
}

// ---- motion ----
/** Translate content by (dx,dy) in whole-cell jumps (steps), looping. dx,dy multiples of c. alt = ping-pong,
 *  fade = fade in/out at the ends (for a one-way crossing). Negative delay starts mid-cycle. */
export function move(content: string, o: { dx: number; dy?: number; c: number; dur: number; delay?: number; alt?: boolean; fade?: boolean }): string {
  const id = 'mv' + uid++, dy = o.dy ?? 0
  const N = Math.max(1, Math.round(Math.max(Math.abs(o.dx), Math.abs(dy)) / o.c))
  css.push(`@keyframes ${id}{from{transform:translate(0,0)}to{transform:translate(${o.dx}px,${dy}px)}}.${id}{animation:${id} ${o.dur}s steps(${N},end) ${o.delay ?? 0}s infinite${o.alt ? ' alternate' : ''}}`)
  once('fd', () => css.push('@keyframes fd{0%{opacity:0}8%{opacity:1}92%{opacity:1}100%{opacity:0}}'))
  const inner = o.fade ? `<g style="animation:fd ${o.dur}s linear ${o.delay ?? 0}s infinite">${content}</g>` : content
  return `<g class="${id}">${inner}</g>`
}

// ---- ground ----
export interface Sky { sky: string[]; grid: string; dust: string; glows?: [number, number, number, string, number][] }

/** Faint code-glyph dust: dim inside x 450..1150, slow twinkle at the edges. Colour comes from CSS fill on `cls`. */
export function dust(o: { n: number; seed: number; cls: string; chars?: string; c?: number; edge?: number; mid?: number; y0?: number; y1?: number; zones?: [number, number, number, number][] }): string {
  const c = o.c ?? 16, ch = o.chars ?? '01{}();=<>/#:+*', rnd = lcg(o.seed), y0 = o.y0 ?? 0, y1 = o.y1 ?? 1000
  const edge: [string, number, number][][] = [[], [], []], midA: [string, number, number][] = []
  for (let i = 0; i < o.n; i++) {
    const z = o.zones ? o.zones[Math.floor(rnd() * o.zones.length)] : null
    const x = z ? Math.floor((z[0] + rnd() * (z[2] - z[0])) / c) * c + c / 2 : Math.floor(rnd() * 1600 / c) * c + c / 2
    const y = z ? Math.floor((z[1] + rnd() * (z[3] - z[1])) / c) * c + c / 2 + c * 0.3 : Math.floor((y0 + rnd() * (y1 - y0)) / c) * c + c / 2 + c * 0.3, g = ch[Math.floor(rnd() * ch.length)]
    ;(x > 450 && x < 1150 ? midA : edge[i % 3]).push([g, x, y])
  }
  once('tw', () => css.push('@keyframes tw{from{opacity:.25}to{opacity:1}}.dt0{animation:tw 7s ease-in-out infinite alternate}.dt1{animation:tw 9s ease-in-out -3s infinite alternate}.dt2{animation:tw 11s ease-in-out -6s infinite alternate}'))
  const t = (a: [string, number, number][], op: number, cls = '') => a.length ? `<text${cls ? ` class="${cls}"` : ''} opacity="${op}" x="${a.map(p => p[1]).join(' ')}" y="${a.map(p => p[2]).join(' ')}">${esc(a.map(p => p[0]).join(''))}</text>` : ''
  return `<g class="${o.cls}" font-size="${n1(c * 0.8)}">${edge.map((e, i) => t(e, o.edge ?? 0.5, 'dt' + i)).join('')}${t(midA, o.mid ?? 0.12)}</g>`
}

/** Graded backdrop for light (.L) and dark (.D): vertical gradient, soft glows, faint cell grid, dust. */
export function ground(o: { L: Sky; D: Sky; c?: number; n?: number; seed?: number; chars?: string; zones?: [number, number, number, number][]; edge?: number; mid?: number; gridMask?: string }): string {
  const c = o.c ?? 16
  const one = (S: Sky, k: string) => {
    const gid = 'gg' + k + uid++
    const stops = S.sky.map((s, i) => `<stop offset="${n1(i / (S.sky.length - 1))}" stop-color="${s}"/>`).join('')
    let g = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient><pattern id="${gid}p" width="${c}" height="${c}" patternUnits="userSpaceOnUse"><path d="M${c} 0V${c}H0" fill="none" stroke="${S.grid}" stroke-width=".8"/></pattern>`
    const gl = (S.glows ?? []).map(([x, y, r, col, a], i) => {
      g += `<radialGradient id="${gid}r${i}"><stop offset="0" stop-color="${col}" stop-opacity="${a}"/><stop offset=".45" stop-color="${col}" stop-opacity="${n1(a * 0.4)}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${gid}r${i})"/>`
    }).join('')
    return `${g}</defs><rect width="1600" height="1000" fill="url(#${gid})"/>${gl}<rect width="1600" height="1000" fill="url(#${gid}p)"${o.gridMask ? ` mask="url(#${o.gridMask})"` : ''}/>`
  }
  cssDark.push(`.du{fill:${o.D.dust}}`); css.push(`.du{fill:${o.L.dust}}`)
  return `<g class="L">${one(o.L, 'L')}</g><g class="D">${one(o.D, 'D')}</g>` + dust({ n: o.n ?? 150, seed: o.seed ?? 11, cls: 'du', chars: o.chars, c, zones: o.zones, edge: o.edge, mid: o.mid })
}

/** Wrap content for one scheme only. */
export const L = (s: string) => `<g class="L">${s}</g>`
export const D = (s: string) => `<g class="D">${s}</g>`

// ---- click / hover ----
/** Invisible generous hit rect (paint LAST). With glow, an ellipse that brightens on hover follows it. */
export function hit(id: string, x: number, y: number, w: number, h: number, glow?: string): string {
  const u = uid++
  if (glow) defs.push(`<radialGradient id="hg${u}"><stop offset="0" stop-color="${glow}"/><stop offset=".6" stop-color="${glow}" stop-opacity=".35"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>`)
  return `<rect class="hit" id="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="none"/>` +
    (glow ? `<ellipse class="hv" cx="${n1(x + w / 2)}" cy="${n1(y + h / 2)}" rx="${n1(w / 2)}" ry="${n1(h / 2)}" fill="url(#hg${u})"/>` : '')
}

/** SMIL animation that runs when #id is clicked. attr 'translate' makes an animateTransform. values use ';'. */
export function on(id: string, attr: string, values: string, dur: number, o: { keyTimes?: string; discrete?: boolean; delay?: number } = {}): string {
  const a = `values="${values}" dur="${dur}s" begin="${id}.click${o.delay ? '+' + o.delay + 's' : ''}"${o.keyTimes ? ` keyTimes="${o.keyTimes}"` : ''}${o.discrete ? ' calcMode="discrete"' : ''}`
  return attr === 'translate' ? `<animateTransform attributeName="transform" type="translate" ${a}/>` : `<animate attributeName="${attr}" ${a}/>`
}

/** Click burst at (x,y): tiles fly out (scatter, or an expanding ring) within 50..450 ms, plus an optional flash.
 *  tiles = [bgClass, fgClass, char] variants (e.g. ['tw3','twt3','*']). Put it in the top layer before the hit rects. */
export function burst(id: string, o: { x: number; y: number; tiles: [string, string, string, number?][]; c?: number; n?: number; r?: number; dur?: number; ring?: boolean; delay?: number; flash?: string; seed?: number; dim?: number }): string {
  const c = o.c ?? 12, n = o.n ?? 20, r = o.r ?? 110, dur = o.dur ?? 0.9, rnd = lcg(o.seed ?? 5)
  const gap = c >= 16 ? 2 : 1, sw = c >= 16 ? 3 : c >= 12 ? 2 : 1, sd = c - gap - sw, fs = c * 0.95, u = uid++
  const begin = `${id}.click${o.delay ? '+' + o.delay + 's' : ''}`
  o.tiles.forEach(([bg, fg, ch, tc], i) => {
    const k = tc ?? c, kg = k >= 16 ? 2 : 1, ks = k >= 16 ? 3 : k >= 12 ? 2 : 1, kd = k - kg - ks, kf = k * 0.95
    defs.push(`<g id="bt${u}_${i}"><rect class="tb ${bg}" x="${n1(-kd / 2)}" y="${n1(-kd / 2)}" width="${n1(kd)}" height="${n1(kd)}" stroke-width="${ks}" stroke-linejoin="round"/><text class="${fg}" y="${n1(kf * 0.33)}" font-size="${n1(kf)}">${esc(ch)}</text></g>`)
  })
  // dim: the `dim` ring tiles nearest straight down are drawn at 40% (e.g. where they overlap the object)
  const dimSet = new Set(Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.abs(a / n - 0.25) - Math.abs(b / n - 0.25)).slice(0, o.dim ?? 0))
  let p = ''
  for (let i = 0; i < n; i++) {
    const a = o.ring ? (i / n) * Math.PI * 2 : -Math.PI / 2 + (rnd() - 0.5) * 2.6
    const d = o.ring ? r : r * (0.45 + 0.55 * rnd()), t = n1(dur * (0.85 + 0.3 * rnd()))
    const ex = Math.cos(a) * d, ey = Math.sin(a) * d + (o.ring ? 0 : r * 0.3)
    const path = `M0 0Q${n1(ex * 0.5)} ${n1(ey * 0.5 - (o.ring ? 0 : r * 0.35))} ${n1(ex)} ${n1(ey)}`
    p += `<g opacity="0"><animateMotion path="${path}" dur="${t}s" begin="${begin}"/><animate attributeName="opacity" values="0;${dimSet.has(i) ? '.4;.4' : '1;1'};0" keyTimes="0;.1;.65;1" dur="${t}s" begin="${begin}"/><use href="#bt${u}_${i % o.tiles.length}"/></g>`
  }
  let fl = ''
  if (o.flash) {
    defs.push(`<radialGradient id="bf${u}"><stop offset="0" stop-color="${o.flash}"/><stop offset="1" stop-color="${o.flash}" stop-opacity="0"/></radialGradient>`)
    fl = `<circle r="0" opacity="0" fill="url(#bf${u})"><animate attributeName="r" values="0;${n1(r * 0.75)}" dur=".45s" begin="${begin}"/><animate attributeName="opacity" values="0;.9;0" dur=".45s" begin="${begin}"/></circle>`
  }
  return `<g transform="translate(${n1(o.x)} ${n1(o.y)})">${fl}${p}</g>`
}

// ---- root ----
/** Root <svg> with the shared style block. phone = CSS for @media (max-aspect-ratio:1/1), written only when given: the
 *  desktop app refuses that rule and then draws the scene with no motion. par = preserveAspectRatio. css/dark = extra rules. */
export function frame(body: string, o: { css?: string; dark?: string; phone?: string; defs?: string; par?: string } = {}): string {
  const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="${o.par ?? 'xMidYMid slice'}" width="100%" height="100%">
<defs>${o.defs ?? ''}${defs.join('')}</defs>
<style>.tb{fill:currentColor;stroke:currentColor}text{font-family:ui-monospace,Menlo,Consolas,monospace;text-anchor:middle}.D{display:none}.L{display:block}svg *{pointer-events:none}svg .hit,svg .hit *{pointer-events:all}.hv{opacity:0;transition:opacity .3s;mix-blend-mode:screen}.hit:hover+.hv{opacity:.5}${css.join('')}${o.css ?? ''}
@media (prefers-color-scheme:dark){.L{display:none}.D{display:block}${cssDark.join('')}${o.dark ?? ''}}
${o.phone ? `@media (max-aspect-ratio:1/1){${o.phone}}\n` : ''}@media (prefers-reduced-motion:reduce){*{animation:none !important}}</style>
${body}
</svg>`
  css = []; cssDark = []; defs = []; uid = 0; seen = new Set()
  return out
}
