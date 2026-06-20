export function foldSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function foldedIncludes(haystack: string, needle: string): boolean {
  const foldedNeedle = foldSearchText(needle)
  if (!foldedNeedle) return false
  return foldSearchText(haystack).includes(foldedNeedle)
}

export type FoldedSearchFields = {
  firstName: string
  lastName: string
  city: string | null
  postalCode: string | null
  jobTitle: { name: string } | null
}

export function matchesFoldedCandidateSearch(row: FoldedSearchFields, term: string): boolean {
  const fields = [
    row.firstName,
    row.lastName,
    `${row.firstName} ${row.lastName}`,
    row.city ?? '',
    row.postalCode ?? '',
    row.jobTitle?.name ?? '',
  ]
  return fields.some((field) => foldedIncludes(field, term))
}
