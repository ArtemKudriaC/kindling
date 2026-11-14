// @ts-nocheck ponytail: generated SVG string builders, checked by render tests not tsc
// Конец месяца: a lit glass card with the current month (Monday first) in the right column, and one hero figure:
// days until the next tax deadline of a Polish sole trader. ZUS and PIT advance on the 20th, JPK_V7 / VAT on the 25th;
// a Saturday or Sunday date moves to Monday. Blue = next deadline, amber = coming, green = done.

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function deadlineDay(year: number, month: number, day: number): number {
  const dow = (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7
  return day + (dow === 5 ? 2 : dow === 6 ? 1 : 0)
}

function days(n: number): string {
  const m = n % 100
  if (m > 10 && m < 15) return 'дней'
  const k = n % 10
  return k === 1 ? 'день' : k >= 2 && k <= 4 ? 'дня' : 'дней'
}

export function monthEndScene(date: { year: number; month: number; day: number }): string {
  const { year, month, day: today } = date
  const first = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7
  const dim = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const dl: Record<number, string> = {}
  const add = (d: number, label: string) => { dl[d] = dl[d] ? dl[d] + ' · ' + label : label }
  add(deadlineDay(year, month, 20), 'ZUS · PIT')
  add(deadlineDay(year, month, 25), 'JPK · VAT')
  const next = Object.keys(dl).map(Number).sort((a, b) => a - b).find(d => d >= today)

  const X0 = 1120, Y0 = 300, W = 450, PAD = 22, CW = 58, RH = 70, GX = X0 + PAD, GY = Y0 + 98
  const rows = 6
  const CH = 98 + rows * RH + 22

  let cells = ''
  for (let d = 1; d <= dim; d++) {
    const i = first + d - 1
    const x = GX + (i % 7) * CW, y = GY + Math.floor(i / 7) * RH
    const cx = x + CW / 2
    const isToday = d === today
    const label = dl[d]
    if (label) {
      const [a, b] = label.split(' · ')
      const dist = d - today
      const px = x - 1, py = y + 4, pw = CW + 2, ph = RH - 8
      if (dist < 0) {
        cells += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="16" fill="#3f7a45" opacity=".13"/>`
        cells += `<text x="${cx}" y="${y + 28}" text-anchor="middle" font-size="16" font-weight="500" fill="#2d6137">${d}</text>`
        cells += `<text x="${cx}" y="${y + 44}" text-anchor="middle" font-size="13" font-weight="600" fill="#2d6137" opacity=".85">${a}</text><text x="${cx}" y="${y + 58}" text-anchor="middle" font-size="13" font-weight="600" fill="#2d6137" opacity=".85">${b}</text>`
        cells += `<path d="M${x + CW - 20} ${y + 17}l3.2 3.4 6.2-7" fill="none" stroke="#3f7a45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      } else if (d === next) {
        const near = dist <= 5
        if (near) cells += `<rect class="pl" x="${px}" y="${py}" width="${pw}" height="${ph}" rx="16" fill="none" stroke="#2c5aa8" stroke-width="2"/>`
        cells += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="16" fill="#2c5aa8" opacity="${near ? 1 : 0.62}"/>`
        cells += `<text x="${cx}" y="${y + 28}" text-anchor="middle" font-size="16" font-weight="600" fill="#ffffff">${d}</text>`
        cells += `<text x="${cx}" y="${y + 44}" text-anchor="middle" font-size="13" font-weight="600" fill="#ffffff">${a}</text><text x="${cx}" y="${y + 58}" text-anchor="middle" font-size="13" font-weight="600" fill="#ffffff">${b}</text>`
        if (isToday) cells += `<circle cx="${x + CW - 11}" cy="${y + 12}" r="3.5" fill="#ffffff"/>`
      } else {
        cells += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="16" fill="#c98a14" opacity=".17"/>`
        cells += `<text x="${cx}" y="${y + 28}" text-anchor="middle" font-size="16" font-weight="600" fill="#7a4f08">${d}</text>`
        cells += `<text x="${cx}" y="${y + 44}" text-anchor="middle" font-size="13" font-weight="600" fill="#7a4f08">${a}</text><text x="${cx}" y="${y + 58}" text-anchor="middle" font-size="13" font-weight="600" fill="#7a4f08">${b}</text>`
        if (isToday) cells += `<circle cx="${x + CW - 11}" cy="${y + 12}" r="3.5" fill="#7a4f08"/>`
      }
    } else if (isToday) {
      cells += `<circle cx="${cx}" cy="${y + 35}" r="19" fill="#14213a"/><text x="${cx}" y="${y + 41}" text-anchor="middle" font-size="17" font-weight="600" fill="#ffffff">${d}</text>`
    } else {
      const past = d < today
      cells += `<text x="${cx}" y="${y + 41}" text-anchor="middle" font-size="17" fill="#33466a" opacity="${past ? 0.78 : 1}">${d}</text>`
    }
  }
  let wd = ''
  for (let c = 0; c < 7; c++) wd += `<text x="${GX + c * CW + CW / 2}" y="${Y0 + 88}" text-anchor="middle" font-size="13" font-weight="500" fill="#4a5d82">${WD[c]}</text>`

  // hero figure
  let hero: string
  if (next === undefined) {
    hero = `<text x="0" y="70" font-size="56" font-weight="300" letter-spacing="-2" fill="#3f7a45">Всё сдано</text>`
  } else {
    const dist = next - today
    const col = dist <= 5 ? '#2c5aa8' : '#6a89c2'
    if (dist === 0) {
      hero = `<text x="0" y="70" font-size="64" font-weight="300" letter-spacing="-2.5" fill="${col}">Сегодня</text><text x="0" y="104" font-size="20" fill="#33466a">срок ${dl[next]}</text>`
    } else {
      const nw = String(dist).length * 44
      hero = `<text x="0" y="84" font-size="88" font-weight="300" letter-spacing="-4" fill="${col}">${dist}</text><text x="${nw + 16}" y="52" font-size="23" fill="#33466a">${days(dist)} до</text><text x="${nw + 16}" y="82" font-size="26" font-weight="600" letter-spacing="-.3" fill="#14213a">${dl[next]}</text>`
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
text{font-family:-apple-system,"SF Pro Display","SF Pro Text","Helvetica Neue",Arial,sans-serif}
.pl{animation:pl 4.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes pl{0%{opacity:.7;transform:scale(1)}70%,100%{opacity:0;transform:scale(1.28,1.18)}}
.g1{animation:dr 34s ease-in-out infinite alternate}.g2{animation:dr 27s ease-in-out -9s infinite alternate-reverse}.g3{animation:dr 40s ease-in-out -15s infinite alternate}
@keyframes dr{from{transform:translate(0,0)}to{transform:translate(34px,-22px)}}
@media (max-aspect-ratio:1/1){.card{transform:translate(-545px,-141px) scale(.97)}.hero{transform:translate(-578px,610px)}}
@media (prefers-reduced-motion: reduce) { * { animation: none !important } }
</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf0fa"/><stop offset=".5" stop-color="#dce6f5"/><stop offset="1" stop-color="#cfdbef"/></linearGradient>
<radialGradient id="a" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8fb0e6" stop-opacity=".62"/><stop offset="1" stop-color="#8fb0e6" stop-opacity="0"/></radialGradient>
<radialGradient id="b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#a9a9ec" stop-opacity=".42"/><stop offset="1" stop-color="#a9a9ec" stop-opacity="0"/></radialGradient>
<radialGradient id="c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#86c6e6" stop-opacity=".42"/><stop offset="1" stop-color="#86c6e6" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".86"/><stop offset="1" stop-color="#f3f7fd" stop-opacity=".74"/></linearGradient>
<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".4" stop-color="#ffffff" stop-opacity=".25"/><stop offset="1" stop-color="#ffffff" stop-opacity=".5"/></linearGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="26" stdDeviation="28" flood-color="#2a4a8a" flood-opacity=".22"/></filter>
<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .3  0 0 0 0 .5  0 0 0 .55 0"/></filter>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<g class="g1"><ellipse cx="1380" cy="420" rx="620" ry="560" fill="url(#a)"/></g>
<g class="g2"><ellipse cx="120" cy="820" rx="640" ry="460" fill="url(#a)"/></g>
<g class="g3"><ellipse cx="260" cy="150" rx="520" ry="360" fill="url(#b)"/></g>
<g class="g2"><ellipse cx="1100" cy="1000" rx="520" ry="260" fill="url(#c)"/></g>
<polygon points="0,0 560,0 120,1000 0,1000" fill="url(#beam)" opacity=".5"/>
<rect width="1600" height="1000" filter="url(#gr)" opacity=".16"/>
<g class="hero"><g transform="translate(${GX} 168)">${hero}</g></g>
<g class="card">
<rect x="${X0}" y="${Y0}" width="${W}" height="${CH}" rx="24" fill="url(#card)" filter="url(#sh)"/>
<rect x="${X0 + .5}" y="${Y0 + .5}" width="${W - 1}" height="${CH - 1}" rx="24" fill="none" stroke="url(#rim)" stroke-width="1.2"/>
<text x="${GX}" y="${Y0 + 52}" font-size="30" font-weight="600" letter-spacing="-.6" fill="#14213a">${MONTHS[month - 1]}</text>
${wd}${cells}
</g>
</svg>`
  return svg
}
