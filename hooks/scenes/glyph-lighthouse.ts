// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Glyph lighthouse (Маяк): a lighthouse on a rock at the right edge, a sailing boat far left, rolling wave tiles.
// Light: early morning, lamp off, gulls, low sun. Dark: night, lamp on, a beam of tiles sweeping the edge.
// Everything is rasterized into shaded character tiles by ./glyph-kit.
import type { Grid, Pt } from './glyph-kit'
import { burst, D, ell, frame, grid, ground, hit, L, line, mat, move, on, poly, raster, rect, tiles, dust } from './glyph-kit'

const LIGHT: Pt = [-0.8, -0.35]
const MATS = ['tw', 'rd', 'rk', 'ir', 'gl', 'we', 'wn']

function materials(): void {
  mat('tw', { lo: '#7f84a0', hi: '#fff3df', ink: '#33344f' }, { lo: '#16222e', hi: '#b3cddc', ink: '#d6e8f2' })
  mat('rd', { lo: '#68202a', hi: '#f0643f', ink: '#2a0e14' }, { lo: '#1b0e13', hi: '#a43d30', ink: '#ffb89a' })
  mat('rk', { lo: '#6e4e44', hi: '#e4c4a0', ink: '#3a2420' }, { lo: '#17232e', hi: '#6d8798', ink: '#b4cddb' })
  mat('ir', { lo: '#262f4a', hi: '#6c7a9c', ink: '#10162a' }, { lo: '#1b2836', hi: '#52647c', ink: '#9fb2c8' })
  mat('gl', { lo: '#34425e', hi: '#7488a8', ink: '#c8d4e6' }, { lo: '#1f2832', hi: '#667788', ink: '#a8bccb' })
  mat('we', { lo: '#5f8db0', hi: '#9cc6e0', ink: '#1d4262' }, { lo: '#2a5a70', hi: '#7fc4d8', ink: '#d8f4fb' })
  mat('wn', { lo: '#d08a2c', hi: '#ffe48e', ink: '#6b3a0c' }, { lo: '#b8721f', hi: '#ffd57c', ink: '#5a2c05' })
  mat('lp', { lo: '#d2600e', hi: '#ffae2c', ink: '#5e2400' }, { lo: '#e79a28', hi: '#fff7c8', ink: '#9a4a06' })
  mat('bm', { lo: '#d8741c', hi: '#f6a636', ink: '#7a3004' }, { lo: '#1c4350', hi: '#ffd47c', ink: '#fff0c4' })
  mat('sl', { lo: '#6a9db3', hi: '#b3d6e4', ink: '#2f5c78' }, { lo: '#0a2530', hi: '#4a97ab', ink: '#a5e4ee' })
  mat('sa', { lo: '#a8949c', hi: '#fff3e6', ink: '#6a5560' }, { lo: '#0e1923', hi: '#93a9b6', ink: '#e4f2f8' })
  mat('hu', { lo: '#51231f', hi: '#dd7050', ink: '#1f0c0a' }, { lo: '#120a0d', hi: '#7c3a31', ink: '#e29a82' })
  mat('gu', { lo: '#36425f', hi: '#667494', ink: '#171f38' }, { lo: '#36425f', hi: '#667494', ink: '#171f38' })
  mat('su', { lo: '#e8702a', hi: '#ffcf78', ink: '#9a3a0c' }, { lo: '#e8702a', hi: '#ffcf78', ink: '#9a3a0c' })
}

// ---- lighthouse: 35 x 42 cells, light from the left ----
const CX = 17.5
const xl = (y: number) => CX - (4 + ((y - 10) / 20) * 2.3)
const xr = (y: number) => CX + (4 + ((y - 10) / 20) * 2.3)
const course = (_x: number, y: number, s: number) => s * (y % 4 === 3 ? 0.9 : 1) * (y < 12.5 ? 0.78 + (y - 10) * 0.09 : 1)
const slice = (y0: number, y1: number, g: number, b: number) =>
  poly([[xl(y0), y0], [xr(y0), y0], [xr(y1), y1], [xl(y1), y1]], { g, b, cyl: [CX, 6.3], rim: 0.35, fx: course })

function lighthouse(): Grid {
  const wet = (x: number, _y: number, _s: number) => (x % 2 ? 0.84 : 0.6)
  const rk = (x: number, y: number, s: number) => {
    const v = s * (0.9 + 0.2 * hash(x * 3 + 1, y * 5 + 2)) * (1.1 - Math.max(0, y - 36) * 0.03)
    return v < 0.4 ? 0.3 : v < 0.64 ? 0.55 : 0.85 // three tones only
  }
  const X = (x: number) => 17.5 + (x - 17.5) * 0.8 // rock is 80% as wide
  const E = (cx: number, cy: number, rx: number, ry: number, b: number) => ell(X(cx), cy, rx * 0.8, ry, { g: 2, b, rim: 0.4, ao: 2, fx: rk })
  const W = (pts: Pt[]) => line(pts.map(([x, y]): Pt => [X(x), y]), 1, { g: 5, fx: wet })
  return raster(35, 42, [
    poly(([[0, 42], [0, 38], [2, 36], [4, 37], [6, 34], [9, 33.5], [11, 31.5], [14, 30.3], [17, 29.6], [21, 29.8], [24, 31.5], [27, 31], [29, 33], [32, 33.5], [35, 36], [35, 42]] as Pt[]).map(([x, y]): Pt => [X(x), y]), { g: 2, b: 0.42, fx: rk }),
    E(4.5, 38.8, 5, 4.4, 0.72), E(9, 41, 8, 3.4, 0.6), E(11.5, 35.2, 6, 4.4, 0.85), E(17, 33.6, 5.5, 3.8, 0.8),
    E(26.5, 36.5, 7.5, 5.2, 0.7), E(32, 38.6, 5, 4.6, 0.62), E(22, 40.5, 9, 3.4, 0.55),
    W([[2, 40.5], [8, 39.8], [11, 40.6]]), W([[10, 41.5], [16, 41], [21, 41.6]]), W([[24, 41], [29, 40.2], [34, 40.8]]),
    // tower
    slice(10, 30.2, 0, 0.9),
    slice(13.5, 17.5, 1, 0.82),
    slice(22.5, 26.5, 1, 0.82),
    rect(16, 27.2, 3, 3.2, { g: 3, b: 0.5, rim: 0.3 }),
    rect(15.6, 18.7, 3.8, 3.1, { g: 3, b: 0.6 }),
    rect(16.3, 19.2, 2.4, 2.1, { g: 6, b: 1 }),
    // gallery, railing
    poly([[11, 9], [24, 9], [22.5, 10.6], [12.5, 10.6]], { g: 3, b: 0.62, rim: 0.5, ao: 1 }),
    line([[11, 7.1], [24, 7.1]], 1, { g: 3, b: 0.6 }),
    ...[11.5, 13.5, 15.5, 19.5, 21.5, 23.5].map(x => line([[x, 7.1], [x, 9]], 0.9, { g: 3, b: 0.55 })),
    // lantern room: glass, mullions, eave, dome, finial
    rect(14, 4.3, 7, 4.7, { g: 4, b: 0.8, cyl: 'x' }),
    line([[16.5, 4.3], [16.5, 9]], 1, { g: 3, b: 0.65 }),
    line([[18.5, 4.3], [18.5, 9]], 1, { g: 3, b: 0.65 }),
    rect(13, 3.5, 9, 1, { g: 3, b: 0.55, rim: 0.4 }),
    poly([[13.5, 3.5], [14.4, 2.2], [16, 1.3], [19, 1.3], [20.6, 2.2], [21.5, 3.5]], { g: 3, b: 0.66, cyl: 'x', rim: 0.5 }),
    line([[17.5, 0], [17.5, 1.6]], 1, { g: 3, b: 0.7 }),
  ], { light: LIGHT })
}

function lampOn(): Grid {
  const fx = (x: number, _y: number, s: number) => Math.min(1, 0.68 + 0.34 * (1 - Math.abs(x + 0.5 - 17.5) / 3.6) + (s - 0.8) * 0.1)
  const g = grid(35, 42)
  return raster(35, 42, [rect(14, 4.3, 2, 4.7, { b: 1, fx }), rect(17, 4.3, 1, 4.7, { b: 1, fx }), rect(19, 4.3, 2, 4.7, { b: 1, fx })], { into: g, amb: 0.9 })
}

// ---- beam: a clean tapered wedge (3 rows narrowing to 1), brightness stepping down from the lamp. 14 x 14 cells ----
const hash = (x: number, y: number) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000 / 1000
function beam(cells: number): Grid {
  const G = grid(14, 14)
  const STEP = [0.95, 0.72, 0.5, 0.3]
  for (let x = 0; x < 14; x++) {
    const d = 14 - (x + 0.5)
    if (d > cells) continue
    const s = STEP[Math.min(3, Math.floor(d / 3.5))]
    for (const dy of [-1, 0, 1]) {
      if (dy && !(cells >= 4 && d <= cells * 0.55)) continue
      G.s[(6 + dy) * 14 + x] = s * (dy ? 0.82 : 1)
    }
  }
  return G
}
const beamFrames = (reach: number) => [0.2, 0.4, 0.6, 0.8, 1].map(l => beam(Math.max(2, Math.round(l * reach * 14)))).concat([beam(0)])

// ---- boat: 16 x 13 cells, bow to the right; rot tilts it around the waterline ----
function boat(rot: number, billow: number): Grid {
  const a = (rot * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a)
  const R = (p: Pt): Pt => [8 + (p[0] - 8) * cs - (p[1] - 10.5) * sn, 10.5 + (p[0] - 8) * sn + (p[1] - 10.5) * cs]
  const P = (pts: Pt[]) => pts.map(R)
  return raster(16, 13, [
    poly(P([[0.5, 9.2], [15.5, 9.2], [13.2, 12.4], [2.8, 12.4]]), { g: 0, b: 0.62, cyl: 'y', rim: 0.4 }),
    poly(P([[0.5, 9.2], [15.5, 9.2], [15.2, 10], [0.8, 10]]), { g: 1, b: 0.9 }),
    poly(P([[8.1, 0.8], [8.1, 8.8], [1.6, 8.8], [3.6 - billow, 5]]), { g: 2, b: 0.9, cyl: [8.1, 6.5], rim: 0.5 }),
    poly(P([[8.9, 1.6], [8.9, 8.8], [14.2, 8.8], [11.6 + billow, 5.2]]), { g: 2, b: 0.82, cyl: [8.9, 5.4] }),
    line(P([[8.5, 0], [8.5, 9.4]]), 1, { g: 3, b: 0.5 }),
    line(P([[8.5, 0.2], [10.6 + billow, 0.9]]), 1, { g: 1, b: 0.9 }),
  ], { light: LIGHT })
}
const BOAT_MATS = ['hu', 'hu', 'sa', 'ir']

function gull(wings: number): Grid {
  const up = wings === 0
  return raster(10, 6, [
    line(up ? [[0.3, 0.8], [3, 2.8], [5, 3.6]] : [[0.3, 3.8], [3, 2.2], [5, 2.8]], 1.9, { b: 0.95, rim: 0.2 }),
    line(up ? [[5, 3.6], [7, 2.8], [9.7, 0.8]] : [[5, 2.8], [7, 2.2], [9.7, 3.8]], 1.9, { b: 0.85 }),
    ell(5, 3.2, 1.4, 1, { b: 0.9 }),
  ], { light: LIGHT })
}

// ---- sun (light only): a half disc rising at the horizon ----
function sun(): Grid {
  return raster(30, 12, [ell(15, 12, 14, 12, { b: 1 })], { light: [-0.35, -0.9], amb: 0.45, gain: 1.05 })
}

// ---- waves: ridge pattern periodic in x, rows of ~ - = ----
function waves(w: number, rows: number, period: number, seed: number, amp: number): Grid {
  const G = grid(w, rows)
  for (let y = 0; y < rows; y++) for (let x = 0; x < w; x++) {
    const ph = ((x % period) / period) * Math.PI * 2 + y * 1.35 + seed
    const v = Math.sin(ph) + 0.5 * Math.sin(2 * ph + y * 0.7) + (hash(x % period, y + seed) - 0.5) * 0.5
    if (v < 0.05) continue
    const base = 0.26 + (y / rows) * 0.2
    G.s[y * w + x] = Math.max(0.12, Math.min(1, base + amp * 0.26 * v))
  }
  return G
}

const RAMP_SEA = ' ~~--==#'

export function glyphLighthouseScene(state: 'idle' | 'busy'): string {
  const busy = state === 'busy'
  materials()
  const OX = 1120, OY = 466
  const tower = lighthouse(), lamp = lampOn()
  const towerS = tiles(tower, { c: 12, x: OX, y: OY, mats: MATS, shimmer: 14, seed: 4 })
  const lampS = tiles(lamp, { c: 12, x: OX, y: OY, mats: ['lp'], shimmer: 3, seed: 2 })
  const bx = OX, by = OY
  const beamDark = tiles(beamFrames(1), { c: 12, x: bx, y: by, mats: ['bm'], dur: busy ? 7.8 : 26, delay: busy ? -1.8 : -6, seq: [5, 1, 2, 3, 4, 4, 4, 3, 2, 1, 5, 5], op: busy ? 1 : 0.8 })
  const beamLight = tiles(beamFrames(0.62), { c: 12, x: bx, y: by, mats: ['bm'], dur: 7.8, delay: -2.4, seq: [5, 0, 1, 2, 3, 3, 2, 1, 0, 5, 5], op: 0.85 })

  // sea waves, two depth layers, rolling in whole-cell steps
  const sea = (x0: number, x1: number) => {
    const farP = 12, nearP = 10
    const far = move(tiles(waves(Math.ceil((x1 - x0) / 8) + farP, 7, farP, 1, busy ? 1.5 : 1), { c: 8, x: x0 - farP * 8, y: 880, mats: ['sl'], ramp: RAMP_SEA, shimmer: 6, seed: 5 }), { dx: farP * 8, c: 8, dur: busy ? 11 : 30 })
    const near = move(tiles(waves(Math.ceil((x1 - x0) / 16) + nearP, 4, nearP, 3, busy ? 1.6 : 1.1), { c: 16, x: x0 - nearP * 16, y: 936, mats: ['sl'], ramp: RAMP_SEA, shimmer: 5, seed: 8 }), { dx: nearP * 16, c: 16, dur: busy ? 6 : 17 })
    return { far, near }
  }
  const sl = sea(0, 480), sr = sea(1120, 1600)
  const clipL = 'url(#cl)', clipR = 'url(#cr)'

  // boat on the mid layer
  const BX = 132, BY = 774
  const boatFrames = [boat(0, 0), boat(0, 0.7)]
  const boatTilt = boat(-13, 0.4)
  const boatInner = `<g>${on('boatHit', 'opacity', '0;1;0;1;0;1', 1.5, { discrete: true })}${tiles(boatFrames, { c: 12, x: BX, y: BY, mats: BOAT_MATS, dur: 3.2, shimmer: 2, seed: 9 })}</g>` +
    `<g opacity="0">${on('boatHit', 'opacity', '1;0;1;0;1;0', 1.5, { discrete: true })}${tiles(boatTilt, { c: 12, x: BX, y: BY, mats: BOAT_MATS })}</g>`
  // wake trailing the boat (busy)
  const wakeG = (xs: number[]) => {
    const G = grid(15, 3)
    xs.forEach((x, i) => { G.s[2 * 15 + x] = 0.55 - i * 0.12 })
    return G
  }
  const wake = tiles([wakeG([13, 12, 11]), wakeG([12, 11, 10])], { c: 12, x: BX - 15 * 12 + 24, y: BY + 10 * 12, mats: ['sl'], ramp: RAMP_SEA, dur: 1.4 })
  const boatMove = (inner: string) => busy
    ? move(inner, { dx: 252, c: 12, dur: 24, delay: -9, fade: true })
    : move(inner, { dx: 0, dy: 12, c: 12, dur: 2.6, alt: true })
  const boatLayer = boatMove(boatInner + (busy ? wake : ''))
  const splash: [string, string, string][] = [['we3', 'wet3', '~'], ['sl3', 'slt3', '-'], ['we2', 'wet2', 'o'], ['sl3', 'slt3', '.'], ['we3', 'wet3', '=']]
  const boatFx = boatMove(burst('boatHit', { x: BX + 96, y: BY + 112, tiles: splash, c: 12, n: 20, r: 150, dur: 0.55, flash: '#bfe8f2', seed: 7 }) + hit('boatHit', BX - 8, BY - 4, 200, 170, '#e8fbff'))

  // lighthouse effects
  const LX = OX + 17.5 * 12, LY = OY + 6.6 * 12
  const lampTiles: [string, string, string][] = [['lp3', 'lpt3', '*'], ['bm3', 'bmt3', '+'], ['lp2', 'lpt2', 'o'], ['bm3', 'bmt3', '#'], ['lp3', 'lpt3', '@']]
  const lhFx = `<g class="pl-lh"><g opacity="0"><circle cx="${LX}" cy="${LY}" r="80" fill="url(#lampG)"/>${on('lhHit', 'opacity', '0;1;0;1;0;1;0', 1.7)}</g>` +
    burst('lhHit', { x: LX, y: LY, tiles: [['lp3', 'lpt3', '*', 12], ['bm3', 'bmt3', '+', 8]], n: 16, r: 100, ring: true, flash: '#ffc860', dim: 4, dur: 0.6, seed: 3 }) +
    hit('lhHit', 1180, 452, 330, 520, '#ffd9a0') + '</g>'

  const halo = (r: number, a: number, cls = '', g = 'lampG') => `<circle class="${cls}" cx="${LX}" cy="${LY}" r="${r}" fill="url(#${g})" opacity="${a}"/>`

  const waveMask = `<g mask="url(#wm)"><g clip-path="${clipL}">${sl.far}</g><g clip-path="${clipR}">${sr.far}</g></g>`
  const waveNear = `<g mask="url(#wm)"><g clip-path="${clipL}">${sl.near}</g><g clip-path="${clipR}">${sr.near}</g></g>`

  const gulls = [[60, 110, 8, 240, 52, -14], [250, 64, 12, 192, 70, -40], [1250, 150, 8, 256, 64, -30]]
  const gullS = gulls.map(([x, y, c, dx, dur, dl], i) =>
    move(tiles([gull(0), gull(1)], { c, x, y, mats: ['gu'], ramp: ' .~-=', dur: 1.1 + i * 0.17, delay: -i * 0.3 }), { dx, c, dur, delay: dl, fade: true })).join('')

  const body = ground({
    L: { sky: ['#d9e3e8', '#efe3d4', '#f8dbbd'], grid: 'rgba(120,100,120,.1)', dust: '#4a5a7a', glows: [[140, 870, 640, '#ffcf96', 0.8], [130, 880, 200, '#fff0cc', 0.9], [800, 920, 460, '#ffd9aa', 0.3], [1500, 120, 520, '#ffe7d6', 0.4]] },
    D: { sky: ['#050f19', '#0a2430', '#0f3a45'], grid: 'rgba(140,200,220,.07)', dust: '#8fd0dc', glows: [[1400, 540, 760, '#2a7080', 0.35], [220, 260, 560, '#12414e', 0.35]] },
    n: 25, seed: 11, edge: 0.25, mid: 0.08, gridMask: 'gm',
    zones: [[1100, 40, 1580, 440], [30, 30, 430, 300], [30, 580, 440, 780]],
  }) +
    `<g class="L"><rect y="872" width="1600" height="128" fill="url(#seaL)"/></g><g class="D"><rect y="872" width="1600" height="128" fill="url(#seaD)"/>${dust({ n: 20, seed: 21, cls: 'st', chars: '.+*.', edge: 0.8, mid: 0.1, zones: [[1100, 30, 1580, 400], [30, 30, 430, 300]] })}</g>` +
    `<g class="pl-sun L">${tiles(sun(), { c: 8, x: -40, y: 776, mats: ['su'], ramp: ' .:-=', shimmer: 6, seed: 12 })}</g>` +
    `<g class="pl-lh">${L(busy ? beamLight : '')}${D(beamDark)}</g>` +
    `<g class="pl-wf">${waveMask}</g>` +
    `<g class="pl-lh">${towerS}</g>` +
    `<g class="pl-boat">${boatLayer}</g>` +
    `<g class="pl-gull L">${gullS}</g>` +
    `<g class="pl-wn">${waveNear}</g>` +
    `<g class="pl-lh">${D(`<circle cx="${OX + 17.5 * 12}" cy="${OY + 20.6 * 12}" r="70" fill="url(#lampG)" opacity=".55"/>` + lampS + halo(busy ? 220 : 210, busy ? 0.66 : 0.6, busy ? 'pul' : ''))}${L(busy ? lampS + halo(60, 0.9, 'pul', 'lampA') : '')}</g>` +
    `<g class="pl-boat">${boatFx}</g>` + lhFx

  return frame(body, {
    defs: `<linearGradient id="seaL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7dcdc" stop-opacity=".1"/><stop offset=".25" stop-color="#8fb7c4" stop-opacity=".85"/><stop offset="1" stop-color="#5f8fa8"/></linearGradient>` +
      `<linearGradient id="seaD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b3441" stop-opacity=".1"/><stop offset=".25" stop-color="#082833" stop-opacity=".9"/><stop offset="1" stop-color="#03131a"/></linearGradient>` +
      `<radialGradient id="lampG"><stop offset="0" stop-color="#fff2c0" stop-opacity="1"/><stop offset=".25" stop-color="#ffc766" stop-opacity=".55"/><stop offset="1" stop-color="#ff9f40" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="wmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="#fff"/><stop offset=".3" stop-color="#000"/><stop offset=".7" stop-color="#000"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<radialGradient id="lampA"><stop offset="0" stop-color="#ffb23a" stop-opacity=".95"/><stop offset=".5" stop-color="#e8761c" stop-opacity=".4"/><stop offset="1" stop-color="#e8761c" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="gmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset=".26" stop-color="#fff"/><stop offset=".34" stop-color="#0c0c0c"/><stop offset=".66" stop-color="#0c0c0c"/><stop offset=".74" stop-color="#fff"/></linearGradient><mask id="gm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#gmg)"/></mask>` +
      `<mask id="wm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#wmg)"/></mask>` +
      `<clipPath id="cl"><rect x="0" y="860" width="480" height="140"/></clipPath><clipPath id="cr"><rect x="1120" y="860" width="480" height="140"/></clipPath>`,
    css: `.pul{animation:pul 1.7s ease-in-out infinite alternate}@keyframes pul{from{opacity:.62}to{opacity:1}}`,
    dark: `.st{fill:#cfe8f0}`,
    phone: `.pl-lh{transform:translate(-540px,-446px)}.pl-boat{transform:translate(500px,0)}.pl-sun{transform:translate(470px,0)}.pl-wf,.pl-wn{transform:translate(560px,0)}.pl-gull{display:none}`,
  })
}
