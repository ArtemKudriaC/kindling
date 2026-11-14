// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Glyph train (Поезд): a small railway in hill country. Station at the bottom left, tunnel and viaduct at the bottom right,
// a steam train (loco + 3 carriages) as the hero. Light: clear morning. Dark: night, lit windows, headlamp wedge.
// idle: the train stands at the station, signal red. busy: signal green, the train runs behind the hill and out of the tunnel.
import type { Grid, Pt } from './glyph-kit'
import { burst, D, ell, frame, grid, ground, hit, L, line, mat, move, on, poly, raster, rect, tiles, dust, lcg } from './glyph-kit'

const LIGHT: Pt = [-0.75, -0.45]
const hash = (x: number, y: number) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000 / 1000
const q3 = (v: number, a = 0.4, b = 0.62, hi = 0.84) => (v < a ? 0.3 : v < b ? 0.55 : hi) // three tones only

function materials(): void {
  mat('lg', { lo: '#0d3624', hi: '#3fa070', ink: '#04201a' }, { lo: '#0c2824', hi: '#46a888', ink: '#bff0dc' })
  mat('bk', { lo: '#1e2836', hi: '#5c6e86', ink: '#0e1620' }, { lo: '#1a2636', hi: '#5a6e8c', ink: '#c0d0e4' })
  mat('bg', { lo: '#7a4a0c', hi: '#e8b040', ink: '#3e2404' }, { lo: '#6a400c', hi: '#f6c860', ink: '#3a2004' })
  mat('wd', { lo: '#3f7f9e', hi: '#b4dcec', ink: '#1d4a64', k: 0.25 }, { lo: '#c8721a', hi: '#ffd780', ink: '#6a2c04', k: 0.25 })
  mat('cr', { lo: '#5a1a1c', hi: '#c24e36', ink: '#2a0a0c' }, { lo: '#2a1018', hi: '#b8474a', ink: '#ffc0a8' })
  mat('lp', { lo: '#d07a10', hi: '#ffe27a', ink: '#7a3a00', k: 0.25 }, { lo: '#e0a030', hi: '#fff4c0', ink: '#9a5a08', k: 0.25 })
  mat('rs', { lo: '#2a3a4c', hi: '#6f869c', ink: '#101c28' }, { lo: '#16202e', hi: '#52688a', ink: '#b4c8e0' })
  mat('st', { lo: '#46587f', hi: '#f4f8fc', ink: '#22345a' }, { lo: '#1c2c44', hi: '#f4dcae', ink: '#7a8aa4' })
  mat('sn', { lo: '#7a5e52', hi: '#d9b890', ink: '#3c2a26' }, { lo: '#17222e', hi: '#5f7690', ink: '#b3c6d8' })
  mat('hs', { lo: '#a8703a', hi: '#f2cf8a', ink: '#5a3410' }, { lo: '#161c30', hi: '#46557a', ink: '#aab8d6' })
  mat('hr', { lo: '#6e2020', hi: '#c8503a', ink: '#2c0c0c' }, { lo: '#1a1018', hi: '#5a2a30', ink: '#d89a8a' })
  mat('rl', { lo: '#3a4658', hi: '#8d9db4', ink: '#1e2836' }, { lo: '#1a2636', hi: '#6a809c', ink: '#aebfd3' })
  mat('hg', { lo: '#3f7e40', hi: '#8cc45e', ink: '#1e5028' }, { lo: '#081c26', hi: '#1e5256', ink: '#7fb8b0' })
  mat('h2', { lo: '#78b078', hi: '#c4e0a8', ink: '#3a7248' }, { lo: '#0f3042', hi: '#2a5c7c', ink: '#7fb0cc' })
  mat('pn', { lo: '#103f28', hi: '#2e8a52', ink: '#082418' }, { lo: '#07161a', hi: '#1a4a44', ink: '#6faa9a' })
  mat('ti', { lo: '#1c2540', hi: '#38466a', ink: '#8a9cc8' }, { lo: '#060b14', hi: '#141f30', ink: '#4a6082' })
  mat('rd', { lo: '#9c1620', hi: '#ff6a50', ink: '#4a080e' }, { lo: '#b02024', hi: '#ff9a80', ink: '#ffe4d8' })
  mat('gn', { lo: '#1a6e38', hi: '#5ade88', ink: '#083a1a' }, { lo: '#1c8c48', hi: '#a8ffc0', ink: '#04301a' })
  mat('rx', { lo: '#5a2a34', hi: '#8a4650', ink: '#2a1018' }, { lo: '#2a1218', hi: '#4a2228', ink: '#8a5a60' })
  mat('gx', { lo: '#2a5a3c', hi: '#4a8a62', ink: '#123a24' }, { lo: '#10281c', hi: '#1e4a30', ink: '#5a9a74' })
  mat('bw', { lo: '#6a5420', hi: '#fff0b0', ink: '#fff8e0' }, { lo: '#6a5420', hi: '#fff0b0', ink: '#fff8e0' })
  mat('tg', { lo: '#5b9556', hi: '#76ab62', ink: '#2c6a3a' }, { lo: '#11363c', hi: '#1b4b50', ink: '#6fb0ac' })
  mat('pf', { lo: '#7a5e52', hi: '#d2b08a', ink: '#3c2a26' }, { lo: '#0e1620', hi: '#2c3c50', ink: '#8aa0b8' })
  mat('mo', { lo: '#8a96b0', hi: '#eef2fa', ink: '#5a6880' }, { lo: '#7c88a6', hi: '#eef2fa', ink: '#4a5870' })
  mat('su', { lo: '#d8681e', hi: '#f6b258', ink: '#8a3a0c' }, { lo: '#d8681e', hi: '#f6b258', ink: '#8a3a0c' })
  mat('sm', { lo: '#4a5266', hi: '#8e96a8', ink: '#2c3246' }, { lo: '#5a4c46', hi: '#d2c2ae', ink: '#8a7a6c' })
  mat('fv', { lo: '#2f6648', hi: '#5c9a6c', ink: '#1a4430' }, { lo: '#0f3042', hi: '#2a5c7c', ink: '#7fb0cc' })
  mat('gu', { lo: '#36425f', hi: '#667494', ink: '#171f38' }, { lo: '#36425f', hi: '#667494', ink: '#171f38' })
}

// ---- train: 52 x 20 cells of 8 px (408 px), rail at the bottom edge. Loco on the right, 3 carriages on the left ----
export const TW = 50, TH = 20, RW = 52
const TM = ['lg', 'bk', 'bg', 'wd', 'cr', 'lp', 'rs']
const win = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, { g: 3, b: 1, fx: (cx, cy, s) => Math.min(1, 0.72 + 0.2 * Math.max(0, 1 - (cx + 0.5 - x) / w) - 0.06 * (cy + 0.5 - y) / h + (s - 0.8) * 0.05 + (hash(cx, cy) - 0.5) * 0.08) })

function carriage(x0: number) {
  const w = 8.8, d = 1.2
  return [
    rect(x0, 5.8 + d, w, 9.8 - d, { g: 4, b: 0.85, cyl: 'y', rim: 0.25 }),
    poly([[x0 - 0.3, 6.0 + d], [x0 + 1.3, 4.1 + d], [x0 + w - 1.3, 4.1 + d], [x0 + w + 0.3, 6.0 + d]], { g: 6, b: 0.75, cyl: 'y', rim: 0.35 }),
    rect(x0 + 2.8, 3.5 + d, 3.4, 0.8, { g: 6, b: 0.6, rim: 0.3 }),
    rect(x0, 6.0 + d, w, 0.7, { g: 2, b: 0.8 }), rect(x0, 13.3, w, 0.9, { g: 2, b: 0.8 }),
    win(x0 + 0.7, 7.7 + d, 2.2, 3.6), win(x0 + 3.5, 7.7 + d, 2.2, 3.6), win(x0 + 6.4, 7.7 + d, 1.6, 3.6),
    rect(x0 + 0.3, 15.4, w - 0.6, 1.6, { g: 4, b: 0.4, ao: 1 }),
    ell(x0 + 2.4, 18.0, 2.0, 2.0, { g: 1, b: 0.62, rim: 0.5 }), ell(x0 + w - 2.4, 18.0, 2.0, 2.0, { g: 1, b: 0.62, rim: 0.5 }),
    ell(x0 + 2.4, 18.0, 0.7, 0.7, { g: 2, b: 0.85 }), ell(x0 + w - 2.4, 18.0, 0.7, 0.7, { g: 2, b: 0.85 }),
  ]
}

export function train(f: number): Grid {
  const cy = 17.0, a = f * Math.PI / 4, dw = [39.2, 44.8]
  const wheel = (cx: number, cyy: number, r: number) => [
    ell(cx, cyy, r, r, { g: 1, b: 0.62, rim: 0.9 }), ell(cx, cyy, 0.9, 0.9, { g: 2, b: 0.9 }),
    ...(r > 2 ? [0, Math.PI / 2].map(o => line([[cx - (r - 0.5) * Math.cos(a + o), cyy - (r - 0.5) * Math.sin(a + o)], [cx + (r - 0.5) * Math.cos(a + o), cyy + (r - 0.5) * Math.sin(a + o)]], 0.6, { g: 1, b: 1 })) : []),
  ]
  const rodY = cy + (f ? -1.7 : 1.7)
  const R = raster(RW, TH, [
    ...[0, 9.3, 18.6].flatMap(carriage),
    line([[8.7, 16.2], [9.4, 16.2]], 0.9, { g: 1 }), line([[18.0, 16.2], [18.7, 16.2]], 0.9, { g: 1 }),
    rect(30, 14.6, 21.4, 1.5, { g: 1, b: 0.55, ao: 1 }),
    // cab: walls, red lining, framed window, arched roof
    rect(30.5, 3.6, 7.6, 11.0, { g: 0, b: 0.82, rim: 0.3 }),
    rect(30.5, 12.8, 7.6, 1.6, { g: 4, b: 0.78 }),
    rect(37.2, 4.4, 0.5, 7.8, { g: 1, b: 0.5 }),
    rect(31.6, 4.7, 5.4, 5.2, { g: 1, b: 0.5 }), win(32.0, 5.1, 4.6, 4.4),
    poly([[29.6, 3.7], [30.7, 1.5], [37.9, 1.5], [39.0, 3.7]], { g: 6, b: 0.78, cyl: 'y', rim: 0.45 }),
    rect(32.6, 0.8, 3.4, 0.8, { g: 6, b: 0.6 }),
    // boiler with brass bands, smokebox, running board
    rect(38.1, 5.6, 10.0, 7.4, { g: 0, b: 0.92, cyl: 'y', rim: 0.75 }),
    line([[38.8, 6.1], [47.2, 6.1]], 0.8, { g: 0, b: 1, fx: () => 0.97 }),
    rect(41.4, 5.6, 0.9, 7.4, { g: 2, b: 0.8, cyl: 'y' }), rect(45.0, 5.6, 0.9, 7.4, { g: 2, b: 0.8, cyl: 'y' }),
    rect(47.7, 5.6, 3.6, 7.4, { g: 1, b: 0.72, cyl: 'y', rim: 0.4 }),
    rect(38.1, 13.0, 13.2, 1.0, { g: 1, b: 0.75 }),
    // chimney with flared brass cap, domes, whistle
    poly([[47.8, 5.8], [47.8, 2.0], [49.4, 2.0], [49.4, 5.8]], { g: 1, b: 0.7, cyl: 'x' }),
    poly([[47.0, 0.5], [50.2, 0.5], [49.4, 2.2], [47.8, 2.2]], { g: 2, b: 0.85, cyl: 'x', rim: 0.4 }),
    ell(41.6, 4.7, 2.2, 2.1, { g: 2, b: 0.92, rim: 0.3 }), rect(40.3, 6.2, 2.6, 0.8, { g: 2, b: 0.8 }),
    ell(44.0, 5.0, 1.4, 1.3, { g: 0, b: 0.9, rim: 0.3 }),
    line([[43.0, 5.8], [43.0, 3.6]], 0.7, { g: 2 }), ell(43.0, 3.4, 0.55, 0.55, { g: 2 }),
    // headlamp, buffer beam, pilot
    line([[50.4, 5.8], [50.4, 4.8]], 0.6, { g: 1 }),
    ell(50.4, 3.8, 1.2, 1.2, { g: 5, b: 1, fx: () => 1 }),
    rect(51.0, 12.8, 0.8, 4.0, { g: 4, b: 0.85 }),
    poly([[50.0, 17.0], [52, 17.0], [52, 20], [48.4, 20]], { g: 1, b: 0.55 }),
    // cylinder, piston rod
    rect(47.0, 13.6, 3.6, 2.6, { g: 1, b: 0.8, cyl: 'y', rim: 0.3 }), line([[47.0, 15.0], [51.0, 15.0]], 0.55, { g: 2, b: 0.8 }),
    // running gear
    ...dw.flatMap(cx => wheel(cx, cy, 3.0)), ...wheel(33.6, 18.5, 1.5), ...wheel(50.0, 18.5, 1.5),
    line([[dw[0], rodY], [dw[1], rodY]], 0.7, { g: 2, b: 0.82 }),
  ], { light: LIGHT })
  // the loco slides 2 cells left so its front clears x 430
  const G = grid(TW, TH)
  for (let y = 0; y < TH; y++) for (let x = 0; x < RW; x++) { const nx = x >= 29 ? x - 2 : x; if (nx < TW && R.s[y * RW + x] >= 0) { G.s[y * TW + nx] = R.s[y * RW + x]; G.g[y * TW + nx] = R.g[y * RW + x] } }
  return G
}
/** Split a grid by colour group: cells of group g only / everything else. */
const only = (G: Grid, g: number, keep: boolean): Grid => { const H = grid(G.w, G.h); for (let i = 0; i < G.s.length; i++) if (G.s[i] >= 0 && (G.g[i] === g) === keep) { H.s[i] = G.s[i]; H.g[i] = G.g[i] } return H }

// headlamp wedge: 3 rows at the lamp tapering to 1 (5 cells), brightness stepping down
function wedge(): Grid {
  const G = grid(6, TH + 1), S = [0.95, 0.8, 0.62, 0.46]
  for (let x = 0; x < 4; x++) for (const dy of x < 2 ? [-1, 0, 1] : [0]) G.s[(4 + dy) * 6 + x] = S[x] * (dy ? 0.8 : 1)
  ;[0.5, 0.42, 0.34, 0.27, 0.2, 0.15].forEach((v, x) => { G.s[20 * 6 + x] = v })
  ;[0.4, 0.3, 0.2].forEach((v, x) => { G.s[19 * 6 + x] = v })
  return G
}

// steam: idle puff frames (grid 8 x 9) and a tapered trail (grid 20 x 8, thick at the chimney, one row at the tail)
const BL = (cx: number, cy: number, rx: number, ry: number, b = 0.45) => ell(cx, cy, rx, ry, { b, rim: 0.12, fx: (_x, _y, s) => Math.min(0.8, s) })
function puff(k: number): Grid {
  const stem = BL(4, 8.3, 0.8, 0.9, 0.4)
  const S = [
    [BL(4, 8, 1.0, 0.8)],
    [BL(4.2, 7.2, 1.4, 1.1), stem],
    [BL(4.5, 6.2, 1.8, 1.4), BL(3.8, 7.4, 1.2, 1.0), stem],
    [BL(5, 5.2, 2.1, 1.5), BL(3.9, 6.4, 1.5, 1.2), BL(5.8, 6.2, 1.2, 1.0), stem],
    [BL(5.6, 4.0, 1.9, 1.2, 0.4), BL(4.4, 5.2, 1.2, 0.9, 0.4)],
  ][k]
  return raster(8, 9, S, { light: LIGHT })
}
function trail(f: number): Grid {
  const W = 14, H = 16, G = grid(W, H)
  for (let y = 0; y < H; y++) {
    const t = (H - 1 - y) / (H - 1), cx = 11.5 - 8.5 * Math.pow(t, 1.15) + Math.sin(t * 5 + f * 1.4) * 0.7, hw = 0.6 + 2.4 * Math.pow(t, 0.8) + (hash(y, 3 + f) - 0.5) * 0.7
    for (let x = 0; x < W; x++) {
      if (Math.abs(x + 0.5 - cx) > hw || (t > 0.5 && hash(x + f * 7, y) > 1.5 - t * 0.75)) continue
      G.s[y * W + x] = t < 0.3 ? 0.78 : t < 0.62 ? 0.52 : 0.3
      G.g[y * W + x] = 0
    }
  }
  return G
}
// ---- signal mast: 6 x 24 cells (12 px) ----
const sigBase = () => raster(7, 24, [
  line([[3.5, 6], [3.5, 24]], 1.0, { g: 0, b: 0.6 }),
  rect(1.5, 0, 4, 7.2, { g: 0, b: 0.55, rim: 0.35 }),
  rect(2.0, 6.9, 3, 0.6, { g: 0, b: 0.5 }),
], { light: LIGHT })
const lampG = (cy: number, s: number) => raster(7, 24, [ell(3.5, cy, 1.25, 1.25, { b: 1, fx: () => s })], { light: LIGHT })

// ---- far pine ----
function pine(w: number, h: number): Grid {
  const cx = w / 2, t = [[0.2, 0.42], [0.32, 0.7], [0.55, 0.95]]
  return raster(w, h, [
    rect(cx - 0.5, h * 0.86, 1, h * 0.14, { b: 0.4 }),
    ...t.map(([a, b], i) => poly([[cx, h * a - 0.4], [cx + w * (0.3 + i * 0.07), h * b], [cx - w * (0.3 + i * 0.07), h * b]], { b: 0.85, cyl: [cx, w * 0.34], rim: 0.3 })),
  ], { light: LIGHT })
}

// ---- right hillside (mid layer 12 px): 19 x 24 cells with a stone tunnel mouth; origin (1164, 600) ----
const HX = 1164, HY = 600, HW = 19, HH = 24
const PROF: Pt[] = [[0, 22.5], [1, 21], [2, 19], [3, 17], [4, 15], [5, 12.5], [6, 10.5], [7, 8.5], [8, 6.8], [9, 5], [10, 3.8], [11, 3], [12, 2.4], [13, 2], [14, 2], [15, 2], [16, 2.2], [17, 2.6], [18, 3.2], [19, 4]]
const topAt = (x: number) => { const i = Math.max(0, Math.min(PROF.length - 2, Math.floor(x))); return PROF[i][1] + (PROF[i + 1][1] - PROF[i][1]) * (x - PROF[i][0]) }
const OPX = 14.5, OPY = 12.5
function hillside(): { hill: Grid; inner: Grid } {
  const hill = raster(HW, HH, [poly([...PROF, [19, HH], [0, HH]], {
    g: 0, b: 0.7, fx: (x, y) => { const d = y + 0.5 - topAt(x + 0.5), n = hash(x * 3 + 1, y * 5 + 2); return q3(d < 2.2 ? 0.62 + n * 0.3 : d < 6 ? 0.42 + n * 0.3 : 0.2 + n * 0.3, 0.4, 0.62, 0.7) }
  })], { light: LIGHT })
  const inner = grid(HW, HH)
  for (let y = 0; y < HH; y++) for (let x = 0; x < HW; x++) {
    const cx = x + 0.5, cy = y + 0.5, i = y * HW + x
    const inCirc = (r: number) => cy < OPY && Math.hypot((cx - OPX) / r, (cy - OPY) / r) <= 1
    const outer = inCirc(4.6) || (cy >= OPY && cx > 9.8 && cx < 19 && cy < 22.9)
    const open = inCirc(3.5) || (cy >= OPY && cx > 11 && cx < 18 && cy < 22.9)
    if (outer && !open) {
      const ang = Math.atan2(cy - OPY, cx - OPX), blk = cy < OPY ? Math.floor((ang + Math.PI) / 0.34) : y
      const lit = cx < OPX ? 0.1 : 0
      hill.s[i] = q3(0.5 + ((blk * 7 + (cy < OPY ? 0 : x)) % 3) * 0.2 - lit * -1, 0.5, 0.68, 0.84); hill.g[i] = 1
      if (cy < OPY && Math.abs(cx - OPX) < 0.8 && cy < OPY - 3.9) hill.s[i] = 0.95
    }
    if (open) {
      hill.s[i] = -1
      const dep = (cy - 9) / 14
      inner.s[i] = 0.22 + 0.1 * hash(x, y) + (cx < 13 ? 0.04 : 0) - dep * 0.06; inner.g[i] = 0
    }
  }
  return { hill, inner }
}

// embankment under the right-hand track (12 px, 18 x 3): slopes up from the left end
function bank(): Grid {
  const W = 18, H = 3, G = grid(W, H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (y < 2 - x) continue; G.s[y * W + x] = q3(y === 0 ? 0.62 : 0.22 + hash(x, y) * 0.5, 0.4, 0.58, 0.8); G.g[y * W + x] = 0 }
  return G
}

// ---- left platform wall (12 px): 36 x 5, ashlar courses ----
function platform(): Grid {
  const W = 34, G = grid(W, 3)
  for (let y = 0; y < 3; y++) for (let x = 0; x < W; x++) {
    const blk = Math.floor((x + (y % 2) * 2) / 3)
    G.s[y * W + x] = y === 0 ? 0.55 : q3(0.2 + hash(blk, y + 7) * 0.7 - ((x + (y % 2) * 2) % 3 === 2 ? 0.12 : 0), 0.4, 0.62, 0.84)
    G.g[y * W + x] = 0
  }
  return G
}
// rail row (+ sleepers) over a span of cells
function rails(w: number, sleepers: boolean): Grid {
  const G = grid(w, sleepers ? 2 : 1)
  for (let x = 0; x < w; x++) { G.s[x] = 0.62; if (sleepers) G.s[w + x] = x % 2 ? 0.3 : 0.18 }
  return G
}

// ---- ridge band (8 px tiles along the top of a far hill) ----
function ridge(pts: Pt[], x0: number, x1: number, rows: number): { g: Grid; oy: number } {
  const at = (x: number) => { for (let i = 0; i < pts.length - 1; i++) if (x <= pts[i + 1][0]) return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); return pts[pts.length - 1][1] }
  const W = Math.ceil((x1 - x0) / 8), ys: number[] = []
  for (let i = 0; i < W; i++) ys.push(at(x0 + i * 8 + 4))
  const mn = Math.min(...ys), oy = Math.floor(mn / 8) * 8, H = Math.ceil((Math.max(...ys) - oy) / 8) + rows
  const G = grid(W, H)
  for (let i = 0; i < W; i++) { const r0 = Math.floor((ys[i] - oy) / 8); for (let r = 0; r < rows; r++) { G.s[(r0 + r) * W + i] = q3([0.78, 0.55, 0.3][r] + (hash(i, r) - 0.5) * 0.3, 0.42, 0.66, 0.84); G.g[(r0 + r) * W + i] = 0 } }
  return { g: G, oy }
}
const polyPath = (pts: Pt[], x0: number, x1: number, yb: number) => `M${x0} ${yb}L${pts.map(p => p.join(' ')).join('L')}L${x1} ${yb}Z`

// ---- near foreground band (16 px), ragged top ----
function turf(w: number, seed: number): Grid {
  const G = grid(w, 3), r = lcg(seed)
  for (let x = 0; x < w; x++) { const top = x % 3 === 1 ? 1 : 0; for (let y = top; y < 3; y++) { G.s[y * w + x] = r() < 0.5 ? 0.3 : 0.6; G.g[y * w + x] = 0 } }
  return G
}
function bird(up: boolean): Grid {
  return raster(10, 6, [
    line(up ? [[0.3, 0.8], [3, 2.8], [5, 3.6]] : [[0.3, 3.8], [3, 2.2], [5, 2.8]], 1.9, { b: 0.95 }),
    line(up ? [[5, 3.6], [7, 2.8], [9.7, 0.8]] : [[5, 2.8], [7, 2.2], [9.7, 3.8]], 1.9, { b: 0.85 }),
    ell(5, 3.2, 1.4, 1, { b: 0.9 }),
  ], { light: LIGHT })
}

/** Per-row staggered fade: cells thin out over from..to (px); dir 'L' fades toward +x (left block), 'R' toward -x (right block). */
function fadeG(G: Grid, x0: number, c: number, from: number, to: number, dir: 'L' | 'R'): Grid {
  for (let i = 0; i < G.s.length; i++) {
    if (G.s[i] < 0) continue
    const col = i % G.w, row = Math.floor(i / G.w), px = x0 + col * c + c / 2
    const t = dir === 'L' ? (px - from) / (to - from) : (to - px) / (to - from)
    if (t >= 1 || t > 0 && hash(row * 3 + 1, col) < Math.min(1, t) + (hash(row, 99) - 0.5) * 0.3 * (t > 0 ? 1 : 0)) G.s[i] = -1
  }
  return G
}
const TX = 12, TY = 704 // train origin; rail row below at y 864

export function glyphTrainScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  materials()
  const T = 12.2, DX = 1608, DELAY = -6.15

  // ---- the train ----
  const frames = busy ? [train(0), train(1)] : [train(0)]
  const trainT = tiles(frames.map(g => only(g, 3, false)), { c: 8, x: TX, y: TY, mats: TM, dur: 0.5, shimmer: 6, seed: 4 }) + tiles(only(frames[0], 3, true), { c: 8, x: TX, y: TY, mats: TM, ramp: ' .:', shimmer: 0 })
  const wedgeT = D(tiles(wedge(), { c: 8, x: TX + TW * 8, y: TY, mats: ['bw'], ramp: ' .:-=+', shimmer: 0 }))
  const lampX = TX + 48.4 * 8, lampY = TY + 3.8 * 8
  const lampHaloL = L(`<circle cx="${lampX + 4}" cy="${lampY}" r="34" fill="url(#hlL)" opacity=".5"/>`)
  const lampHaloD = D(`<circle cx="${lampX + 10}" cy="${lampY}" r="52" fill="url(#hlD)" opacity=".6"/>`)
  const chX = TX + 46.6 * 8, chY = TY + 0.5 * 8
  const trailT = tiles([trail(0), trail(1)], { c: 12, x: chX - 11.5 * 12, y: chY - 16 * 12 + 8, mats: ['sm'], dur: 1.1, ramp: ' .:-=+*o', shimmer: 4, seed: 3 })
  const colF = (k: number) => { const G = grid(3, 5); ;[[1, 4, 0.78], [1 + (k ? 1 : 0), 3, 0.55], [1 + (k ? 1 : -1) * (k === 2 ? 0 : 1), 2, 0.34]].forEach(([x, y, v]) => { G.s[y * 3 + x] = v; G.g[y * 3 + x] = 0 }); return G }
  const idleCol = busy ? '' : tiles([colF(0), colF(1), colF(2), colF(1)], { c: 12, x: chX - 18, y: chY - 52, mats: ['sm'], dur: 3.2, ramp: ' .:-=+*o', shimmer: 3, seed: 5 })
  const bright = `<g>${'<set attributeName="filter" to="url(#lb)" begin="trHit.click" dur=".3s"/>'}${trainT}</g>`
  const shadow = `<rect x="${TX}" y="876" width="${TW * 8}" height="8" rx="3" fill="#0a1218" opacity=".38"/>`
  const jetG = (() => { const G = grid(4, 4); ;[[3, 3, 0.85], [2, 2, 0.7], [2, 1, 0.5]].forEach(([x, y, v]) => { G.s[y * 4 + x] = v; G.g[y * 4 + x] = 0 }); return G })()
  const jet = `<g opacity="0"><animate attributeName="opacity" values="1;1" dur=".55s" begin="trHit.click"/>${tiles(jetG, { c: 8, x: TX + 41 * 8 - 12, y: TY + 3 * 8 - 28, mats: ['sm'], ramp: ' .:-=+*o' })}</g>`
  const leak = busy ? '' : tiles([puff(0), grid(8, 9), grid(8, 9), grid(8, 9), puff(1), puff(2), grid(8, 9), grid(8, 9)].map((g, i) => g), { c: 8, x: TX + 41 * 8, y: TY + 12 * 8 - 70, mats: ['sm'], dur: 6, delay: -2, ramp: ' .:-=+*o' })
  const hop = (inner: string) => `<g>${on('trHit', 'translate', '0 0;0 -12;0 0', 0.5, { keyTimes: '0;.4;1', discrete: true })}${inner}</g>`
  const trainFull = hop(shadow + bright + jet + leak + wedgeT + lampHaloL + lampHaloD + (busy ? trailT : idleCol))

  // whistle: 17 tiles scattered up and left from the whistle, 2 sizes, several tones and glyph densities, 6 with trailing tiles
  const WV: [string, string, string, number][] = [['bg3', 'bgt3', 'o', 22], ['sm3', 'smt3', '*', 16], ['bg2', 'bgt2', '+', 12], ['sm2', 'smt2', ':', 16], ['bg3', 'bgt3', '=', 12], ['sm1', 'smt1', '.', 12], ['sm3', 'smt3', '#', 22], ['bg1', 'bgt1', '%', 16]]
  const wdefs = WV.map(([bg, fg, ch, k], i) => `<g id="wv${i}"><rect class="tb ${bg}" x="${-(k - 3) / 2}" y="${-(k - 3) / 2}" width="${k - 3}" height="${k - 3}" stroke-width="${k >= 16 ? 3 : 2}" stroke-linejoin="round"/><text class="${fg}" y="${k * 0.31}" font-size="${k * 0.95}">${ch}</text></g>`).join('')
  const wr = lcg(17)
  let whist = ''
  for (let i = 0; i < 23; i++) {
    const a = -Math.PI * (85 + 55 * wr()) / 180, d = 50 + 220 * wr(), dx = Math.cos(a) * d, dy = Math.sin(a) * d, t = 0.35 + 0.25 * wr(), v = i < 6 ? [0, 6, 0, 1, 7, 3][i] : Math.floor(wr() * WV.length)
    const tile = (px: number, py: number, vv: number, tt: number, delay: number, op: string) => `<g opacity="0"><animateMotion path="M0 0L${px.toFixed(1)} ${py.toFixed(1)}" dur="${tt.toFixed(2)}s" begin="trHit.click${delay ? '+' + delay + 's' : ''}" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".1 .9 .3 1"/><animate attributeName="opacity" values="0;${op};${op};0" keyTimes="0;.12;.7;1" dur="${(tt + 0.35).toFixed(2)}s" begin="trHit.click${delay ? '+' + delay + 's' : ''}"/><use href="#wv${vv}"/></g>`
    whist += tile(dx, dy, v, t, 0, '1')
    if (i < 7) whist += tile(dx * 0.55, dy * 0.55, 5, t, 0.06, '.6')
  }
  const flashC = (g: string, a: number) => `<circle r="0" opacity="0" fill="url(#${g})"><animate attributeName="r" values="0;80" dur=".45s" begin="trHit.click"/><animate attributeName="opacity" values="0;${a};0" dur=".45s" begin="trHit.click"/></circle>`
  const whistle = `<g transform="translate(${TX + 41 * 8 + 4} ${TY + 3 * 8})">${L(flashC('hlL', 0.95)) + D(flashC('hlD', 1))}${whist}</g>`

  const tm = `mask="url(#tm)"`
  const trainMove = move(`<g class="tfdc" style="animation:tfd ${T}s linear ${DELAY}s infinite">${trainFull}</g>`, { dx: DX, c: 8, dur: T, delay: DELAY })
  const trainLayer = busy ? `<g ${tm}>${trainMove}</g>` : trainFull

  // ---- station (far layer 8 px, behind the train) ----
  const house = (() => {
    const wallFx = (_x: number, y: number, s: number) => s * (y % 2 ? 0.88 : 1)
    const roofFx = (_x: number, y: number, s: number) => s * (y % 2 ? 0.8 : 1.05)
    return raster(20, 22, [
      rect(14, 1.2, 2, 4.4, { g: 3, b: 0.7, cyl: 'x', rim: 0.3 }),
      poly([[10, 0.4], [20, 10], [0, 10]], { g: 1, b: 0.7, fx: roofFx, rim: 0.3 }),
      line([[0.3, 9.6], [10, 0.6], [19.7, 9.6]], 1.1, { g: 1, b: 0.45 }),
      rect(2, 10, 16, 12, { g: 0, b: 0.82, fx: wallFx, rim: 0.2, ao: 1 }),
      rect(4.2, 11.8, 5.6, 6.2, { g: 4, b: 0.5 }),
      rect(5, 12.5, 4, 4.8, { g: 2, b: 1, fx: (x: number, _y: number, s: number) => (x === 6 || x === 7 ? 0.5 : Math.min(1, s)) }),
      rect(13, 13, 3, 9, { g: 4, b: 0.55 }),
    ], { light: LIGHT })
  })()
  const houseT = tiles(house, { c: 8, x: 44, y: 596, mats: ['hs', 'hr', 'wd', 'sn', 'bk'], shimmer: 5, seed: 6 })
  const post = raster(5, 16, [line([[2.5, 3], [2.5, 16]], 1, { g: 0, b: 0.55 }), rect(0.5, 0.2, 4, 3.2, { g: 1, b: 1, fx: () => 0.9 }), poly([[0, 0.4], [2.5, -0.8], [5, 0.4]], { g: 0, b: 0.6 })], { light: LIGHT })
  const postT = `<g style="animation:flk 3.1s steps(1) infinite">${tiles(post, { c: 8, x: 226, y: 648, mats: ['bk', 'wd'] })}</g>`
  const wf = (k: number) => { const G = grid(5, 7); ;[[1, 6, 0.6], [1 + k, 5, 0.5], [2 + k, 4, 0.4], [2, 3, 0.3], [3 - k, 2, 0.22]].forEach(([x, y, v]) => { G.s[y * 5 + x] = v; G.g[y * 5 + x] = 0 }); return G }
  const wisp = busy ? tiles([wf(0), wf(1)], { c: 8, x: 156, y: 548, mats: ['sm'], dur: 2.6, ramp: ' .:-=', shimmer: 2, seed: 8 }) : ''
  const sg = sigBase(), sx = 258, sy = 486
  const sigMast = tiles(sg, { c: 12, x: sx, y: sy, mats: ['bk'], shimmer: 2, seed: 2 })
  const redOn = busy ? 0 : 1
  // four lamp layers: red lit/dim, green lit/dim; the one that is on at rest stays, the click swaps for 3 s
  const lampTiles = (c: 'r' | 'g', lit: boolean) => tiles(lampG(c === 'r' ? 1.7 : 5.0, lit ? 0.92 : 0.3), { c: 12, x: sx, y: sy, mats: [c === 'r' ? (lit ? 'rd' : 'rx') : (lit ? 'gn' : 'gx')] })
  const lampLayer = (c: 'r' | 'g', lit: boolean) => {
    const base = (c === 'r') === !!redOn ? lit : !lit // red lamp lit at rest in idle; green lit at rest in busy
    return `<g opacity="${base ? 1 : 0}"><animate attributeName="opacity" values="${base ? 0 : 1};${base ? 0 : 1}" dur="3s" begin="sigHit.click"/>${lampTiles(c, lit)}</g>`
  }
  const sigLamps = lampLayer('r', true) + lampLayer('r', false) + lampLayer('g', true) + lampLayer('g', false)
  const lampHalo = (cy: number, id: string, col: string, shown: boolean) => `<circle cx="${sx + 42}" cy="${sy + cy * 12}" r="${id === 'hlR' ? 70 : 62}" fill="url(#${id})" opacity="${shown ? 0.85 : 0}"><animate attributeName="opacity" values="${shown ? 0 : 0.85};${shown ? 0 : 0.85}" dur="3s" begin="sigHit.click"/></circle>`
  const sigHalos = D(lampHalo(1.7, 'hlR', '', !!redOn) + lampHalo(5.0, 'hlG', '', !redOn)) + L(lampHalo(1.7, 'hlRL', '', !!redOn) + lampHalo(5.0, 'hlGL', '', !redOn))
  const winHalo = D(`<circle cx="${44 + 7 * 8 + 4}" cy="${596 + 14.9 * 8}" r="52" fill="url(#hlD)" opacity=".45"/><circle cx="${226 + 20}" cy="${648 + 14}" r="40" fill="url(#hlD)" opacity=".5"/>`)

  // ---- hills, pines, ground bands ----
  const RA_L: Pt[] = [[0, 640], [90, 600], [200, 636], [300, 612], [380, 640], [460, 668]]
  const RB_L: Pt[] = [[0, 714], [110, 696], [230, 724], [340, 700], [440, 728], [470, 740]]
  const RA_R: Pt[] = [[1140, 700], [1250, 690], [1392, 700], [1450, 654], [1520, 624], [1600, 664]]
  const RB_R: Pt[] = [[1392, 774], [1470, 742], [1560, 754], [1600, 772]]
  const rl_a = ridge(RA_L, 0, 460, 2), rl_b = ridge(RB_L, 0, 470, 3), rr_a = ridge(RA_R, 1140, 1600, 2), rr_b = ridge(RB_R, 1392, 1600, 3)
  const ridgeT = (r: { g: Grid; oy: number }, x0: number, m: string) => tiles(fadeG(r.g, x0, 8, x0 < 600 ? 370 : 1150, x0 < 600 ? 450 : 1230, x0 < 600 ? 'L' : 'R'), { c: 8, x: x0, y: r.oy, mats: [m], ramp: ' .:-=', shimmer: 0 })
  const farHills = `<g mask="url(#bm)"><path d="${polyPath(RA_L, 0, 460, 880)}" class="fa"/><path d="${polyPath(RB_L, 0, 470, 880)}" class="fb"/><path d="${polyPath(RA_R, 1140, 1600, 960)}" class="fa"/><path d="${polyPath(RB_R, 1392, 1600, 960)}" class="fb"/></g>` +
    ridgeT(rl_a, 0, 'h2') + ridgeT(rl_b, 0, 'hg') + ridgeT(rr_a, 1140, 'h2') + ridgeT(rr_b, 1392, 'hg')
  const farPine = (x: number, y: number, w: number, h: number) => tiles(pine(w, h), { c: 8, x, y, mats: ['pn'], ramp: ' .:-=+', shimmer: 1, seed: x })
  const pinesL = ''
  const pinesR = farPine(1500, 584, 6, 11) + farPine(1540, 602, 5, 9)
  const hs = hillside()
  const hillT = tiles(hs.hill, { c: 12, x: HX, y: HY, mats: ['hg', 'sn'], ramp: ' .:-=+', shimmer: 6, seed: 9 })
  const ox = HX + 11 * 12, oy = HY + 9 * 12, ow = 7 * 12
  const innerT0 = `<path class="tin" d="M${ox} ${HY + 22 * 12}V${HY + 12.5 * 12}A${ow / 2} ${ow / 2} 0 0 1 ${ox + ow} ${HY + 12.5 * 12}V${HY + 22 * 12}Z"/>`
  const innerT = innerT0 + ''
  const innerG = grid(7, 13)
  ;[[1, 12, 0.5], [2, 12, 0.6], [3, 12, 0.5], [4, 12, 0.6], [5, 12, 0.5]].forEach(([x, y, v]) => { innerG.s[y * 7 + x] = v; innerG.g[y * 7 + x] = 1 })
  ;[[3, 5], [2, 8], [4, 8], [3, 10], [1, 10], [5, 6]].forEach(([x, y]) => { innerG.s[y * 7 + x] = 0.34; innerG.g[y * 7 + x] = 0 })
  const innerTiles = tiles(innerG, { c: 12, x: ox, y: oy, mats: ['ti', 'rl'], ramp: ' .:-=' })
  const midPine = (cx: number, h: number) => tiles(pine(7, h), { c: 12, x: HX + (cx - 3.5) * 12, y: HY + (topAt(cx) + 1.2 - h) * 12, mats: ['pn'], shimmer: 2, seed: cx })
  const pinesHill = midPine(5.2, 11)
  const railL = tiles(rails(35, false), { c: 12, x: 0, y: 864, mats: ['rl'], ramp: ' .:-=+' })
  const railR = tiles(rails(14, true), { c: 12, x: 1432, y: 864, mats: ['rl'], ramp: ' .:-=+' })
  const railV = tiles(rails(17, true), { c: 12, x: 1392, y: 864, mats: ['rl'], ramp: ' .:-=+' })
  const abut = tiles(bank(), { c: 12, x: 1392, y: 888, mats: ['pf'], shimmer: 0 })
  const platT = tiles(platform(), { c: 12, x: 12, y: 876, mats: ['pf'], shimmer: 0 })
  const platShadow = D('<rect x="12" y="912" width="408" height="14" rx="5" fill="#02050a" opacity=".55"/>') + L('<rect x="12" y="912" width="408" height="10" rx="5" fill="#3a2f28" opacity=".16"/>')
  const turfL = tiles(turf(28, 5), { c: 16, x: 0, y: 944, mats: ['tg'], ramp: ' .', shimmer: 0 })
  const turfR = tiles(turf(30, 8), { c: 16, x: 1136, y: 944, mats: ['tg'], ramp: ' .', shimmer: 0 })

  const birds = [[70, 130, 8, 192, 70, -10], [1260, 170, 8, 160, 60, -25]].map(([x, y, c, dx, dur, dl], i) =>
    move(tiles([bird(true), bird(false)], { c, x, y, mats: ['gu'], ramp: ' .~-=', dur: 1.2 + i * 0.2 }), { dx, c, dur, delay: dl, fade: true })).join('')

  // ---- high far layer (8 px): far viaduct with a tiny train, sun (light), moon + village windows (dark) ----
  const fv = grid(40, 5)
  for (let x = 0; x < 40; x++) { fv.s[x] = 0.78; fv.g[x] = 0; for (let y = 1; y < 5; y++) { const pier = x % 10 < 2, ax = Math.floor(x / 10) * 10 + 6, open = !pier && (y >= 3 || Math.hypot(x + 0.5 - ax, y + 0.5 - 3.2) < 2.6); if (!open) { fv.s[y * 40 + x] = 0.42; fv.g[y * 40 + x] = 0 } } }
  const farVia = tiles(fv, { c: 8, x: 1170, y: 392, mats: ['fv'], ramp: ' .:-', shimmer: 0 })
  const piers = [1252, 1332, 1412].map(x => `<rect x="${x}" y="424" width="10" height="280" fill="url(#pvX)"/>`).join('')
  const mini = grid(14, 5)
  for (let x = 0; x < 14; x++) for (const y of [3, 4]) if (x % 4 !== 3 || y === 4) { mini.s[y * 14 + x] = x < 10 ? 0.85 : 0.55; mini.g[y * 14 + x] = x < 10 ? 0 : 1 }
  for (let x = 1; x < 10; x += 4) { mini.s[3 * 14 + x] = 0.85; mini.g[3 * 14 + x] = 2 }
  mini.s[2 * 14 + 12] = 0.6; mini.g[2 * 14 + 12] = 1; mini.s[3 * 14 + 13] = 1; mini.g[3 * 14 + 13] = 3
  ;[[11, 1, 0.5], [10, 0, 0.35], [8, 1, 0.3]].forEach(([x, y, v]) => { mini.s[y * 14 + x] = v; mini.g[y * 14 + x] = 4 })
  const miniT = move(tiles(mini, { c: 8, x: 1170, y: 368, mats: ['cr', 'bk', 'wd', 'bw', 'sm'], ramp: ' .:', shimmer: 0 }), { dx: 288, c: 8, dur: 36, delay: busy ? -16.5 : -9, fade: true })
  const sunG = grid(11, 11)
  for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) if (Math.hypot(x - 4.5, y - 4.5) <= 5.2) { sunG.s[y * 11 + x] = Math.max(0.3, 0.95 - Math.hypot(x - 3.5, y - 3.5) * 0.09); sunG.g[y * 11 + x] = 0 }
  const sunT = L(`<circle cx="1516" cy="262" r="96" fill="url(#hlL)" opacity=".45"/>` + tiles(sunG, { c: 8, x: 1472, y: 218, mats: ['su'], ramp: ' .:-=+', shimmer: 3, seed: 12 }))
  const moonG = grid(10, 10)
  for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (Math.hypot(x - 4.5, y - 4.5) <= 4.6 && Math.hypot(x - 6.8, y - 3.6) > 3.9) { moonG.s[y * 10 + x] = 0.9 - Math.hypot(x - 2, y - 5) * 0.08; moonG.g[y * 10 + x] = 0 }
  const vw = D(tiles((() => { const G = grid(40, 8), at = (x: number) => { for (let i = 0; i < RA_L.length - 1; i++) if (x <= RA_L[i + 1][0]) return RA_L[i][1] + (RA_L[i + 1][1] - RA_L[i][1]) * (x - RA_L[i][0]) / (RA_L[i + 1][0] - RA_L[i][0]); return 668 }; ;[14, 22, 214, 230, 310, 326, 350, 372].forEach(x => { const y = Math.round((at(x) + 10 - 596) / 8); G.s[y * 40 + Math.floor(x / 8)] = 0.9; G.g[y * 40 + Math.floor(x / 8)] = 0 }); return G })(), { c: 8, x: 0, y: 596, mats: ['wd'], ramp: ' ', shimmer: 0 }))
  const moonT = D(`<circle cx="1440" cy="130" r="90" fill="url(#hlM)" opacity=".5"/>` + tiles(moonG, { c: 8, x: 1400, y: 90, mats: ['mo'], ramp: ' .:-=', shimmer: 0 }))
  const farTop = `<g class="pl-ft">${L(piers.replace('pvX', 'pvL'))}${D(piers.replace('pvX', 'pvD'))}${farVia}${miniT}${sunT}${moonT}</g>`

  // ---- effects and hits (last) ----
  const hz = busy ? `clip-path="url(#hz)"` : ''
  const hitTrain = `<g ${hz}>${move(hit('trHit', TX - 4, TY - 8, 404, 172, '#fff0cc'), { dx: busy ? DX : 0, c: 8, dur: T, delay: DELAY })}</g>`
  const trainFx = move(whistle, { dx: busy ? DX : 0, c: 8, dur: T, delay: DELAY })
  const mvCls = [trainMove, hitTrain, trainFx].map(x => /class="(mv\d+)"/.exec(x)![1])
  const phoneBusy = busy ? mvCls.map(c => `.${c}{animation:mvph 7s steps(56,end) 1s infinite}`).join('') + `@keyframes mvph{from{transform:translate(900px,0)}to{transform:translate(1348px,0)}}.tfdc{animation:tfd 7s linear 1s infinite !important}` : ''
  const sigFx = `<g class="pl-st">` +
    `<g opacity="0"><circle cx="${sx + 42}" cy="${sy + 40}" r="70" fill="url(#hlR)"/>${on('sigHit', 'opacity', '0;1;0;0.8;0', 0.7)}</g>` +
    burst('sigHit', { x: sx + 42, y: sy + 40, tiles: [['rd3', 'rdt3', '*', 16], ['gn3', 'gnt3', '+', 12]], n: 16, r: 86, ring: true, flash: '#ffd9a0', dur: 0.6, seed: 3 }) +
    hit('sigHit', sx - 6, sy - 6, 96, 96, '#ffe8c0') + '</g>'

  const body = ground({
    L: { sky: ['#bcd8e4', '#d9e6dc', '#efe6c4'], grid: 'rgba(50,100,80,.1)', dust: '#2c4a3a', glows: [[800, 990, 640, '#f2e4b0', 0.5]] },
    D: { sky: ['#040816', '#08122a', '#10244a'], grid: 'rgba(140,170,230,.07)', dust: '#a6bcf0', glows: [[1400, 520, 700, '#1c3a6a', 0.3], [220, 300, 520, '#16305a', 0.3]] },
    n: 22, seed: 7, edge: 0.25, mid: 0.08, gridMask: 'gm',
    zones: [[1100, 40, 1580, 440], [30, 30, 430, 330], [30, 440, 400, 590]],
  }) +
    D(dust({ n: 12, seed: 21, cls: 'stz', chars: '.+*.', edge: 0.8, mid: 0.1, zones: [[1180, 60, 1560, 300], [90, 60, 400, 300]] })) +
    `<g class="L">${birds}</g>${farTop}` +
    `<g class="pl-fl">${farHills}${pinesL}${vw}</g><g class="pl-fr">${pinesR}</g>` +
    `<g class="pl-st">${winHalo}${houseT}${wisp}${postT}${sigMast}${sigHalos}${sigLamps}</g>` +
    `<g class="pl-tn">${D('<circle cx="1338" cy="810" r="70" fill="url(#hlD)" opacity=".3"/>')}${railV}${abut}${innerT}${innerTiles}</g>` +
    `<g class="pl-st">${railL}${platT}${platShadow}</g><g class="pl-tr">${trainLayer}</g>` +
    `<g class="pl-tn">${hillT}${pinesHill}</g>` +
    `<g class="pl-fl"><g mask="url(#tf)">${turfL}</g></g><g class="pl-tn"><g mask="url(#tf)">${turfR}</g></g>` +
    `<g class="pl-tr">${trainFx}</g><g class="pl-tr">${hitTrain}</g>` + sigFx

  const stops = (a: string, b: string) => `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>`
  return frame(body, {
    defs: wdefs +
      `<linearGradient id="tinL" x1="0" y1="0" x2="1" y2="0">${stops('#2c3860', '#161e38')}</linearGradient><linearGradient id="tinD" x1="0" y1="0" x2="1" y2="0">${stops('#0e1626', '#050912')}</linearGradient>` +
      `<linearGradient id="fhA" x1="0" y1="0" x2="0" y2="1">${stops('#b4d6a8', '#9ccb92')}</linearGradient><linearGradient id="fhB" x1="0" y1="0" x2="0" y2="1">${stops('#86bb7a', '#62a066')}</linearGradient><linearGradient id="fhAd" x1="0" y1="0" x2="0" y2="1">${stops('#14344a', '#0e2638')}</linearGradient><linearGradient id="fhBd" x1="0" y1="0" x2="0" y2="1">${stops('#0e2c36', '#081c26')}</linearGradient>` +
      `<linearGradient id="pvL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6648" stop-opacity=".95"/><stop offset="1" stop-color="#4a8a62" stop-opacity=".25"/></linearGradient><linearGradient id="pvD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e2a40" stop-opacity=".95"/><stop offset="1" stop-color="#0c2a3a" stop-opacity=".2"/></linearGradient><radialGradient id="hlM"><stop offset="0" stop-color="#8fa8e8" stop-opacity=".5"/><stop offset="1" stop-color="#5f78b8" stop-opacity="0"/></radialGradient><radialGradient id="hlL"><stop offset="0" stop-color="#e8a020" stop-opacity=".9"/><stop offset="1" stop-color="#c46a10" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="hlD"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset=".4" stop-color="#ffb04a" stop-opacity=".4"/><stop offset="1" stop-color="#ff9a30" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="hlR"><stop offset="0" stop-color="#ff3320" stop-opacity="1"/><stop offset=".5" stop-color="#ff2a1a" stop-opacity=".45"/><stop offset="1" stop-color="#e01808" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="hlG"><stop offset="0" stop-color="#7affa0" stop-opacity=".9"/><stop offset="1" stop-color="#30c060" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="hlRL"><stop offset="0" stop-color="#d03030" stop-opacity=".7"/><stop offset="1" stop-color="#a01820" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="hlGL"><stop offset="0" stop-color="#20a050" stop-opacity=".7"/><stop offset="1" stop-color="#107038" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="tfg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset=".235" stop-color="#fff"/><stop offset=".28" stop-color="#000"/><stop offset=".72" stop-color="#000"/><stop offset=".76" stop-color="#fff"/></linearGradient><mask id="tf" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#tfg)"/></mask><linearGradient id="gmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset=".26" stop-color="#fff"/><stop offset=".34" stop-color="#0c0c0c"/><stop offset=".66" stop-color="#0c0c0c"/><stop offset=".74" stop-color="#fff"/></linearGradient><mask id="gm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#gmg)"/></mask>` +
      `<linearGradient id="bmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset=".23" stop-color="#fff"/><stop offset=".29" stop-color="#000"/><stop offset=".7" stop-color="#000"/><stop offset=".76" stop-color="#fff"/></linearGradient><mask id="bm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#bmg)"/></mask>` +
      `<linearGradient id="tmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset=".265" stop-color="#fff"/><stop offset=".285" stop-color="#000"/><stop offset=".8075" stop-color="#000"/><stop offset=".81" stop-color="#fff"/></linearGradient><mask id="tm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#tmg)"/></mask>` +
      `<filter id="lb"><feComponentTransfer><feFuncR type="linear" slope="1.5" intercept=".06"/><feFuncG type="linear" slope="1.5" intercept=".06"/><feFuncB type="linear" slope="1.5" intercept=".06"/></feComponentTransfer></filter><clipPath id="hz"><rect x="0" y="600" width="448" height="300"/><rect x="1296" y="600" width="304" height="300"/></clipPath>`,
    css: `@keyframes flk{0%{opacity:1}30%{opacity:.55}34%{opacity:1}70%{opacity:.75}74%{opacity:1}}.tin{fill:url(#tinL)}.fa{fill:url(#fhA)}.fb{fill:url(#fhB)}@keyframes tfd{0%{opacity:0}1.5%{opacity:1}98.5%{opacity:1}100%{opacity:0}}`,
    dark: `.tin{fill:url(#tinD)}.stz{fill:#d4e4f8}.fa{fill:url(#fhAd)}.fb{fill:url(#fhBd)}`,
    phone: phoneBusy + `.pl-st{transform:translate(560px,-390px)}.pl-tr{transform:translate(${busy ? '-575px,0' : '560px,-390px'})}.pl-tn{transform:translate(-575px,0)}.pl-fl,.pl-fr,.pl-ft{display:none}`,
  })
}
