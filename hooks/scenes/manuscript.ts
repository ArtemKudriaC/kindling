// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Рукопись: an illuminated manuscript page. Light: parchment by day. Dark: vellum by candle.
// Vine scrollwork along the left and top edges, a lapis-and-gold initial, gold glints that shimmer slowly,
// and one Synodal verse a day, small, in the lower right corner. Pure string building, light and dark in one SVG.
// The Synodal text's long dashes are written as commas here.

const VERSES: [string, string][] = [
  ['Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.', 'Ин 3:16'],
  ['Господь, Пастырь мой; я ни в чем не буду нуждаться.', 'Пс 22:1'],
  ['Надейся на Господа всем сердцем твоим, и не полагайся на разум твой.', 'Притч 3:5'],
  ['Все могу в укрепляющем меня Иисусе Христе.', 'Флп 4:13'],
  ['Не бойся, потому что Я с тобою; не смущайся, потому что Я Бог твой; Я укреплю тебя, и помогу тебе, и поддержу тебя десницею правды Моей.', 'Ис 41:10'],
  ['Ибо только Я знаю намерения, какие имею о вас, говорит Господь, намерения во благо, а не на зло, чтобы дать вам будущность и надежду.', 'Иер 29:11'],
  ['Знаем также, что любящим Бога, призванным по Его изволению, все содействует ко благу.', 'Рим 8:28'],
  ['Придите ко Мне, все труждающиеся и обремененные, и Я успокою вас.', 'Мф 11:28'],
  ['Слово Твое, светильник ноге моей и свет стезе моей.', 'Пс 118:105'],
  ['В начале было Слово, и Слово было у Бога, и Слово было Бог.', 'Ин 1:1'],
  ['В начале сотворил Бог небо и землю.', 'Быт 1:1'],
  ['А теперь пребывают сии три: вера, надежда, любовь; но любовь из них больше.', '1 Кор 13:13'],
  ['Я есмь свет миру; кто последует за Мною, тот не будет ходить во тьме, но будет иметь свет жизни.', 'Ин 8:12'],
  ['Я есмь путь и истина и жизнь; никто не приходит к Отцу, как только через Меня.', 'Ин 14:6'],
  ['Ищите же прежде Царства Божия и правды Его, и это все приложится вам.', 'Мф 6:33'],
  ['Бог нам прибежище и сила, скорый помощник в бедах.', 'Пс 45:2'],
  ['Если же у кого из вас недостает мудрости, да просит у Бога, дающего всем просто и без упреков, и дастся ему.', 'Иак 1:5'],
  ['Вера же есть осуществление ожидаемого и уверенность в невидимом.', 'Евр 11:1'],
  ['Плод же духа: любовь, радость, мир, долготерпение, благость, милосердие, вера, кротость, воздержание.', 'Гал 5:22'],
  ['Блаженны миротворцы, ибо они будут наречены сынами Божиими.', 'Мф 5:9'],
  ['И се, Я с вами во все дни до скончания века. Аминь.', 'Мф 28:20'],
  ['Господь, свет мой и спасение мое: кого мне бояться? Господь, крепость жизни моей: кого мне страшиться?', 'Пс 26:1'],
  ['Начало мудрости, страх Господень; безумцы только презирают мудрость и наставление.', 'Притч 1:7'],
  ['Просите, и дано будет вам; ищите, и найдете; стучите, и отворят вам.', 'Мф 7:7'],
  ['Кто не любит, тот не познал Бога, потому что Бог есть любовь.', '1 Ин 4:8'],
  ['Но Бог доказывает Свою любовь к нам тем, что Христос умер за нас, когда мы были еще грешниками.', 'Рим 5:8'],
  ['Ибо благодатью вы спасены через веру, и сие не от вас, Божий дар.', 'Еф 2:8'],
  ['Поднимаю глаза мои к горам, откуда придет помощь моя? Помощь моя от Господа, сотворившего небо и землю.', 'Пс 120:1-2'],
  ['Он показал тебе, человек, что добро, и чего требует от тебя Господь: действовать справедливо, любить дела милосердия и смиренномудренно ходить пред Богом твоим.', 'Мих 6:8'],
  ['Се, стою у двери и стучу: если кто услышит голос Мой и отворит дверь, то Я войду к нему, и буду вечерять с ним, и он со Мною.', 'Откр 3:20'],
  ['Так да светит свет ваш пред людьми, чтобы они видели ваши добрые дела и прославляли Отца вашего Небесного.', 'Мф 5:16'],
  ['Вот, Я повелеваю тебе: будь тверд и мужествен, не страшись и не унывай; ибо с тобою Господь Бог твой везде, куда ни пойдешь.', 'Нав 1:9'],
  ['И все заботы ваши возложите на Него, ибо Он печется о вас.', '1 Пет 5:7'],
]

let seed = 11
function rnd(): number {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const f = (n: number) => n.toFixed(1)

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function wrap(text: string, max: number): string[] {
  const lines: string[] = []
  let cur = ''
  for (const w of text.split(' ')) {
    if (cur && (cur + ' ' + w).length > max) {
      lines.push(cur)
      cur = w
    } else cur = cur ? cur + ' ' + w : w
  }
  if (cur) lines.push(cur)
  return lines
}

const LEAF = 'M0 0 C6 -9 20 -11 30 0 C20 11 6 9 0 0Z'

/** A vine strip in local coordinates: u runs along the edge, v across it. */
function vine(len: number, amp: number): { art: string; glints: { u: number; v: number }[] } {
  const pts: [number, number][] = []
  for (let u = 0; u <= len; u += 6) pts.push([u, Math.sin(u / 62) * amp])
  let art = `<path d="M${pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L')}" class="stem" fill="none"/>`
  art += `<path d="M${pts.map(p => `${f(p[0])} ${f(p[1] - 0.2)}`).join(' L')}" class="stemgold" fill="none"/>`
  const glints: { u: number; v: number }[] = []
  let side = 1
  for (let u = 24; u < len - 20; u += 34 + rnd() * 16) {
    const v = Math.sin(u / 62) * amp
    side = -side
    const a = side * (40 + rnd() * 25)
    const s = 0.8 + rnd() * 0.5
    art += `<path transform="translate(${f(u)} ${f(v)}) rotate(${f(a)}) scale(${f(s)})" d="${LEAF}" class="${rnd() < 0.5 ? 'leafA' : 'leafB'}"/>`
    art += `<path transform="translate(${f(u)} ${f(v)}) rotate(${f(a)}) scale(${f(s * 0.9)})" d="M2 0 L26 0" class="rib"/>`
    if (rnd() < 0.55) {
      const dir = -side
      const cp: [number, number][] = []
      for (let i = 0; i <= 26; i++) {
        const t = i / 26
        const ang = t * 5.2
        const r = 17 * (1 - t * 0.85)
        cp.push([u + 8 + Math.sin(ang) * r * 1.1, v + dir * (6 + (1 - Math.cos(ang)) * r)])
      }
      art += `<path d="M${f(u)} ${f(v)} L${cp.map(p => `${f(p[0])} ${f(p[1])}`).join(' L')}" class="curl" fill="none"/>`
      const e = cp[cp.length - 1]
      art += `<circle cx="${f(e[0])}" cy="${f(e[1])}" r="3.2" class="berry"/>`
      if (rnd() < 0.5) glints.push({ u: e[0], v: e[1] })
    }
    if (rnd() < 0.3) art += `<circle cx="${f(u + 5)}" cy="${f(v - side * 20)}" r="2.6" class="gold"/>`
    if (rnd() < 0.4) glints.push({ u, v })
  }
  return { art, glints }
}

const star = (x: number, y: number, r: number, delay: number, dur: number) =>
  `<path class="glint" style="animation-delay:-${f(delay)}s;animation-duration:${f(dur)}s;transform-origin:${f(x)}px ${f(y)}px" d="M${f(x)} ${f(y - r)} L${f(x + r * 0.22)} ${f(y - r * 0.22)} L${f(x + r)} ${f(y)} L${f(x + r * 0.22)} ${f(y + r * 0.22)} L${f(x)} ${f(y + r)} L${f(x - r * 0.22)} ${f(y + r * 0.22)} L${f(x - r)} ${f(y)} L${f(x - r * 0.22)} ${f(y - r * 0.22)}Z"/>`

const mask = (id: string, len: number, fadeEnd = true) =>
  `<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${len}" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".12" stop-color="#fff"/><stop offset=".88" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="${fadeEnd ? 0 : 1}"/></linearGradient><mask id="${id}" maskUnits="userSpaceOnUse" x="-40" y="-60" width="${len + 80}" height="120"><rect x="-40" y="-60" width="${len + 80}" height="120" fill="url(#${id}g)"/></mask>`

export function manuscriptScene(dayOfYear: number): string {
  seed = 11
  const n = VERSES.length
  const [text, ref] = VERSES[((Math.floor(dayOfYear) % n) + n) % n]
  const letter = text.charAt(0).toUpperCase()

  const left = vine(640, 9)
  const bottom = vine(1700, 7)
  const top = vine(720, 6)
  const gl = (v: { glints: { u: number; v: number }[] }) =>
    v.glints.map((g, i) => star(g.u, g.v, 8 + (i % 3) * 3, rnd() * 14, 8 + rnd() * 8)).join('')

  const lines = wrap(text, 50)
  const lh = 34
  const verse = lines.map((l, i) => `<tspan x="400" y="${64 + i * lh}">${esc(l)}</tspan>`).join('')
  const refY = 64 + lines.length * lh + 6
  const pl = wrap(text, 31)
  const pverse = pl.map((l, i) => `<tspan x="614" y="${236 + i * 30}">${esc(l)}</tspan>`).join('')
  const prefY = 236 + pl.length * 30 + 6

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
svg{--p0:#e6d09f;--p1:#f3e2b4;--edge:#b08848;--sw:.6;--g1:#fff0b8;--g2:#d9a93a;--g3:#8f6414;--gold:#b98a28;--goldhi:#f0cf6a;--lapis:#243f78;--lapis2:#41669f;--verm:#a3322a;--leafA:#5a7a36;--leafB:#7a8f40;--glow:#ffc460;--glowo:.9;--vo:.85;--txt:#33240f;--refc:#6b4a14;--stm:#4a3320;--bl:.45;--sh:#2a1808}
@media (prefers-color-scheme: dark){svg{--p0:#1e1711;--p1:#2c2118;--edge:#0d0907;--g1:#fff0b0;--g2:#e2b447;--g3:#9a6c1a;--gold:#d3a444;--goldhi:#f8dc84;--lapis:#1d3262;--lapis2:#35599a;--verm:#d4503f;--leafA:#5f8f3f;--leafB:#86a64c;--glow:#ffb04a;--glowo:.75;--vo:.95;--txt:#f1e4c8;--refc:#e0b95c;--stm:#a07c44;--bl:.2;--sh:#000;--sw:.12}}
.bg0{fill:var(--p0)}
.stem{stroke:var(--stm);stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.stemgold{stroke:var(--gold);stroke-width:1.2;stroke-linecap:round}
.curl{stroke:var(--stm);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.leafA{fill:var(--leafA)}.leafB{fill:var(--leafB)}.rib{stroke:var(--goldhi);stroke-width:1;opacity:.6;fill:none}
.berry{fill:var(--verm)}.gold{fill:var(--gold)}
.vineg{opacity:var(--vo)}
.glint{fill:var(--goldhi);opacity:0;animation:tw 12s ease-in-out infinite}
@keyframes tw{0%,60%,100%{opacity:0;transform:scale(.4) rotate(0)}78%{opacity:.95;transform:scale(1) rotate(45deg)}}
.candle{fill:url(#cg);opacity:var(--glowo);animation:fl 9s ease-in-out infinite}
@keyframes fl{0%,100%{opacity:calc(var(--glowo)*.88)}40%{opacity:var(--glowo)}70%{opacity:calc(var(--glowo)*.94)}}
.vt{font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-style:italic;font-size:24px;fill:var(--txt)}
.vr{font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:18px;fill:var(--refc)}
.lt{font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-weight:700;font-size:236px;text-anchor:middle}
.ini{transform:translate(52px,40px)}.lv{transform:translate(40px,350px) rotate(90deg)}
.pv{display:none}
@media (max-aspect-ratio:1/1){
.ini{transform:translate(588px,30px) scale(.45)}.lv{transform:translate(590px,400px) rotate(90deg)}
.dv{display:none}.pv{display:block}
.vt{font-size:19px}.vr{font-size:16px}
}
@media (prefers-reduced-motion: reduce){*{animation:none !important}.glint{opacity:.5}}
</style>
<defs>
<radialGradient id="cg"><stop offset="0" stop-color="var(--glow)" stop-opacity=".9"/><stop offset="1" stop-color="var(--glow)" stop-opacity="0"/></radialGradient>
<radialGradient id="pg" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="var(--p1)" stop-opacity=".9"/><stop offset=".6" stop-color="var(--p0)" stop-opacity="0"/><stop offset="1" stop-color="var(--edge)" stop-opacity=".55"/></radialGradient>
<radialGradient id="lap" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="var(--lapis2)"/><stop offset="1" stop-color="var(--lapis)"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset=".45" stop-color="var(--g2)"/><stop offset=".7" stop-color="var(--g1)"/><stop offset="1" stop-color="var(--g3)"/></linearGradient>
<pattern id="fil" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M13 3 L23 13 L13 23 L3 13Z" fill="none" stroke="var(--goldhi)" stroke-width="1.2" opacity=".3"/><circle cx="13" cy="13" r="1.6" fill="var(--goldhi)" opacity=".4"/></pattern>
<filter id="fib" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .06" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .25 0 0 0 0 .12 0 0 0 .55 -.18"/></filter>
<filter id="blot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .006" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .4 0 0 0 0 .2 0 0 0 1.6 -.55"/></filter>
<filter id="blur24" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="26"/></filter>
<linearGradient id="sw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--goldhi)" stop-opacity=".75"/><stop offset=".55" stop-color="var(--goldhi)" stop-opacity="0"/></linearGradient>
<filter id="blur8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="gild" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .05 0 0 0 1.4 -.55" result="g"/><feComposite in="g" in2="SourceAlpha" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>
<filter id="inner" x="0" y="0" width="100%" height="100%"><feFlood flood-color="#000" flood-opacity=".6"/><feComposite in2="SourceAlpha" operator="out"/><feGaussianBlur stdDeviation="9"/><feComposite in2="SourceAlpha" operator="in"/></filter>
${mask('mL', 640)}${mask('mB', 1700, false)}${mask('mT', 720, false)}
</defs>
<rect width="1600" height="1000" class="bg0"/>
<rect width="1600" height="1000" filter="url(#blot)" style="opacity:var(--bl)"/>
<rect width="1600" height="1000" filter="url(#fib)" opacity=".28"/>
<rect width="1600" height="1000" fill="url(#pg)"/>
<rect width="1600" height="1000" fill="url(#sw)" style="opacity:var(--sw)"/>
<circle cx="190" cy="190" r="560" class="candle"/>
<circle cx="1560" cy="1000" r="620" class="candle" style="animation-delay:-4s;opacity:.5"/>
<g class="vineg">
<g class="lv" mask="url(#mL)">${left.art}${gl(left)}</g>
<g transform="translate(40 976)" mask="url(#mB)">${bottom.art}${gl(bottom)}</g>
<g transform="translate(990 22)" mask="url(#mT)">${top.art}${gl(top)}</g>
</g>
<g class="ini">
<rect x="-6" y="-6" width="302" height="302" rx="34" fill="var(--goldhi)" opacity=".55" filter="url(#blur24)"/>
<rect x="4" y="16" width="290" height="290" rx="28" fill="var(--sh)" opacity=".32" filter="url(#blur8)"/>
<rect x="0" y="0" width="290" height="290" rx="28" fill="url(#lap)"/>
<rect x="0" y="0" width="290" height="290" rx="28" fill="url(#fil)"/>
<rect x="0" y="0" width="290" height="290" rx="28" fill="#000" filter="url(#inner)" opacity=".8"/>
<rect x="0" y="0" width="290" height="290" rx="28" fill="none" stroke="url(#gold)" stroke-width="9"/>
<rect x="9" y="9" width="272" height="272" rx="20" fill="none" stroke="var(--g3)" stroke-width="1.5" opacity=".7"/>
<text x="148" y="232" class="lt" fill="var(--sh)" opacity=".5" transform="translate(5 7)">${esc(letter)}</text>
<text x="145" y="228" class="lt" fill="none" stroke="var(--g3)" stroke-width="7" stroke-linejoin="round">${esc(letter)}</text>
<text x="145" y="228" class="lt" fill="url(#gold)" filter="url(#gild)">${esc(letter)}</text>
<text x="143.5" y="226.5" class="lt" fill="none" stroke="var(--g1)" stroke-width="1.2" opacity=".7">${esc(letter)}</text>
</g>
<g class="dv"><text class="vt">${verse}</text>
<text class="vr" x="400" y="${refY + 10}">${esc(ref)}</text></g>
<g class="pv"><text class="vt">${pverse}</text>
<text class="vr" x="614" y="${prefY + 10}">${esc(ref)}</text></g>
</svg>`
}
