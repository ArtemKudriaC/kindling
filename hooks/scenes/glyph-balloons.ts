// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Glyph balloons (Шары): three hot-air balloons on three depth layers over rolling hills of shaded tiles.
// Light: late morning, saturated gores, crisp sun side. Dark: night, envelopes dark and lit from within by the burner.
import type { Grid, Pt } from './glyph-kit'
import { burst, D, ell, frame, grid, ground, hit, L, line, mat, move, on, poly, raster, rect, tiles, dust } from './glyph-kit'

const LIGHT: Pt = [-0.75, -0.55]
const LV = (() => { const l = Math.hypot(0.75, 0.55, 0.62); return [-0.75 / l, -0.55 / l, 0.62 / l] })()
const hash = (x: number, y: number) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000 / 1000
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))

function materials(): void {
  // balloon fabric: light is saturated, dark is a cold dim blue (the burner glow is a separate overlay)
  mat('cr', { lo: '#94201a', hi: '#ff9272', ink: '#470c07' }, { lo: '#0c1022', hi: '#3a2c4a', ink: '#c89aa8' })
  mat('cm', { lo: '#b87c70', hi: '#f8dcc2', ink: '#5a3438' }, { lo: '#0e1428', hi: '#46568a', ink: '#b4c4f0' })
  mat('mu', { lo: '#9a5a08', hi: '#ffd860', ink: '#442802' }, { lo: '#0e1024', hi: '#4a4a4c', ink: '#d8c890' })
  mat('tl', { lo: '#064a5c', hi: '#54d8c6', ink: '#04262c' }, { lo: '#081428', hi: '#245878', ink: '#98d8e8' })
  // glow overlay (night): the same fabric colours lit from inside
  mat('gcr', { lo: '#7a2418', hi: '#ffb36e', ink: '#3a0c06' }, { lo: '#7a2418', hi: '#ffb36e', ink: '#3a0c06' })
  mat('gcm', { lo: '#a8643a', hi: '#fff2c4', ink: '#5a2c10' }, { lo: '#a8643a', hi: '#fff2c4', ink: '#5a2c10' })
  mat('gmu', { lo: '#c88a10', hi: '#fff6a0', ink: '#5a3004' }, { lo: '#c88a10', hi: '#fff6a0', ink: '#5a3004' })
  mat('gtl', { lo: '#1a8a78', hi: '#b8f4d8', ink: '#063a34' }, { lo: '#1a8a78', hi: '#b8f4d8', ink: '#063a34' })
  mat('sk', { lo: '#483846', hi: '#dc9c7c', ink: '#1e1218' }, { lo: '#2a1a30', hi: '#8a4a30', ink: '#e0a070' })
  mat('rp', { lo: '#4a3626', hi: '#b8946a', ink: '#20140c' }, { lo: '#2e2630', hi: '#80603c', ink: '#e8c090' })
  mat('bk', { lo: '#68401e', hi: '#dc9a52', ink: '#2a1608' }, { lo: '#3a2430', hi: '#b87838', ink: '#ffd090' })
  mat('bb', { lo: '#885828', hi: '#f2bc6c', ink: '#3a2008' }, { lo: '#3a2430', hi: '#dc9444', ink: '#fff0c0' })
  mat('bu', { lo: '#323c56', hi: '#98a8c8', ink: '#141a2c' }, { lo: '#2a3250', hi: '#98a8c8', ink: '#e4ecff' })
  mat('fl', { lo: '#d02a10', hi: '#ffc038', ink: '#6a1404' }, { lo: '#e04018', hi: '#fff2a8', ink: '#8a2008' })
  // hills: near greens and fields, far haze
  mat('h1', { lo: '#3f7a52', hi: '#c6e08c', ink: '#163a24' }, { lo: '#071420', hi: '#2a4c58', ink: '#8ac0b0' })
  mat('h2', { lo: '#94823a', hi: '#f4da7c', ink: '#4a3a0c' }, { lo: '#0a1224', hi: '#3a4a52', ink: '#b8c0a0' })
  mat('f1', { lo: '#4a7290', hi: '#9cbcb2', ink: '#243f58' }, { lo: '#0a1432', hi: '#26406e', ink: '#7a98d0' })
  mat('f2', { lo: '#5a8096', hi: '#b8c09a', ink: '#2c4650' }, { lo: '#0c1634', hi: '#2c4672', ink: '#86a0d4' })
  mat('tg', { lo: '#2c6a46', hi: '#9ad07a', ink: '#0e3022' }, { lo: '#06121c', hi: '#2a5a54', ink: '#8ac8b0' })
  mat('tk', { lo: '#4a2c20', hi: '#a86c48', ink: '#1e0e08' }, { lo: '#10090e', hi: '#583a2c', ink: '#c89a78' })
  mat('bn', { lo: '#7a2824', hi: '#e8684c', ink: '#2e0c0a' }, { lo: '#10101e', hi: '#4a2a34', ink: '#c88a8a' })
  mat('rf', { lo: '#4a4e64', hi: '#b4bace', ink: '#1c2034' }, { lo: '#0a1020', hi: '#34406a', ink: '#98a8d8' })
  mat('tm', { lo: '#b8a898', hi: '#fff4e0', ink: '#5a4a44' }, { lo: '#141a30', hi: '#4a5a88', ink: '#b0c0ec' })
  mat('wi', { lo: '#a8782e', hi: '#ffe8a8', ink: '#6a3a0c' }, { lo: '#d8902c', hi: '#ffe590', ink: '#6a3a0c' })
  mat('cd', { lo: '#b4cade', hi: '#ffffff', ink: '#7e98b8' }, { lo: '#0e1638', hi: '#3a4682', ink: '#7480c0' })
  mat('bd', { lo: '#4a5a7a', hi: '#8a9ab8', ink: '#1c2840' }, { lo: '#4a5a7a', hi: '#8a9ab8', ink: '#1c2840' })
}

// ---- balloon sprite ----
interface BSpec { W: number; H: number; cx: number; Hs: number; R: number; mouth: number; N: number; pat: number[]; band: [number, number, number] | null; sk: number; gap: number; bw: number; bh: number; ph: number }
const SK = 4, RP = 5, BK = 6, BB = 7, BU = 8

function balloon(sp: BSpec) {
  const { W, H, cx, Hs, R, mouth, N, pat, band, sk, gap, bw, bh } = sp
  const G = grid(W, H), nz = new Float32Array(W * H)
  const tTop = 0.58
  const hwAt = (t: number) => t < tTop ? R * Math.sqrt(Math.max(0, 1 - ((tTop - t) / tTop) ** 2)) : mouth + (R - mouth) * Math.pow(Math.cos(((t - tTop) / (1 - tTop)) * Math.PI / 2), 0.9)
  for (let y = 0; y < Hs; y++) {
    const t = (y + 0.5) / Hs, hw = hwAt(t), e = 0.5 / Hs
    const t0 = Math.max(0, t - e), t1 = Math.min(1, t + e)
    const d = (hwAt(t1) - hwAt(t0)) / (t1 - t0) / Hs
    const npx = 1 / Math.sqrt(1 + d * d), npy = -d * npx
    for (let x = 0; x < W; x++) {
      const dx = x + 0.5 - cx
      if (Math.abs(dx) > hw) continue
      const u = dx / hw, cz = Math.sqrt(1 - u * u)
      const lam = Math.max(0, npx * u * LV[0] + npy * LV[1] + npx * cz * LV[2])
      let s = 0.13 + 0.76 * Math.pow(lam, 1.15) + 0.4 * Math.pow(lam, 18) + (u > 0 ? 0.16 * Math.pow(u, 3) : 0)
      if (y >= Hs - 4) s += 0.16 * (1 - (Hs - 1 - y) / 4)
      if (hw - Math.abs(dx) < 1.3) s += 0.1
      const gc = Math.asin(u) * N / (2 * Math.PI) + N / 4 + sp.ph, gi = Math.floor(gc), f = gc - gi
      let col = pat[((gi % pat.length) + pat.length) % pat.length]
      const inBand = band && t >= band[0] && t <= band[1]
      if (inBand) col = band![2]
      else if (f < 0.1 || f > 0.9) s *= 0.6
      if (band && (Math.abs(t - band[0]) < 0.6 / Hs || Math.abs(t - band[1]) < 0.6 / Hs)) s *= 0.78
      const i = y * W + x
      G.s[i] = cl(s); G.g[i] = col; nz[i] = cz
    }
  }
  // skirt
  for (let k = 0; k < sk; k++) for (let x = 0; x < W; x++) {
    const hw = mouth * (1 - 0.03 * k), dx = x + 0.5 - cx
    if (Math.abs(dx) > hw) continue
    const u = dx / hw, cz = Math.sqrt(1 - u * u), lam = Math.max(0, u * LV[0] + cz * LV[2])
    const i = (Hs + k) * W + x
    G.s[i] = cl((0.22 + 0.62 * lam + 0.4 * Math.pow(lam, 14)) * (k === 0 ? 0.82 : 1)); G.g[i] = SK; nz[i] = cz
  }
  const rt = Hs + sk - 0.2, by = Hs + sk + gap
  const weave = (x: number, y: number, s: number) => s * ((x + y) & 1 ? 0.8 : 1.1)
  raster(W, H, [
    line([[cx - mouth + 0.8, rt], [cx - bw + 0.9, by + 0.5]], 1, { g: RP, b: 0.62 }),
    line([[cx + mouth - 0.8, rt], [cx + bw - 0.9, by + 0.5]], 1, { g: RP, b: 0.5 }),
    rect(cx - bw, by + 1, bw * 2, bh - 1, { g: BK, b: 0.66, cyl: 'x', fx: weave, ao: 1 }),
    rect(cx - bw - 1, by, bw * 2 + 2, 1.2, { g: BB, b: 0.9, cyl: 'x', rim: 0.3 }),
    rect(cx - 1.5, by - 2, 3, 1, { g: BU, b: 0.9, cyl: 'x', rim: 0.45 }),
    rect(cx - 0.5, by - 1, 1, 1, { g: BU, b: 0.6 }),
  ], { light: LIGHT, into: G })
  // inner glow (night): bright and wide at the mouth, fading up the envelope
  const glow = (k: number): Grid => {
    const O = grid(W, H)
    for (let y = 0; y < Hs + sk; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x
      if (G.s[i] < 0 || G.g[i] > SK) continue
      let I: number
      if (y >= Hs) I = Math.min(1, 0.95 * k)
      else { const gd = (Hs - 1 - y + 0.5) / Hs; I = Math.pow(Math.max(0, 1 - gd / 0.82), 1.6) * (0.52 + 0.48 * nz[i]) * k * 1.12 }
      if (I < 0.3) continue
      O.s[i] = cl(I); O.g[i] = G.g[i]
    }
    return O
  }
  return { G, glow, burnerRow: by - 2, by }
}

// flame frame: rises from (cx, row y0) upward
function flame(W: number, H: number, cx: number, y0: number, h: number, wBase: number, ph: number): Grid {
  const G = grid(W, H)
  for (let k = 0; k < h; k++) {
    const r = k / h, hw = wBase * Math.pow(1 - r, 0.8) * (1 + 0.1 * Math.sin(ph + k * 1.3)) + 0.3
    const sway = Math.sin(ph * 1.3) * 0.8 * r, y = y0 - 1 - k
    if (y < 0) break
    for (let x = Math.floor(cx + sway - hw); x <= Math.ceil(cx + sway + hw); x++) {
      const dx = x + 0.5 - (cx + sway)
      if (x < 0 || x >= W || Math.abs(dx) > hw) continue
      const s = (1 - 0.6 * r) * (1 - 0.4 * Math.abs(dx) / hw)
      G.s[y * W + x] = cl(s, 0.08, 1); G.g[y * W + x] = 0
    }
  }
  return G
}

// ---- hills, trees, barn ----
function hillsGrid(c: number, x0: number, y0: number, w: number, h: number, ridge: (x: number) => number, seed: number): Grid {
  const G = grid(w, h), rr = (X: number) => (ridge(X) - y0) / c
  for (let x = 0; x < w; x++) {
    const X = x0 + (x + 0.5) * c, r = rr(X), dr = (rr(X + c) - rr(X - c)) / 2
    for (let y = 0; y < h; y++) {
      if (y + 0.5 < r) continue
      const depth = y + 0.5 - r
      const band = Math.floor((y * 1.0 + x * 0.55 + 3 * Math.sin(x * 0.17 + seed)) / (c <= 8 ? 3 : 2))
      const g = ((band % 2) + 2) % 2
      let s = 0.52 - dr * 0.5 + (g === 1 ? 0.1 : -0.03) - Math.min(0.2, depth * 0.022)
      if (depth < 1.3) s += 0.26
      s += (hash(x, y + seed) - 0.5) * 0.1
      G.s[y * w + x] = cl(s, 0.14, 1); G.g[y * w + x] = g
    }
  }
  return G
}
const tree = (kind: number): Grid => kind
  ? raster(6, 9, [poly([[3, 0.2], [5.6, 4], [4.6, 4], [5.9, 7], [0.1, 7], [1.4, 4], [0.4, 4]], { g: 0, b: 0.85, cyl: [3, 3], rim: 0.3 }), rect(2.4, 7, 1.2, 2, { g: 1, b: 0.6 })], { light: LIGHT })
  : raster(7, 9, [ell(3.5, 3.4, 3.2, 3.3, { g: 0, b: 0.85, rim: 0.35 }), ell(2.4, 2.4, 1.4, 1.2, { g: 0, b: 1 }), rect(3, 6.4, 1.1, 2.6, { g: 1, b: 0.6 })], { light: LIGHT })
function barn(): Grid {
  return raster(15, 12, [
    rect(1, 5, 13, 7, { g: 0, b: 0.82, cyl: 'x', rim: 0.2 }),
    poly([[0, 5.4], [7.5, 0.4], [15, 5.4], [14, 6.4], [7.5, 2], [1, 6.4]], { g: 1, b: 0.7 }),
    poly([[7.5, 0.4], [15, 5.4], [14, 6.4], [7.5, 2]], { g: 1, b: 0.42 }),
    rect(5.5, 7.4, 4, 4.6, { g: 2, b: 0.9 }),
    line([[6, 7.8], [9, 11.6]], 1, { g: 0, b: 0.5 }), line([[9, 7.8], [6, 11.6]], 1, { g: 0, b: 0.5 }),
    rect(6.8, 3.3, 1.5, 1.4, { g: 3, b: 1 }),
  ], { light: LIGHT })
}

// ---- cloud, bird ----
function cloud(w: number, h: number, bumps: [number, number, number, number][]): Grid {
  return raster(w, h, [...bumps.map(([x, y, rx, ry]) => ell(x, y, rx, ry, { b: 0.9, rim: 0.2 })), rect(1, h - 2.4, w - 2, 1.6, { b: 0.55 })], { light: [-0.5, -0.85], amb: 0.5 })
}
function bird(up: boolean): Grid {
  return raster(9, 5, [
    line(up ? [[0.3, 0.8], [2.6, 2.6], [4.4, 3.2]] : [[0.3, 3.6], [2.6, 2.2], [4.4, 2.8]], 1.6, { b: 0.9 }),
    line(up ? [[4.4, 3.2], [6.2, 2.6], [8.7, 0.8]] : [[4.4, 2.8], [6.2, 2.2], [8.7, 3.6]], 1.6, { b: 0.8 }),
  ], { light: LIGHT })
}

const RAMP_FL = '.:+*#%@'
const ENV_RAMP = '@%#*+=-: '
const GLOWRAMP = ' .:-=+*#%@'
const COL = ['cr', 'cm', 'mu', 'tl']

// a few loose glyphs, clustered around the objects (never a sky-wide sprinkle)
function specks(seed: number, spots: [number, number, number, number][], chars: string, cls: string, op: number): string {
  const rnd = (() => { let s = seed; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } })()
  const xs: number[] = [], ys: number[] = []; let t = ''
  for (const [cx, cy, r, n] of spots) for (let i = 0; i < n; i++) {
    const a = rnd() * 6.283, d = r * (0.55 + 0.45 * rnd())
    xs.push(Math.round((cx + Math.cos(a) * d) / 16) * 16 + 8); ys.push(Math.round((cy + Math.sin(a) * d * 0.8) / 16) * 16 + 12); t += chars[Math.floor(rnd() * chars.length)]
  }
  return `<text class="${cls}" font-size="13" opacity="${op}" x="${xs.join(' ')}" y="${ys.join(' ')}">${t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`
}

export function glyphBalloonsScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  materials()

  const mk = (p: { id: string; sp: BSpec; c: number; ox: number; oy: number; pal: number[]; delay: number; waves: any[]; shimmer?: number; blastH: number; fl: [number, number, number][]; sc: number; fop: number; halo: number; c2: number; ringR: [number, number] }) => {
    const { G, glow, burnerRow } = balloon(p.sp)
    const { W, H, cx, Hs } = p.sp, c = p.c
    const base = p.pal.map(i => COL[i])
    const gm = base.map(n => 'g' + n).concat(['gcr'])
    const mats = [...base, 'sk', 'rp', 'bk', 'bb', 'bu']
    const flames = p.fl.map(([h, wb, ph]) => flame(W, H, cx, burnerRow, h, wb, ph))
    const seq = busy ? [0, 1, 2, 1, 0, 2, 1, 2] : [0, 1, 0, 1, 0, 1, 2, 2]
    const fdur = busy ? 1.4 : 6
    const glows = glow((busy ? 1.2 : 0.95) * p.sc)
    const bodyS = tiles(G, { c, x: p.ox, y: p.oy, mats, ramp: ENV_RAMP, shimmer: p.shimmer ?? 8, seed: p.sp.W })
    const glowS = tiles(glows, { c, x: p.ox, y: p.oy, mats: gm, ramp: GLOWRAMP, op: 0.96 })
    const flameS = tiles(flames, { c, x: p.ox, y: p.oy, mats: ['fl'], ramp: RAMP_FL, dur: fdur, delay: p.delay, seq, op: p.fop })
    const mx = p.ox + cx * c, my = p.oy + Hs * 0.55 * c, ey = p.oy + Hs * 0.45 * c
    const halo = `<circle cx="${mx}" cy="${my}" r="${p.halo}" fill="url(#hbG)" opacity="${busy ? 0.95 : 0.6}" class="${busy ? 'pu' : 'bp'}">${on(p.id, 'opacity', '1;1;.6', 1.2)}${on(p.id, 'r', `${p.halo};${p.halo + 30};${p.halo}`, 1.2)}</circle>`
    const hopV = [0, 1, 2, 3, 3, 2, 1, 0].map(k => `0 ${-k * c}`).join(';')
    const sprite =
      `<g>${on(p.id, 'translate', hopV, 3, { keyTimes: '0;.04;.08;.12;.55;.65;.78;.9', discrete: true })}` +
      D(halo) + `<g transform="translate(${mx} ${ey})"><g><animateTransform attributeName="transform" type="scale" values="1;1.15;1.15;1" keyTimes="0;.12;.4;1" dur="1.2s" begin="${p.id}.click"/><g transform="translate(${-mx} ${-ey})">` + bodyS + D(`<g class="${busy ? 'gpu' : 'gpi'}">${glowS}</g>`) + `</g></g></g>` +
      `<g transform="translate(${mx} ${p.oy + burnerRow * c})"><g><animateTransform attributeName="transform" type="scale" values="1 1;1.25 2.4;1.1 1.9;1.3 2.5;1.15 2;1 1" keyTimes="0;.08;.3;.5;.75;1" dur="1.6s" begin="${p.id}.click"/><g transform="translate(${-mx} ${-(p.oy + burnerRow * c)})">${flameS}</g></g></g></g>`
    const wrap = (inner: string) => p.waves.reduceRight((acc, w) => move(acc, w), inner)
    const T = (n: string, k: number, ch: string): [string, string, string] => [n + k, n + 't' + k, ch]
    const tl: [string, string, string][] = []
    p.pal.slice(0, 3).forEach((i, k) => tl.push(T(COL[i], 3, k % 2 ? '+' : '*')))
    tl.push(['fl3', 'flt3', '#'])
    const by0 = p.oy + Hs * 0.42 * c
    const effects = wrap(
      burst(p.id, { x: mx, y: by0, tiles: tl, c, n: 9, r: p.ringR[0], ring: true, dur: 0.8, flash: '#ffd890', seed: p.sp.W + 3 }) +
      burst(p.id, { x: mx, y: by0, tiles: tl.slice(0, 1), c: p.c2, n: 8, r: p.ringR[1], ring: true, dur: 0.65, delay: 0.1, seed: p.sp.W + 5 }) +
      hit(p.id, p.ox - c, p.oy - c, W * c + 2 * c, H * c + 2 * c, '#ffe0a8'))
    return { sprite: wrap(sprite), effects }
  }

  const NEAR: BSpec = { W: 26, H: 32, cx: 13, Hs: 19, R: 12, mouth: 5, N: 14, pat: [0, 2], band: [0.47, 0.57, 3], sk: 2, gap: 6, bw: 3.5, bh: 4, ph: 0.35 }
  const MID: BSpec = { W: 22, H: 28, cx: 11, Hs: 17, R: 9.7, mouth: 4, N: 12, pat: [0, 3], band: [0.46, 0.56, 2], sk: 2, gap: 5, bw: 3, bh: 4, ph: 0.12 }
  const FAR: BSpec = { W: 16, H: 20, cx: 8, Hs: 12, R: 7, mouth: 2.8, N: 10, pat: [0, 1], band: [0.46, 0.58, 2], sk: 2, gap: 4, bw: 2.2, bh: 3, ph: 0.2 }
  const fI = (a: number): [number, number, number][] => [[4 + a, 1.2, 0], [5 + a, 1.3, 1.6], [8 + a, 1.7, 3]]
  const fB = (a: number): [number, number, number][] => [[9 + a, 1.8, 0.5], [12 + a, 2.1, 2.1], [8 + a, 1.7, 4]]
  const near = mk({ id: 'bNear', sp: NEAR, c: 12, ox: 1200, oy: 130, pal: [0, 1, 2, 3], delay: -2, shimmer: 6, blastH: 14, fl: busy ? fB(0) : fI(0), sc: 1, fop: 1, halo: 200, c2: 8, ringR: [190, 120],
    waves: busy ? [{ dx: 0, dy: -72, c: 12, dur: 16, alt: true, delay: -5 }, { dx: 24, c: 12, dur: 11, alt: true, delay: -3 }, { dx: 0, dy: 12, c: 12, dur: 1.8, alt: true }] : [{ dx: 0, dy: 12, c: 12, dur: 3.6, alt: true, delay: -1.2 }] })
  const mid = mk({ id: 'bMid', sp: MID, c: 10, ox: 100, oy: 360, pal: [3, 1, 2, 0], delay: -5, shimmer: 4, blastH: 13, fl: busy ? fB(0) : fI(0), sc: 0.96, fop: 0.8, halo: 160, c2: 6, ringR: [160, 100],
    waves: busy ? [{ dx: 0, dy: -60, c: 10, dur: 14, alt: true, delay: -8 }, { dx: 20, c: 10, dur: 9, alt: true, delay: -2 }, { dx: 0, dy: 10, c: 10, dur: 1.6, alt: true, delay: -0.5 }] : [{ dx: 0, dy: 10, c: 10, dur: 3, alt: true, delay: -0.4 }] })
  const far = mk({ id: 'bFar', sp: FAR, c: 6, ox: 190, oy: 56, pal: [2, 3, 0, 1], delay: -1, shimmer: 2, blastH: 10, fl: busy ? fB(-3) : fI(-1), sc: 0.9, fop: 0.6, halo: 110, c2: 6, ringR: [100, 64],
    waves: busy ? [{ dx: 0, dy: -48, c: 6, dur: 12, alt: true, delay: -3 }, { dx: 12, c: 6, dur: 8, alt: true }, { dx: 0, dy: 6, c: 6, dur: 1.5, alt: true }] : [{ dx: 0, dy: 6, c: 6, dur: 2.8, alt: true, delay: -1.9 }] })

  // hills end in a smooth ramp that reaches the bottom edge, never a vertical cut
  const ridge = (side: 'L' | 'R', y0: number, drop: number, span: number, a1: number, ph: number) => (x: number) => {
    const d = side === 'L' ? x : 1600 - x
    if (d >= span) return 2000
    return y0 + drop * Math.pow(d / 480, 1.5) + a1 * Math.sin(d * 0.016 + ph) + a1 * 0.5 * Math.sin(d * 0.043 + ph * 2)
  }
  const farR = { L: ridge('L', 862, 190, 470, 12, 0.5), R: ridge('R', 870, 190, 470, 10, 2.2) }
  const nearR = { L: ridge('L', 922, 120, 400, 8, 1.1), R: ridge('R', 918, 120, 400, 8, 3.0) }
  const FM = ['f1', 'f2'], NM = ['h1', 'h2']
  const farHill = (s: 'L' | 'R') => { const x0 = s === 'L' ? 0 : 1080; return tiles(hillsGrid(8, x0, 816, 65, 23, farR[s], s === 'L' ? 2 : 5), { c: 8, x: x0, y: 816, mats: FM, ramp: '   .:-=', shimmer: 4, seed: 4 }) }
  const nearHill = (s: 'L' | 'R') => { const x0 = s === 'L' ? 0 : 1120; return tiles(hillsGrid(16, x0, 880, 30, 8, nearR[s], s === 'L' ? 3 : 7), { c: 16, x: x0, y: 880, mats: NM, ramp: '  .:-=+*', shimmer: 3, seed: 6 }) }
  const placeTree = (x: number, ry: number, k: number) => tiles(tree(k), { c: 8, x: Math.round(x / 8) * 8, y: Math.round((ry - 6.4 * 8) / 8) * 8, mats: ['tg', 'tk'], seed: x })
  const treesL = [[60, 0, farR.L], [310, 0, nearR.L, 1]].map(([d, k, f, n]: any) => placeTree(d, f(d) + (n ? 5 : 0), k)).join('')
  const treesR = [[1540, 1, farR.R], [1450, 1, nearR.R, 1]].map(([d, k, f, n]: any) => placeTree(d, f(d) + (n ? 5 : 0), k)).join('')
  const BXp = 176, barnS = tiles(barn(), { c: 8, x: BXp, y: Math.round((farR.L(BXp + 60) - 9.4 * 8) / 8) * 8, mats: ['bn', 'rf', 'tm', 'wi'], shimmer: 2, seed: 5 })
  const lights = tiles((() => { const g = grid(65, 23); [[8, 17], [43, 20], [31, 22], [46, 22]].forEach(([x, y]) => { g.s[y * 65 + x] = 0.95; g.g[y * 65 + x] = 0 }); return g })(), { c: 8, x: 0, y: 816, mats: ['wi'], ramp: ' ', op: 0.9 })

  const CH = '+*.01{}<>=#'
  const dustL = specks(3, [[1480, 700, 90, 2], [330, 760, 80, 1]], CH, 'du', 0.25)
  const dustD = specks(3, [[1480, 700, 90, 2], [330, 760, 80, 1], [1356, 40, 300, 3]], CH, 'du', 0.55) +
    specks(9, [[1380, 90, 260, 5], [200, 300, 240, 5]], '.*+.', 'st', 0.9)

  const body = ground({
    L: { sky: ['#a8ccec', '#cfe2f0', '#f0dccb', '#f4c9a4'], grid: 'rgba(0,0,0,0)', dust: '#2c3c66', glows: [[1360, 60, 520, '#fff0d4', 0.6], [800, 1000, 760, '#f9c496', 0.7], [180, 900, 420, '#ffd2a8', 0.6]] },
    D: { sky: ['#04061a', '#0a1232', '#152050', '#26306a'], grid: 'rgba(0,0,0,0)', dust: '#98aae8', glows: [[300, 980, 560, '#343a7a', 0.45], [1400, 900, 600, '#26367c', 0.4], [800, 120, 700, '#14226a', 0.3]] },
    n: 0, seed: 17,
  }) +
    `<rect width="1600" height="1000" fill="url(#gpat)" mask="url(#gm)"/>` +
    L(dustL) + D(dustD) +
    `<g class="pl-far">${far.sprite}</g><g class="pl-mid">${mid.sprite}</g><g class="pl-near">${near.sprite}</g>` +
    `<g class="pl-hl">${farHill('L')}${barnS}${nearHill('L')}${treesL}</g>` +
    `<g class="pl-hr">${farHill('R')}${nearHill('R')}${treesR}</g>` +
    `<g class="pl-far">${far.effects}</g><g class="pl-mid">${mid.effects}</g><g class="pl-near">${near.effects}</g>`

  return frame(body, {
    defs: `<radialGradient id="hbG"><stop offset="0" stop-color="#fff0b8" stop-opacity=".95"/><stop offset=".22" stop-color="#ffb55a" stop-opacity=".5"/><stop offset=".6" stop-color="#e8702c" stop-opacity=".16"/><stop offset="1" stop-color="#ff9040" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="hbL"><stop offset="0" stop-color="#ff6a1e" stop-opacity=".75"/><stop offset=".5" stop-color="#e8501c" stop-opacity=".3"/><stop offset="1" stop-color="#e8501c" stop-opacity="0"/></radialGradient>` +
      `<pattern id="gpat" width="16" height="16" patternUnits="userSpaceOnUse"><path class="gpl" d="M16 0V16H0" fill="none" stroke-width=".8"/></pattern>` +
      `<linearGradient id="gmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".26" stop-color="#fff"/><stop offset=".34" stop-color="#050505"/><stop offset=".66" stop-color="#050505"/><stop offset=".74" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<mask id="gm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#gmg)"/></mask>`,
    css: `.gpl{stroke:rgba(70,90,140,.07)}.pu{animation:pu 1.5s ease-in-out infinite alternate}@keyframes pu{from{opacity:.62}to{opacity:1}}.bp{animation:bp 6s ease-in-out infinite alternate}@keyframes bp{from{opacity:.45}to{opacity:.7}}.gpu{animation:gp 1.3s steps(3,end) infinite alternate}@keyframes gp{from{opacity:.62}to{opacity:1}}.gpi{animation:gq 7s steps(4,end) infinite alternate}@keyframes gq{from{opacity:.78}to{opacity:1}}`,
    dark: `.gpl{stroke:rgba(150,170,255,.08)}.st{fill:#c8d6ff}`,
    phone: `.pl-near{transform:translate(-588px,100px)}.pl-far{transform:translate(700px,34px)}.pl-mid,.pl-hr{display:none}.pl-hl{transform:translate(548px,-40px)}`,
  })
}
