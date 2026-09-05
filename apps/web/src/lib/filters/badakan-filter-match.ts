function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function matchesText(fields: (string | null | undefined)[], query: string): boolean {
  const needle = normalize(query.trim())
  if (!needle) return true
  return fields.some((field) => (field ? normalize(field).includes(needle) : false))
}

export function matchesSelection(value: string, selected: string[]): boolean {
  return selected.length === 0 || selected.includes(value)
}
