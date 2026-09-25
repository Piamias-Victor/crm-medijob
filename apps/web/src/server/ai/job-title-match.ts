export type JobTitleOption = { id: string; name: string }

const STOP_WORDS = new Set(['en', 'de', 'du', 'des', 'la', 'le', 'les', 'et', 'a', 'au', 'aux'])

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

function tokenize(value: string) {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word))
}

function toRoleStem(word: string) {
  return word
    .replace(/trice$/, 'teur')
    .replace(/rice$/, 'r')
    .replace(/ere$/, 'er')
    .replace(/euse$/, 'eur')
}

function wordsOverlap(a: string, b: string) {
  if (a === b) return true
  const stemA = toRoleStem(a)
  const stemB = toRoleStem(b)
  return stemA === b || a === stemB || stemA === stemB
}

function scoreMatch(needle: string, haystack: string) {
  if (haystack === needle) return 100
  if (haystack.includes(needle) || needle.includes(haystack)) return 80

  const needleWords = tokenize(needle)
  const hayWords = tokenize(haystack)
  const hits = needleWords.filter((word) => hayWords.some((hayWord) => wordsOverlap(word, hayWord)))
  if (hits.length === 0) return 0
  const coversOption = hayWords.every((word) =>
    needleWords.some((needleWord) => wordsOverlap(needleWord, word)),
  )
  return hits.length * 25 + (coversOption ? 30 : 0)
}

export function matchJobTitles(extracted: string, options: JobTitleOption[], limit = 5) {
  const needle = normalize(extracted)
  if (!needle) return []
  return options
    .map((option) => ({ ...option, score: scoreMatch(needle, normalize(option.name)) }))
    .filter((option) => option.score > 0 && normalize(option.name) !== 'autre')
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
