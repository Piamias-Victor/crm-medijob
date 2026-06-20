export type JobTitleOption = { id: string; name: string }

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

function scoreMatch(needle: string, haystack: string) {
  if (haystack === needle) return 100
  if (haystack.includes(needle) || needle.includes(haystack)) return 80
  const words = needle.split(/\s+/).filter(Boolean)
  const hits = words.filter((word) => haystack.includes(word)).length
  return hits > 0 ? hits * 20 : 0
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
