import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function matchesFinanceLineSearch(row: FacturationSuiviRow, search?: string) {
  const needle = search?.trim().toLowerCase()
  if (!needle) return true
  return [row.pharmacyName, row.candidateName, row.jobTitle, row.referentName]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(needle))
}
