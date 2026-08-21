import { currentMonthRange } from '@/lib/date-picker-utils'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'

export function applyDefaultAcceptedMonth(
  filters: FacturationSuiviFilters,
  now = new Date(),
): FacturationSuiviFilters {
  if (filters.acceptedFrom || filters.acceptedTo) return filters
  const range = currentMonthRange(now)
  return { ...filters, acceptedFrom: range.from, acceptedTo: range.to }
}
