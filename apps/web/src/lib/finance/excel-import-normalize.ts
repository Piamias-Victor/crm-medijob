export function normalizeImportLabel(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/** Co-credit Excel cell → first person token sequence before a second known-looking name. */
export function firstReferentLabel(raw: string): string {
  const cleaned = raw.replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  const parts = cleaned.split(' ')
  if (parts.length <= 2) return cleaned
  // "A B C D" with two people → take first two tokens as first person default
  return parts.slice(0, 2).join(' ')
}
