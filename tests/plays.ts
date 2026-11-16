// @ts-nocheck ponytail: a port of the app's play check, checked by running, not by tsc
export const PLAYS = {
  tags: new Set('animate animateMotion animateTransform set circle clipPath defs desc ellipse feBlend feComposite feDropShadow feFlood feGaussianBlur feMerge feMergeNode feOffset filter g line linearGradient marker mask mpath path pattern polygon polyline radialGradient rect stop style svg symbol text textPath title tspan use'.split(' ')),
  fns: new Set('color color-mix hsl hsla hwb lab lch light-dark oklab oklch rgb rgba abs acos asin atan atan2 calc clamp cos exp hypot log max min mod pow rem round sign sin sqrt tan var matrix matrix3d perspective rotate rotate3d rotatex rotatey rotatez scale scale3d scalex scaley scalez skew skewx skewy translate translate3d translatex translatey translatez cubic-bezier linear steps blur drop-shadow grayscale hue-rotate invert opacity saturate sepia is not nth-child nth-last-child nth-last-of-type nth-of-type where'.split(' ')),
  ats: new Set(['keyframes', 'layer', 'media', 'supports']),
}
export const cssPlays = (css: string): boolean => {
  if (css.includes('\\') || /(?:\d|\.)(?:[dsl]?v(?:w|h|i|b|min|max)|cq(?:w|h|i|b|min|max))(?![a-z0-9_-])/i.test(css) || /shape-rendering|vector-effect/i.test(css)) return false
  const plain = /\(\s*(?:prefers-reduced-motion(?:\s*:\s*(?:reduce|no-preference))?|prefers-color-scheme(?:\s*:\s*(?:dark|light))?)\s*\)/gi
  const media = [...css.matchAll(/@media([^{]*)(\{|$)/gi)]
  if (!media.every(([, q = '', open]) => open === '{' && /^(?:\s|,|all|and|not|only|or|screen)*$/i.test(q.replaceAll(plain, '')))) return false
  const bare = css.replaceAll(/[\s\p{Cc}]/gu, '').toLowerCase()
  if (bare.includes('data:') || bare.replaceAll(/url\(#[a-z_][\w.:-]*\)/g, '').includes('url(')) return false
  return (
    [...css.matchAll(/([^\s()[\]{}<>;:,'"`=+*/!@#$%^&|~?]{0,64})\(/g)].every(([, f = '']) => f === '' || f.toLowerCase() === 'url' || PLAYS.fns.has(f.toLowerCase())) &&
    [...css.matchAll(/@([^\s{};("'/]*)/g)].every(([, a = '']) => PLAYS.ats.has(a.toLowerCase()))
  )
}
export const playsInApp = (svg: string): boolean =>
  [...svg.matchAll(/<([A-Za-z][\w:-]*)/g)].every(([, t]) => PLAYS.tags.has(t)) &&
  [...svg.matchAll(/\s[\w:-]+="([^"]*)"/g)].every(([, v]) => cssPlays(v)) &&
  [...svg.matchAll(/\shref="([^"]*)"/g)].every(([, h]) => /^#[A-Za-z_][\w.:-]*$/.test(h)) &&
  !/\son\w+=/i.test(svg) &&
  !/shape-rendering|vector-effect/i.test(svg) &&
  !/\s[\w:-]+='/.test(svg) &&
  [...svg.matchAll(/\sattributeName="([^"]*)"/g)].every(([, n]) => !['href', 'media', 'style', 'width', 'height'].includes(n.trim().toLowerCase().replace(/^.*:/s, ''))) &&
  [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)].every(([, css]) => !css.includes('<') && cssPlays(css))
