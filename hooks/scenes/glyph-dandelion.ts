// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
import type { Grid, Pt } from './glyph-kit'
import { burst, D, frame, grid, ground, hit, L, lcg, mat, move, on, raster, line, ell, tiles } from './glyph-kit'

const hash = (x: number, y: number) => (((Math.floor(x) * 73856093) ^ (Math.floor(y) * 19349663)) >>> 0) % 1000 / 1000
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const LT: Pt = [0.62, -0.66]
const Ln = (() => { const l = Math.hypot(LT[0], LT[1], 0.62); return [LT[0] / l, LT[1] / l, 0.62 / l] })()

function materials(): void {
  mat('yp', { lo: '#d49400', hi: '#fff07a', ink: '#7a4a00' }, { lo: '#a07a20', hi: '#ffe070', ink: '#4a2a00' })
  mat('cg', { lo: '#b8a47c', hi: '#fffdf4', ink: '#7a6030' }, { lo: '#c09a6a', hi: '#fff8e6', ink: '#5a3a1a' })
  mat('cb', { lo: '#8c7a62', hi: '#cdbd9c', ink: '#4a3a24' }, { lo: '#3a2a70', hi: '#9a82d4', ink: '#d8ccff' })
  mat('hc', { lo: '#f2e2a0', hi: '#fffbe8', ink: '#8a6a30' }, { lo: '#c88a3a', hi: '#ffd26a', ink: '#3a1a02' })
  mat('st', { lo: '#3a6a30', hi: '#8cb850', ink: '#12301a' }, { lo: '#0c1a2e', hi: '#3a7a70', ink: '#8ad0c0' })
  mat('cx', { lo: '#3a6a2a', hi: '#9cc452', ink: '#12301a' }, { lo: '#10243c', hi: '#4a8a78', ink: '#8ad0c0' })
  mat('gr', { lo: '#5a8a44', hi: '#86b45a', ink: '#2a5a24' }, { lo: '#0b1a26', hi: '#285a62', ink: '#5a9aa6' })
  mat('gv', { lo: '#608c48', hi: '#8cb85e', ink: '#2a5a24' }, { lo: '#0c1c28', hi: '#2c6068', ink: '#5a9aa6' })
  mat('gn', { lo: '#4a7a3c', hi: '#78a652', ink: '#1e4a20' }, { lo: '#08121e', hi: '#1e4a54', ink: '#4a8a96' })
  mat('sd', { lo: '#ecd9a2', hi: '#fffbe8', ink: '#8a6a30' }, { lo: '#6a5a98', hi: '#fff4cc', ink: '#5a3a1a' })
}

function bloom(S: number, R: number, ph: number): Grid {
  const G = grid(S, S), c = S / 2, n1 = Math.max(8, Math.round(R * 2.2))
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = x + 0.5 - c, dy = (y + 0.5 - c) / 0.96, r = Math.hypot(dx, dy), th = Math.atan2(dy, dx)
    const pv = Math.abs(Math.cos(th * n1 / 2 + ph))
    if (r > R * (0.86 + 0.1 * hash(x * 3 + 7, y * 5 + 1) + 0.05 * pv)) continue
    const u = r / R, rr = Math.min(0.96, r / (R + 0.6)), nz = Math.sqrt(1 - rr * rr)
    const lam = Math.max(0, dx / (R + 0.6) * Ln[0] + dy / (R + 0.6) * Ln[1] + nz * Ln[2])
    let s = 0.2 + 0.78 * Math.pow(lam, 0.85) + 0.1 * u * u * u
    if (u > 0.4 && pv < 0.2) s -= 0.1
    G.s[y * S + x] = clamp(s + 0.07 * (hash(x * 5, y * 7) - 0.5))
  }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + ph, x = Math.floor(c + Math.cos(a) * (R + 0.9)), y = Math.floor(c + Math.sin(a) * (R + 0.9))
    if (i % 4 !== 3 && G.s[y * S + x] < 0) G.s[y * S + x] = 0.84
  }
  return G
}

function clock(S: number, R: number, o: { thin?: number; glow?: boolean; seed?: number }): Grid {
  const G = grid(S, S), c = S / 2, rnd = lcg(o.seed ?? 1), glow = !!o.glow
  const Rt = R - 1.3, pts: [number, number, number, number][] = []
  const M = Math.round(R * 1.9), N = Math.round(R * R * 0.24)
  for (let i = 0; i < M; i++) {
    const a = (i + (rnd() - 0.5) * 0.5) / M * Math.PI * 2, z = (rnd() - 0.5) * 0.7, rr = Math.sqrt(1 - z * z)
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr, z, rnd()])
  }
  for (let i = 0; i < N; i++) {
    const z = 0.35 + 0.65 * (i + 0.5) / N, rr = Math.sqrt(1 - z * z), th = i * 2.399963
    pts.push([Math.cos(th) * rr, Math.sin(th) * rr, z, rnd()])
  }
  pts.sort((a, b) => a[2] - b[2])
  const put = (x: number, y: number, s: number, g: number) => {
    const xi = Math.floor(x), yi = Math.floor(y)
    if (xi < 0 || yi < 0 || xi >= S || yi >= S) return
    G.s[yi * S + xi] = clamp(s); G.g[yi * S + xi] = g
  }
  const ray = (p: [number, number, number, number]) => {
    const [px, py, z, rr] = p
    const cut = !!(o.thin && px < 0 && rr < o.thin * Math.pow(clamp((-px + 0.05) / 0.9), 0.7))
    const back = z < 0, g = back ? 1 : 0, len = Rt * (0.9 + 0.1 * rr) * (cut ? 0.45 : 1)
    const nL = px * Ln[0] + py * Ln[1] + z * Ln[2]
    const tipS = glow ? (back ? 0.3 : 0.86) : clamp((0.3 + 0.8 * Math.max(0, nL)) * (back ? 0.62 : 1))
    for (let d = 1.3; d <= len; d += 0.35) {
      const t = d / len
      const s = glow ? clamp(back ? 0.2 + (1 - t) * 0.25 : 0.6 + 0.4 * Math.pow(1 - t, 0.7) * (0.75 + 0.25 * z)) : tipS * (0.55 + 0.45 * Math.min(1, t * 2.2)) * (0.82 + 0.25 * t)
      put(c + px * d, c + py * d, s, g)
    }
    if (cut) return
    const tx = c + px * len, ty = c + py * len
    put(tx, ty, tipS, g)
    put(tx + px * 1.1, ty + py * 1.1, tipS * 0.85, g)
    if (!back) { put(tx + py * 0.9, ty - px * 0.9, tipS * 0.7, g); put(tx - py * 0.9, ty + px * 0.9, tipS * 0.7, g) }
  }
  pts.filter((p, i) => p[2] < 0 && i % 3 === 0).forEach(ray)
  const hr = glow ? 2.6 : 1.8
  const hcx = Math.floor(c + R * 0.38)
  for (let y = 0; y < S; y++) { const i = y * S + hcx; if (G.s[i] >= 0 && G.g[i] === 0 && Math.hypot(hcx + 0.5 - c, y + 0.5 - c) < R - 1.5) G.s[i] = 1 }
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = x + 0.5 - c, dy = y + 0.5 - c, r = Math.hypot(dx, dy)
    if (r > hr) continue
    const lam = Math.max(0, dx / hr * Ln[0] + dy / hr * Ln[1] + Math.sqrt(1 - (r / hr) ** 2) * Ln[2])
    put(x + 0.5, y + 0.5, glow ? 0.95 - r * 0.12 : 0.3 + 0.5 * lam, 2)
  }
  pts.filter(p => p[2] >= 0).forEach(ray)
  return G
}

const NECK = 8
const stemCol = (y: number, H0: number, lean: number, bow: number) => lean ? Math.max(0, Math.floor((3 * lean - Math.min(y, H0)) / 3)) : Math.round(bow * Math.sin(Math.PI * Math.max(0, 1 - y / H0)))
function stemG(W: number, H: number, H0: number, k: number, lean: number, bow: number): Grid {
  const G = grid(W, H)
  for (let y = NECK - 1; y < H; y++) {
    const x = k + stemCol(y, H0, lean, bow), i = y * W + x
    G.s[i] = 0.62 + 0.08 * hash(x, y * 3); G.g[i] = 0
    if (y >= H0 - 5 && y <= H0) { G.s[i + 1] = 0.42; G.g[i + 1] = 0 }
  }
  return G
}
function calyxG(S: number, R: number, small: boolean, H0: number, lean: number, bow: number): Grid {
  const hx = S / 2, hy = S / 2, sp = small ? 0.45 : 0.6
  const sh = [ell(hx, hy + R + 0.6, 2.2 + R * 0.14, 1.8 + R * 0.08, { g: 1, b: 0.62, rim: 0.4 })]
  for (const a of [-1, -0.5, 0, 0.5, 1]) {
    sh.push(line([[hx + a * R * 0.3, hy + R * 0.6], [hx + a * R * sp * 0.85, hy + R + 1.1], [hx + a * R * (sp + 0.1), hy + R + 2.4 - Math.abs(a) * 0.8]], 1.3, { g: 1, b: 0.7, rim: 0.3 }))
  }
  const G = raster(S, S + NECK + 3, sh, { light: LT }), mx = Math.floor(hx), my = Math.floor(hy)
  for (const yy of [my, my + 1]) { G.s[yy * S + mx] = 0.92; G.g[yy * S + mx] = 2 }
  for (let y = 1; y <= NECK + 1; y++) { const x = mx + stemCol(y, H0, lean, bow) - stemCol(0, H0, lean, bow), i = (my + y) * S + x; if (G.s[i] < 0) { G.s[i] = 0.62; G.g[i] = 0 } }
  return G
}

function blade(G: Grid, x0: number, y0: number, len: number, ang: number, bend: number, w0: number, g: number, b: number, o: { wind?: number; leaf?: boolean; vein?: number } = {}) {
  const n = Math.ceil(len * 3)
  let x = x0, y = y0
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = (ang + bend * t + (o.wind ?? 0) * (0.25 + 0.75 * t * t)) * Math.PI / 180
    let w = o.leaf ? w0 * Math.sin(Math.PI * Math.pow(t, 0.75)) * (1 + 0.3 * (((t * len * 0.8) % 1) - 0.5)) : w0 * Math.pow(1 - t, 0.7)
    w = Math.max(w, 0.45)
    const ca = Math.cos(a), sa = Math.sin(a)
    for (let v = -w; v <= w; v += 0.3) {
      const u = v / w, cx = Math.floor(x + ca * v), cy = Math.floor(y + sa * v)
      if (cx < 0 || cy < 0 || cx >= G.w || cy >= G.h) continue
      const lam = Math.max(0, ca * u * Ln[0] + sa * u * Ln[1] + Math.sqrt(1 - u * u) * Ln[2])
      let s = (0.28 + 0.72 * lam) * (0.4 + 0.6 * b) * 1.25 * (0.6 + 0.5 * t)
      let gg = g
      if (o.vein !== undefined && Math.abs(v) < 0.45) { gg = o.vein; s += 0.25 }
      G.s[cy * G.w + cx] = clamp(s); G.g[cy * G.w + cx] = gg
    }
    x += Math.sin(a) * len / n; y -= Math.cos(a) * len / n
  }
}

function patch(W: number, H: number, seed: number, o: { n: number; hmin: number; hmax: number; wind: number; w0: number; b: number; taper: 'l' | 'r'; leaves?: number; leafW?: number }): Grid {
  const G = grid(W, H), r = lcg(seed)
  const edge = (x: number) => Math.min(clamp(((o.taper === 'r' ? W - x : x) - 1) / 10, 0.18, 1), clamp(((o.taper === 'r' ? x : W - x) + 1) / 8 + 0.2 * (hash(x * 7, 3) - 0.5), 0.2, 1))
  for (let i = 0; i < (o.leaves ?? 0); i++) {
    const x = o.taper === 'r' ? 2 + r() * (W * 0.55) : W - 2 - r() * (W * 0.55)
    const out = (o.taper === 'r' ? -1 : 1) * (0.35 + r() * 0.65)
    blade(G, x, H - 0.3, (o.hmax * 0.9 + r() * 4) * edge(x), out * 22, out * 55, o.leafW ?? 2.1, 0, 0.8, { wind: o.wind, leaf: true, vein: 1 })
  }
  for (let i = 0; i < o.n; i++) {
    const x = 1 + r() * (W - 2), k = 2 + Math.floor(r() * 3), e = edge(x)
    for (let j = 0; j < k; j++) {
      const len = (o.hmin + r() * (o.hmax - o.hmin)) * (0.6 + 0.4 * r()) * e
      if (len < 2) continue
      blade(G, x + (r() - 0.5) * 2, H - 0.2, len, (r() - 0.5) * 56, (r() - 0.5) * 24, o.w0 * (0.4 + 0.3 * r()), 0, o.b * (0.8 + 0.3 * r()), { wind: o.wind })
    }
  }
  for (let i = 0; i < G.s.length; i++) if (G.s[i] >= 0) G.s[i] = clamp(G.s[i], 0.3, 0.58)
  for (let i = G.w; i < G.s.length; i++) if (G.s[i] >= 0 && G.s[i - G.w] < 0) G.s[i] = 0.66
  return G
}

function seedT(wide: boolean, long = false): Grid {
  if (long) { const G = grid(9, 4), set = (x: number, y: number, s: number) => { G.s[y * 9 + x] = s; G.g[y * 9 + x] = 0 }; set(7, 0, 0.98); set(6, 0, 0.9); set(5, 1, 0.34); set(4, 1, 0.28); set(3, 2, 0.2); set(2, 2, 0.15); set(1, 3, 0.1); return G }
  const G = grid(6, 4), set = (x: number, y: number, s: number) => { G.s[y * 6 + x] = s; G.g[y * 6 + x] = 0 }
  if (!wide) { set(4, 0, 0.98); set(3, 1, 0.2); set(2, 1, 0.1); return G }
  set(3, 0, 0.9); set(4, 0, 0.98); set(2, 1, 0.3); set(3, 1, 0.26); set(0, 2, 0.12); set(1, 2, 0.14); set(2, 2, 0.1)
  return G
}

const diag = (content: string, o: { dx: number; dy: number; c: number; dur: number; delay?: number; fade?: boolean }) =>
  move(move(content, { dx: 0, dy: o.dy, c: o.c, dur: o.dur, delay: o.delay }), { dx: o.dx, c: o.c, dur: o.dur, delay: o.delay, fade: o.fade })

interface Pl { id: string; c: number; col: number; row: number; R: number; bloom: boolean; bow: number; ph: number; thin: number; dl: number; extra: number; hh: number }
const PLANTS: Pl[] = [
  { id: 'A', c: 12, col: 16, row: 40, R: 11, bloom: true, bow: 2, ph: 0.3, thin: 0.85, dl: -3, extra: 22, hh: 165 },
  { id: 'B', c: 12, col: 26, row: 58, R: 4.5, bloom: true, bow: -2, ph: 1.1, thin: 0.8, dl: -7, extra: 22, hh: 70 },
  { id: 'C', c: 8, col: 14, row: 97, R: 5.5, bloom: true, bow: 2, ph: 2.0, thin: 0.8, dl: -5, extra: 0, hh: 70 },
  { id: 'D', c: 12, col: 107, row: 41, R: 7, bloom: false, bow: -2, ph: 0.7, thin: 0.85, dl: -1, extra: 0, hh: 110 },
  { id: 'E', c: 12, col: 119, row: 52, R: 5, bloom: true, bow: 2, ph: 1.6, thin: 0.8, dl: -9, extra: 22, hh: 80 },
]

function loose(cls: string, op: number, seed: number, n: number, ch = '01{}();=<>/#:+*'): string {
  const r = lcg(seed), zones: [number, number, number, number][] = [[40, 420, 120, 820], [1180, 1560, 120, 820]]
  const xs: number[] = [], ys: number[] = []; let s = ''
  for (let i = 0; i < n; i++) { const z = zones[i % 2]; xs.push(Math.floor((z[0] + r() * (z[1] - z[0])) / 16) * 16 + 8); ys.push(Math.floor((z[2] + r() * (z[3] - z[2])) / 16) * 16 + 12); s += ch[Math.floor(r() * ch.length)].replace('<', '&lt;').replace('>', '&gt;') }
  return `<text class="${cls}" opacity="${op}" font-size="13" x="${xs.join(' ')}" y="${ys.join(' ')}">${s}</text>`
}

function puff(id: string, x: number, y: number, seed: number): string {
  const r = lcg(seed); let p = ''
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI * (0.1 + 0.8 * (i + 0.5 * r()) / 8), d = 150 + r() * 130, ex = Math.cos(a) * d + 30, ey = Math.sin(a) * d
    const path = `M0 0Q${Math.round(ex * 0.35)} ${Math.round(ey * 0.75)} ${Math.round(ex)} ${Math.round(ey)}`, t = (0.85 + r() * 0.3).toFixed(2)
    const one = (u: string, delay: number, op: number) => `<g opacity="0"><animateMotion path="${path}" dur="${t}s" begin="${id}.click${delay ? '+' + delay + 's' : ''}"/><animate attributeName="opacity" values="0;${op};${op};0" keyTimes="0;.1;.65;1" dur="${t}s" begin="${id}.click${delay ? '+' + delay + 's' : ''}"/><use href="#${u}"/></g>`
    p += one(i % 2 ? 'pf1' : 'pf0', 0, 1)
    if (i % 2 === 0 || i === 5) p += one('pf2', 0.07, 0.6)
  }
  const fl = `<circle r="0" opacity="0" fill="url(#fl3)"><animate attributeName="r" values="0;190" dur=".45s" begin="${id}.click"/><animate attributeName="opacity" values="0;.75;0" dur=".45s" begin="${id}.click"/></circle>`
  return `<g transform="translate(${x} ${y})">${fl}${p}</g>`
}

export function glyphDandelionScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  materials()
  const WIND = busy ? 24 : 1
  const css: string[] = []

  const RAMP = ' .:-='
  const grass = (side: 'l' | 'r', c: number, W: number, H: number, seed: number, mats: string[], o: Parameters<typeof patch>[3], dur: number) => {
    const x0 = side === 'l' ? 24 : 1576 - W * c, y0 = 1000 - H * c, nm = `gs${side}${c}`
    css.push(`@keyframes ${nm}{0%{transform:translate(0,0)}50%{transform:translate(${c}px,0)}}.${nm}{animation:${nm} ${dur}s step-end ${-seed % 5}s infinite}`)
    return `<g class="${nm}">${tiles(patch(W, H, seed, { ...o, wind: WIND, taper: side === 'l' ? 'r' : 'l' }), { c, x: x0, y: y0, mats, ramp: RAMP, shimmer: 3, seed: seed + 1 })}</g>`
  }
  const midG = (s: 'l' | 'r') => grass(s, 12, 22, 12, s === 'l' ? 41 : 47, ['gr', 'gv'], { n: 3, hmin: 6, hmax: 12, wind: 0, w0: 1.0, b: 0.85, taper: 'r' }, busy ? 2.4 : 10)
  const nearG = (s: 'l' | 'r') => grass(s, 16, 16, 10, s === 'l' ? 51 : 57, ['gn', 'gv'], { n: 2, hmin: 6, hmax: 9, wind: 0, w0: 1.2, b: 0.85, taper: 'r', leaves: 2, leafW: 1.7 }, busy ? 2.0 : 8)

  const geo = PLANTS.map(p => { const H0 = Math.ceil(1000 / p.c) - p.row + 1; return { p, H0, lean: Math.round(H0 / 6) } })
  const parts = geo.map(({ p, H0, lean }, pi) => {
    const { c, R } = p, S = 2 * Math.ceil(R) + 3, m = (S - 1) / 2
    const cx = p.col * c + c / 2, cy = p.row * c + c / 2
    const hx = (p.col - m) * c, hy = (p.row - m) * c
    const k = 10, Ws = 2 * k + 1, Hs = H0 + p.extra
    const offs = busy ? [lean, lean] : [0, 1], so = busy ? lean : 0, bow = busy ? 0 : p.bow
    const dur = busy ? 3.4 : 18
    const stemS = tiles(stemG(Ws, Hs, H0, k, busy ? lean : 0, bow), { c, x: (p.col - k) * c, y: p.row * c, mats: ['st'], shimmer: 2, seed: pi + 2 })
    const cls = `sw${p.id}`
    css.push(busy ? `.${cls}{transform:translate(${lean * c}px,0)}` : `@keyframes ${cls}{${offs.map((o, i) => `${i * 50}%{transform:translate(${o * c}px,0)}`).join('')}}.${cls}{animation:${cls} ${dur}s step-end ${p.dl}s infinite}`)
    const id = 'h' + p.id
    const steps = [0, R * 0.4 * c, R * 0.7 * c, R * 0.92 * c].map(v => Math.round(v)), rr = (R + 2) * c
    const clipId = 'cp' + p.id
    const headFor = (build: (r: number) => Grid, mats: string[], sh: number, extra = '', pre = '') =>
      `<g${extra} clip-path="url(#${clipId})">${pre}${tiles(build(R), { c, x: hx, y: hy, mats, shimmer: sh, seed: pi + 5 })}</g>`
    const clk = (r: number) => clock(S, r, { thin: busy ? p.thin : 0, glow: true, seed: pi + 3 })
    const bl = (r: number) => bloom(S, r, p.ph)
    const clkM = ['cg', 'cb', 'hc'], dm = p.id === 'A' ? '' : ' class="dm"'
    const calyx = tiles(calyxG(S, R, !p.bloom, H0, busy ? lean : 0, bow), { c, x: hx, y: hy, mats: ['st', 'cx', 'sd'] })
    let heads: string
    const ringG = () => { const G = grid(S, S); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const dx = x + 0.5 - S / 2, dy = y + 0.5 - S / 2, d = Math.hypot(dx, dy); if (Math.abs(d - (R - 0.6)) < 0.75 && hash(x * 3, y * 5) > 0.2 && !(busy && dx < -0.3 * R)) { G.s[y * S + x] = 0.3; G.g[y * S + x] = 0 } } return G }
    if (p.id === 'D') heads = headFor(clk, clkM, 5, dm, L(tiles(ringG(), { c, x: hx, y: hy, mats: ['cb'] })))
    else if (p.id === 'E') heads = headFor(bl, ['yp'], 3, dm)
    else heads = L(headFor(bl, ['yp'], 5)) + D(headFor(clk, clkM, 5, dm))
    const head = `<g class="${cls}">${calyx}${heads}</g>`
    const hcx = cx + so * c
    const hr = p.id === 'A' ? 220 : Math.round(R * c * 1.25)
    const halo = `<g class="D pl-${p.id}"><circle cx="${hcx}" cy="${cy}" r="${hr}" fill="url(#hgl)" opacity="${p.id === 'A' ? 1 : 0.6}"/></g>` +
      (p.id === 'A' ? `<g class="L pl-A"><circle cx="${hcx}" cy="${cy}" r="190" fill="url(#hgA)" opacity=".6"/></g>` : '') +
      (p.id === 'D' ? `<g class="L pl-D"><circle cx="${hcx}" cy="${cy}" r="130" fill="url(#hgA)" opacity=".55"/></g>` : '')
    const clip = `<clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${rr}">${on(id, 'r', steps.join(';'), 3.1, { keyTimes: '0;.29;.5;.72', discrete: true })}</circle></clipPath>`
    const fx = `<g class="pl-${p.id}">` + puff(id, hcx, cy, pi + 1) + hit(id, cx - p.hh, cy - p.hh, p.hh * 2, p.hh * 2, '#ffe9a0') + '</g>'
    return { id: p.id, far: c === 8, mid: `<g class="pl-${p.id}">${halo}${clip}${stemS}${head}</g>`, fx, hcx, cy, c, R }
  })
  const plant = (id: string) => parts.find(q => q.id === id)!.mid
  const pp = (id: string) => parts.find(q => q.id === id)!

  const sd = (S: Grid, c: number, x: number, y: number) => tiles(S, { c, x, y, mats: ['sd'] })
  const seedAt = (id: string, c: number, x: number, y: number, dx: number, dy: number, dur: number, dl: number, wide: boolean, long = false) =>
    `<g class="pl-${id}">${diag(sd(seedT(wide, long), c, x, y), { dx, dy, c, dur, delay: dl, fade: true })}</g>`
  let seeds = ''
  if (busy) {
    const edge = (id: string, deg: number, gap = 30) => { const q = pp(id), a = deg * Math.PI / 180, rc = q.R * q.c + gap; return [q.hcx + Math.cos(a) * rc - 36, q.cy - Math.sin(a) * rc - 6] }
    const spec: [string, number, number, number, number, number, number, number][] = [
      ['A', 62, 72, -48, 6, -0.5, 12, 0], ['A', 88, 96, -60, 7, -3.4, 12, 0], ['A', 105, 96, -48, 6.5, -5.2, 12, 0],
      ['B', 85, 48, -48, 5.5, -2.1, 12, 0], ['C', 85, 48, -40, 6, -3.9, 8, 0],
      ['D', 62, 72, -48, 6, -1.6, 12, 0], ['D', 100, 96, -60, 7, -4.8, 12, 0],
    ]
    const amb: [string, number, number, number, number, number][] = [['A', 36, 204, 96, -48, 6], ['A', 150, 300, 84, -36, 7], ['A', 90, 130, 96, -48, 6.5], ['A', 216, 222, 72, -36, 7.5],
      ['D', 1190, 200, 96, -48, 6.5], ['D', 1310, 130, 96, -48, 7], ['D', 1470, 250, 72, -36, 6], ['D', 1200, 330, 96, -48, 7.5]]
    amb.forEach(([id, x, y, dx, dy, dur], i) => { seeds += seedAt(id, 12, x, y, dx, dy, dur, -1.1 * i - 0.6, false, true) })
    spec.forEach(([id, deg, dx, dy, dur, dl, c]) => { const [x, y] = edge(id, deg); seeds += seedAt(id, c, Math.round(x / c) * c, Math.round(y / c) * c, dx, dy, dur, dl, true) })
  } else {
    seeds = seedAt('A', 12, 84, 312, 156, -84, 40, -22, false) + seedAt('A', 12, 276, 204, 120, -72, 36, -10, false) + seedAt('D', 12, 1488, 300, 60, -60, 34, -6, false) + seedAt('D', 12, 1380, 420, 96, -60, 14, -6.5, false) +
      D(seedAt('A', 12, 276, 396, 96, -60, 15, -9.5, false))
  }

  const sun = L(`<circle cx="1380" cy="90" r="54" fill="url(#bkL)"/>`)
  const gridMask = `<g class="L"><rect width="1600" height="1000" fill="url(#gpL)" mask="url(#gm)"/></g><g class="D"><rect width="1600" height="1000" fill="url(#gpD)" mask="url(#gm)"/></g>`
  const stars = D(loose('st', 0.95, 21, 7, '.+*.'))

  const body = ground({
    L: { sky: ['#f6efc6', '#ecf0c6', '#dfeabd', '#cde4a8'], grid: 'rgba(0,0,0,0)', dust: '#4a6a34', glows: [[1590, 10, 640, '#ffe9a0', 0.8], [1600, 0, 260, '#fff6c8', 0.8], [160, 1000, 460, '#9cc46a', 0.4], [1480, 1000, 460, '#9cc46a', 0.38]] },
    D: { sky: ['#08071c', '#140f36', '#241a4a', '#2f2350'], grid: 'rgba(0,0,0,0)', dust: '#b8aaf0', glows: [[220, 240, 520, '#3a2a86', 0.4], [1420, 200, 600, '#4a2a8a', 0.32], [800, 1000, 360, '#5a3a68', 0.2], [100, 1000, 420, '#24404e', 0.3], [1500, 1000, 420, '#24404e', 0.3]] },
    n: 0, seed: 11,
  }) + gridMask + sun + L(loose('du', 0.25, 5, 12)) + D(loose('du', 0.55, 5, 11)) + stars +
    pp('C').mid +
    `<g class="pl-gl">${midG('l')}</g><g class="pl-gr">${midG('r')}</g>` +
    plant('B') + plant('E') + plant('A') + plant('D') +
    `<g class="pl-gl">${nearG('l')}</g><g class="pl-gr">${nearG('r')}</g>` +
    seeds +
    parts.map(q => q.fx).join('')

  const tileDef = (idn: string, cls: string, ch: string, tcls: string) => `<g id="${idn}"><rect class="tb ${cls}" x="-4.5" y="-4.5" width="9" height="9" stroke-width="2" stroke-linejoin="round"/>${ch ? `<text class="${tcls}" y="3.8" font-size="11.4">${ch}</text>` : ''}</g>`
  return frame(body, {
    defs: `<radialGradient id="hgl"><stop offset="0" stop-color="#ffd890" stop-opacity=".6"/><stop offset=".3" stop-color="#d0a4ff" stop-opacity=".26"/><stop offset="1" stop-color="#5a3bd0" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="hgA"><stop offset="0" stop-color="#f0b020" stop-opacity=".55"/><stop offset=".4" stop-color="#f0b020" stop-opacity=".22"/><stop offset="1" stop-color="#f0b020" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="fl3"><stop offset="0" stop-color="#fff0b8" stop-opacity=".6"/><stop offset=".4" stop-color="#fff0b8" stop-opacity=".3"/><stop offset=".72" stop-color="#fff0b8" stop-opacity=".1"/><stop offset="1" stop-color="#fff0b8" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="bkL"><stop offset="0" stop-color="#f6cf60" stop-opacity=".5"/><stop offset=".8" stop-color="#f6cf60" stop-opacity=".22"/><stop offset="1" stop-color="#f6cf60" stop-opacity="0"/></radialGradient>` +
      `<pattern id="gpL" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0V16H0" fill="none" stroke="rgba(60,100,40,.1)" stroke-width=".8"/></pattern>` +
      `<pattern id="gpD" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0V16H0" fill="none" stroke="rgba(190,170,255,.065)" stroke-width=".8"/></pattern>` +
      `<linearGradient id="gmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".16" stop-color="#fff"/><stop offset=".28" stop-color="#000"/><stop offset=".72" stop-color="#000"/><stop offset=".84" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<mask id="gm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#gmg)"/></mask>` +
      tileDef('pf0', 'sd3', '@', 'sdt3') + tileDef('pf1', 'sd3', '*', 'sdt3') + tileDef('pf2', 'sd1', '', ''),
    css: css.join('') + '.st{fill:#d8d0ff}',
    dark: '.dm{opacity:.65}',
    phone: `.pl-A{transform:translate(580px,-190px)}.pl-B{transform:translate(480px,-100px)}.pl-E{transform:translate(-566px,120px)}.pl-C,.pl-D,.pl-gr{display:none}.pl-gl{transform:translate(600px,0)}`,
  })
}
