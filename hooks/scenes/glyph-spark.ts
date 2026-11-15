// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Glyph spark (Тлеющее ядро, Слоновая кость): a spark of lettered tiles in the right margin and a small creature with a
// flame tuft beside the input, on a faint grid with sparse code glyphs. Calm by design: the band under the chat holds
// only the grid. One drawing in two tones, the dark ember and the light ivory, built by ./glyph-kit.
import type { Grid, Pt, Scheme as Mat, Sky } from './glyph-kit'
import { ell, frame, grid, ground, line, mat, raster, tiles } from './glyph-kit'

type Tone = 'ember' | 'ivory'

// halo: colour, radius and strength of the light behind the core
const TONES: Record<Tone, { ground: Sky; ray: Mat; core: Mat; body: Mat; flame: Mat; eye: Mat; spark: string; halo: [string, number, number] }> = {
  ember: {
    ground: {
      sky: ['#1B1613', '#14110F', '#191210'], grid: 'rgba(255,214,190,.075)', dust: '#8A7A6E',
      glows: [[1448, 264, 300, '#E8743B', 0.34], [40, 1010, 560, '#D8302F', 0.16], [1600, 990, 520, '#E8743B', 0.12]],
    },
    ray: { lo: '#7A1E16', hi: '#F49A5E', ink: '#1A0C08', k: 0.55 },
    core: { lo: '#F7A868', hi: '#FFF3E2', ink: '#B0532A', k: 0.45 },
    body: { lo: '#8E2A1C', hi: '#F08A55', ink: '#000000', k: 0 },
    flame: { lo: '#E8743B', hi: '#FFD08A', ink: '#000000', k: 0 },
    eye: { lo: '#14110F', hi: '#2A1E18', ink: '#000000', k: 0 },
    spark: '#B8FF3C', halo: ['#E8743B', 210, 0.42],
  },
  ivory: {
    ground: {
      sky: ['#F4F1EA', '#F0EEE6', '#EAE5DA'], grid: 'rgba(90,60,40,.07)', dust: '#A89F90',
      glows: [[1448, 264, 240, '#F2A878', 0.07], [40, 1010, 560, '#F06A2B', 0.033], [1600, 990, 520, '#E8452C', 0.02]],
    },
    // pale tiles with terracotta letters, so the spark stays quiet on the light ground; the middle is the deepest colour
    ray: { lo: '#F6DCC8', hi: '#EBA580', ink: '#A3452A', k: 0.62 },
    core: { lo: '#E89468', hi: '#D9734A', ink: '#FFF2E8', k: 0.55 },
    body: { lo: '#C9502E', hi: '#EE8A5C', ink: '#000000', k: 0 },
    flame: { lo: '#F06A2B', hi: '#F7B060', ink: '#000000', k: 0 },
    eye: { lo: '#2A1A12', hi: '#3A2A20', ink: '#000000', k: 0 },
    spark: '#7CBF14', halo: ['#F8C49A', 110, 0.6],
  },
}

const hash = (x: number, y: number) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000 / 1000

// ---- spark: 19 x 19 cells of 16, on the grid, right of the chat column (x 1296 to 1600) ----
const SX = 1296, SY = 112, SW = 19, SC = 16, CX = 9.5, CY = 9.5
// angle (degrees) and length (cells) of each ray: uneven, like a spark drawn by hand; the level arms stop short of
// the window edge and of the chat column
const RAYS: [number, number][] = [[0, 7.6], [31, 6.4], [57, 8.6], [90, 8.2], [119, 8.9], [150, 5.9], [180, 7.9], [211, 6.6], [238, 8.4], [270, 8.8], [301, 6.2], [329, 7.4]]

/** Brightest in the middle, dimmer to the tips; `wave` lifts the tiles at that distance from the middle. */
function spark(wave?: number): Grid {
  const fx = (x: number, y: number) => {
    const d = Math.hypot(x + 0.5 - CX, y + 0.5 - CY), w = wave == null ? 0 : Math.max(0, 1 - Math.abs(d - wave) / 1.5)
    return Math.max(0.14, Math.min(1, 1.06 - 0.085 * d + (hash(x, y) - 0.5) * 0.1 + 0.32 * w))
  }
  const rays = RAYS.flatMap(([deg, len]) => {
    const a = (deg * Math.PI) / 180, at = (t: number): Pt => [CX + Math.cos(a) * t, CY + Math.sin(a) * t]
    return [line([at(0), at(len * 0.35)], 1.7, { fx }), line([at(len * 0.3), at(len)], 1.05, { fx })]
  })
  return raster(SW, SW, [...rays, ell(CX, CY, 1.8, 1.8, { g: 1, fx })])
}

// ---- creature: 11 x 10 cells of 12, a little ember with a flame on its head, tall eyes and two legs ----
const FLAME = [['.....f.....', '....fff....', '...fffff...'], ['......f....', '....fff....', '...fffff...']]
const BODY = ['..bbbbbbb..', '.bbbbbbbbb.', 'bbbebbbebbb', 'bbbebbbebbb', 'bbbbbbbbbbb', '.bbbbbbbbb.']
const LEGS = ['...l...l...', '..l.....l..']
const PX = 284, PY = 836

/** step 1 is the other half of a step in place: the flame leans and the legs part. A blink leaves the eyes a line. */
function pet(blink: boolean, step: number): Grid {
  const rows = [...FLAME[step], ...BODY, LEGS[step]], G = grid(11, rows.length)
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === '.') return
    const i = y * 11 + x, eye = ch === 'e' && !(blink && y === 5)
    G.g[i] = ch === 'f' ? 1 : eye ? 2 : 0
    G.s[i] = ch === 'f' ? 0.98 - y * 0.09 : eye ? 0.3 : ch === 'l' ? 0.45 : Math.max(0.35, 0.92 - (y - 3) * 0.08 - (x === 0 || x === 10 ? 0.1 : 0))
  }))
  return G
}

// small sparks by the creature and a few in the margins: [char, x, y, twinkle]
const SPARKS: [string, number, number, number][] = [['+', 270, 846, 0], ['*', 424, 826, 1], ['+', 418, 948, 2], ['*', 300, 804, 1], ['*', 118, 560, 0], ['+', 1548, 640, 2], ['*', 1336, 760, 1]]

export function glyphSparkScene(state: 'idle' | 'busy', tone: Tone): string {
  const busy = state === 'busy', T = TONES[tone]
  for (const [id, m] of [['sr', T.ray], ['sc', T.core], ['pb', T.body], ['pf', T.flame], ['pe', T.eye]] as [string, Mat][]) mat(id, m, m)

  // at work a brightness wave runs out along the rays every 6 s; the first frame is the whole spark at rest
  const sparkS = tiles(busy ? [spark(), spark(2.4), spark(3.9), spark(5.4), spark(6.9)] : spark(), {
    c: SC, x: SX, y: SY, mats: ['sr', 'sc'], ramp: ' .:;=+tS%', dur: 6, seq: [0, 0, 0, 0, 1, 2, 3, 4],
  })
  // the creature blinks; at work it steps in place
  const petS = busy
    ? tiles([pet(false, 0), pet(true, 0), pet(false, 1)], { c: 12, x: 0, y: 0, mats: ['pb', 'pf', 'pe'], ramp: ' ', dur: 7.2, seq: [0, 0, 2, 2, 0, 0, 2, 2, 0, 1, 2, 2] })
    : tiles([pet(false, 0), pet(true, 0)], { c: 12, x: 0, y: 0, mats: ['pb', 'pf', 'pe'], ramp: ' ', dur: 8, seq: [...Array(19).fill(0), 1] })
  const sparks = SPARKS.map(([ch, x, y, k]) => `<text class="sp sp${k}" opacity=".7" x="${x}" y="${y}" font-size="18">${ch}</text>`).join('')

  // code glyphs: none near the title bar; half of them in the lower right, where a narrow window shows the scene
  const body = ground({
    L: T.ground, D: T.ground, c: 16, n: 34, seed: 7, chars: '<>(){}[]=;:$/*+~', edge: 0.38, gridMask: 'gm',
    zones: [[24, 100, 250, 980], [276, 300, 420, 700], [1300, 480, 1590, 730], [1300, 730, 1590, 980]],
  }) +
    `<circle class="br" cx="1448" cy="264" r="${T.halo[1]}" fill="url(#halo)" opacity=".7"/>` +
    `<g class="spark">${sparkS}</g>` +
    `<g class="pet" transform="translate(${PX} ${PY})">${petS}</g>` + sparks

  return frame(body, {
    par: 'xMaxYMid slice',
    defs: `<radialGradient id="halo"><stop offset="0" stop-color="${T.halo[0]}" stop-opacity="${T.halo[2]}"/><stop offset="1" stop-color="${T.halo[0]}" stop-opacity="0"/></radialGradient>` +
      // the grid fades to a third under the chat column (x 572 to 1282 with the sidebar open, 430 to 1150 closed),
      // and fades in below the title bar (41) instead of stopping at its edge
      `<linearGradient id="gmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0"><stop offset=".25" stop-color="#fff"/><stop offset=".34" stop-color="#555"/><stop offset=".78" stop-color="#555"/><stop offset=".84" stop-color="#fff"/></linearGradient>` +
      `<linearGradient id="gmt" gradientUnits="userSpaceOnUse" x1="0" y1="41" x2="0" y2="112"><stop offset="0"/><stop offset="1" stop-opacity="0"/></linearGradient>` +
      `<mask id="gm" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="url(#gmg)"/><rect width="1600" height="112" fill="url(#gmt)"/></mask>`,
    css: `.sp{fill:${T.spark}}@keyframes sw{from{opacity:.25}to{opacity:.9}}.sp0{animation:sw 6s ease-in-out infinite alternate}` +
      `.sp1{animation:sw 8s ease-in-out -3s infinite alternate}.sp2{animation:sw 10s ease-in-out -6s infinite alternate}` +
      `@keyframes br{from{opacity:.55}to{opacity:.9}}.br{animation:br ${busy ? 5 : 9}s ease-in-out infinite alternate}`,
  })
}
