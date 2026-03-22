export const DEFAULT_TAGS = [
  { id: 'tag-reise', name: 'Reiseplanung', bg_color: '#E0EAF2', text_color: '#5B7B9A' },
  { id: 'tag-alltag', name: 'Alltag', bg_color: '#F5EED4', text_color: '#C4A24E' },
  { id: 'tag-zukunft', name: 'Zukunft', bg_color: '#E7DCF0', text_color: '#8B6BAE' },
  { id: 'tag-finanzen', name: 'Finanzen', bg_color: '#DCE9DD', text_color: '#5E8B62' },
  { id: 'tag-familie', name: 'Familie', bg_color: '#F5E1EA', text_color: '#C88EA7' },
  { id: 'tag-haushalt', name: 'Haushalt', bg_color: '#F0E6D0', text_color: '#A08050' },
]

export const USERS = {
  max: { id: 'max', name: 'Max', initial: 'M', color: '#5E8B62' },
  anna: { id: 'anna', name: 'Anna', initial: 'A', color: '#C4A24E' },
}

export const POSITIVE_MESSAGES = [
  'Erledigt! \uD83D\uDCAA',
  'Gut gemacht!',
  'Einer weniger! \u2713',
  'Super Teamwork!',
  'Check! \u2705',
  'Das war\u2019s!',
  'Toll gemacht, ihr zwei!',
  'Abgehakt! \uD83C\uDF89',
]

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return '\u2600\uFE0F Guten Morgen'
  if (hour < 18) return '\uD83C\uDF24 Guten Tag'
  return '\uD83C\uDF19 Guten Abend'
}

export function getRandomMessage() {
  return POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)]
}
