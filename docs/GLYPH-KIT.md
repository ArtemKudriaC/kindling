# GLYPH-KIT: API of `hooks/scenes/glyph-kit.ts`

`import { ... } from './glyph-kit'` (types with `import type`). Pure, deterministic. All coordinates: viewBox px
(1600x1000) unless called "cells". Cell sizes: far 8, mid 12, near 16 px.
Build the whole body first, then call `frame()` last (it consumes and resets the kit's CSS and defs registry).

## Rasterizer (describe objects in cells, get a shaded grid)
- `ell(cx,cy,rx,ry,o?)`, `poly(pts,o?)`, `rect(x,y,w,h,o?)`, `line(pts,widthCells,o?)`: shapes, painted in array order.
- `o` (ShapeOpt): `b` albedo 0..1 (def .7); `g` colour group index (def 0); `rim` 0..1 rim light on the side away from
  the light; `ao` n: darken EARLIER cells within n cells of this shape (contact shadow); `cyl` `'x'|'y'|[axis,halfWidth]`
  shades a poly/rect as a cylinder (tower, mast; `[axis,hw]` keeps several polys consistent); `fx(x,y,s)` per-cell
  shade tweak (x,y in cells; texture, strata, wet highlights: `(x,y,s)=>Math.max(s,.9)`). Ellipses and lines are round
  by themselves; a poly without `cyl` is flat.
- `raster(w,h,shapes,{light?:[lx,ly], amb?:.22, gain?:1.2, into?:Grid}) -> Grid`. `light` points TO the light, e.g.
  `[-.8,-.35]` = from the left. `into` paints on an existing grid.
- `grid(w,h) -> Grid {w,h,s:Float32Array,g:Uint8Array}`: s = shade 0..1, -1 = empty, g = group. Fill it by hand for
  procedural things (waves, beams, wakes): `G.s[y*w+x]=.6; G.g[y*w+x]=0`.
- `lcg(seed) -> () => 0..1` seeded random.

## Tiles (grid -> compact SVG)
- `mat(id,{lo,hi,ink},{lo,hi,ink}) -> id` registers a material: 4 steps from shadow (`lo`) to highlight (`hi`) for
  light and for dark (the same object = used for both); characters tint toward `ink`. Classes it makes:
  tile `${id}0..3`, character `${id}t0..3` (use them in burst tiles). Pick ids that are not `tb`, `hit`, `hv`, `du`, `L`, `D`.
- `mix(a,b,t)` blends two `#rrggbb` colours.
- `tiles(gridOrFrames, {c,x,y,mats,ramp?,dur?,delay?,seq?,shimmer?,seed?,op?}) -> string`
  `mats[i]` = material id for colour group i. `ramp` = characters dark to light (def `' .:-=+*#%@'`; a space draws
  the tile only). Several grids (same w,h) = pose frames swapped by `steps(1)` opacity over `dur` seconds (whole loop);
  `seq` sets the order per step (`[0,1,2,1]`), `delay` negative starts mid-loop. Cells identical in every frame are
  emitted once. `shimmer: n` makes n tiles cross-fade to a neighbouring ramp character. `op` = group opacity.
  Cost: about 25 chars per filled cell, plus frames' differing cells. Empty frames (no cells) are fine.
- `move(content,{dx,dy?,c,dur,delay?,alt?,fade?}) -> string` moves content in whole-cell jumps (`steps`), looping.
  dx,dy multiples of c. `alt` ping-pongs; `fade` fades in and out at the ends (one-way crossings; not with `alt`).
  Negative `delay` = already running at load, so a still screenshot is mid-cycle. Wrap seamless wave rows with
  `dx = period*c` over a grid built from a pattern that repeats every `period` cells, clipped by a `<clipPath>`.

## Ground
- `ground({L:Sky,D:Sky,c?:16,n?:150,seed?,chars?}) -> string` graded backdrop for `.L` and `.D` (Sky =
  `{sky:[top..bottom colours], grid:'rgba(..)', dust:'#hex', glows?:[[x,y,r,colour,alpha],...]}`), the faint cell grid and
  sparse code-glyph dust (alpha .12 inside x 450..1150, .5 outside, slow twinkle).
- `dust({n,seed,cls,chars?,c?,edge?,mid?,y0?,y1?}) -> string` more dust (stars): colour from CSS `fill` on `cls`
  (give it via `frame(...,{css:'.st{fill:#..}'})` or `dark:`).
- `L(svg)`, `D(svg)` wrap content for light only / dark only (`class="L"` / `"D"`).

## Click and hover (SMIL; effects go in a top layer, `hit` rects LAST of all)
- `hit(id,x,y,w,h,glowColour?) -> string` invisible rect with `class="hit"`; with a colour, a soft glow follows it that
  brightens on hover. Keep it out of x 450..1150.
- `burst(id,{x,y,tiles:[bgClass,fgClass,char][],c?:12,n?:20,r?:110,dur?:.9,ring?,delay?,flash?,seed?})`: on click of
  `#id`, n tiles fly out (scatter with gravity, or `ring` = evenly spaced expanding ring), optional `flash` colour glow.
  Tiles are e.g. `['pl3','plt3','*']`. `delay` seconds, for a second ring.
- `on(id,attr,values,dur,{keyTimes?,discrete?,delay?})`: an `<animate>` run on click; put it INSIDE the element it
  animates. `attr 'translate'` makes an `animateTransform` (values `"x y;x y"`). `discrete` = step values (pose swaps:
  hide the idle group `0;1;0;1`, show the pose group `1;0;1;0`).
- A moving object's hit rect and burst must sit inside a `move()` with the same params as the object.

## Root
- `frame(body,{css?,dark?,phone?,defs?,par?}) -> string`: root `<svg>` (1600x1000, `par` or `xMidYMid slice`), shared style:
  monospace stack, `.L/.D` scheme switch, `svg *{pointer-events:none}` with `.hit` re-enabled, reduced motion, and
  `@media (max-aspect-ratio:1/1){phone}` only when `phone` is given. The desktop app refuses that rule and then draws the
  whole scene with no motion, so a new scene leaves `phone` out and keeps its subject in view with `par` instead.
  `css` = extra rules, `dark` = extra rules inside `prefers-color-scheme:dark`, `defs` = extra `<defs>` content (ids must
  be yours; the kit's are `gg*`, `hg*`, `bf*`, `bt*`). For phone, wrap each subject in `<g class="pl-name">` and move it
  from `phone`: the phone sees only x ~569..1031, scale ~.93, cells keep their size.

## Optional additions (round 2; defaults keep the old output)
- `dust(...)` and `ground(...)` take `zones: [x0,y0,x1,y1][]` to cluster dust inside those boxes; `ground` also takes
  `edge`/`mid` (dust alpha) and `gridMask: 'maskId'` (a `<mask>` you define in `frame` `defs`, applied to the cell grid).
- `burst` tiles may be `[bg,fg,char,cellPx]` (own tile size per entry, for 2-size rings); `dim: n` draws the n ring tiles
  nearest straight down at 40% opacity.

## Example (a lavender orb that drifts; click for a burst)
```ts
import { burst, ell, frame, ground, hit, line, mat, move, raster, tiles } from './glyph-kit'
export function orbScene(): string {
  mat('pl', { lo: '#7a6a9a', hi: '#fff0e0', ink: '#3a2a5a' }, { lo: '#150f2a', hi: '#c9b8ff', ink: '#efe8ff' })
  const orb = (k: number) => raster(14, 14, [ell(7, 7, 6, 6, { b: 0.85, rim: 0.4 }), line([[2, 11 + k], [12, 11 + k]], 1, { b: 0.4 })], { light: [-0.7, -0.6] })
  const drift = { dx: 240, c: 12, dur: 20, alt: true }
  const body = ground({
    L: { sky: ['#e8e2f0', '#f6e6d8'], grid: 'rgba(90,70,120,.1)', dust: '#4a3a6a' },
    D: { sky: ['#0a0818', '#1a1230'], grid: 'rgba(200,180,255,.07)', dust: '#b8a8f0' },
  }) +
    `<g class="pl-orb">${move(tiles([orb(0), orb(1)], { c: 12, x: 60, y: 760, mats: ['pl'], dur: 1.6, shimmer: 4 }), drift)}</g>` +
    `<g class="pl-orb">${move(burst('orb', { x: 130, y: 840, tiles: [['pl3', 'plt3', '*'], ['pl2', 'plt2', '+']], flash: '#fff0c0' }) + hit('orb', 40, 740, 200, 180, '#fff0c0'), drift)}</g>`
  return frame(body, { phone: '.pl-orb{transform:translate(500px,0)}' })
}
```
Budget: every state under 120,000 chars. Check with `.length`; the biggest costs are large sprites (25 chars per
cell), many pose frames, and bursts (about 230 chars per particle).
