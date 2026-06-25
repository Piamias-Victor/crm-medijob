import type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'

export function buildRadiusBcc(pharmacies: PharmacyInRadiusRow[], selectedIds: string[]) {
  const selected = new Set(selectedIds)
  const emails = pharmacies.filter((row) => selected.has(row.id)).map((row) => row.email)
  return [...new Set(emails)].join(',')
}
