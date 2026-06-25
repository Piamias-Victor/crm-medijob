export type JobTitleOption = { id: string; name: string }

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

function tokenize(value: string) {
  return normalize(value).split(/\s+/).filter(Boolean)
}

function toRoleStem(word: string) {
  return word.replace(/trice$/, 'teur').replace(/rice$/, 'r')
}

function scoreMatch(needle: string, haystack: string) {
  if (haystack === needle) return 100
  if (haystack.includes(needle) || needle.includes(haystack)) return 80

  const needleWords = tokenize(needle)
  const hayWords = tokenize(haystack)
  const exactHits = needleWords.filter((word) => hayWords.includes(word)).length
  if (exactHits > 0) {
    const coversOption = hayWords.every((word) => needleWords.includes(word))
    return exactHits * 25 + (coversOption ? 30 : 0)
  }

  const stemHits = needleWords.filter((word) =>
    hayWords.some((hayWord) => {
      const stem = toRoleStem(word)
      return stem === hayWord || word === toRoleStem(hayWord) || stem === toRoleStem(hayWord)
    }),
  ).length
  return stemHits > 0 ? stemHits * 35 : 0
}

export function matchJobTitles(extracted: string, options: JobTitleOption[], limit = 5) {
  const needle = normalize(extracted)
  if (!needle) return []
  return options
    .map((option) => ({ ...option, score: scoreMatch(needle, normalize(option.name)) }))
    .filter((option) => option.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
