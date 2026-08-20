import { REFERENT_NONE } from '@/lib/constants/referent-none'
import { matchesIsoDateRange } from '@/lib/finance/match-iso-date-range'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

function matchesReferent(row: FacturationSuiviRow, referentIds: string[]) {
  const wantsNone = referentIds.includes(REFERENT_NONE)
  const ids = referentIds.filter((id) => id !== REFERENT_NONE)
  if (wantsNone && row.referentId == null) return true
  return row.referentId != null && ids.includes(row.referentId)
}

export function matchesFacturationFilters(
  row: FacturationSuiviRow,
  filters: FacturationSuiviFilters,
) {
  if (
    filters.commercialStatuses?.length &&
    !filters.commercialStatuses.includes(row.commercialStatus)
  ) {
    return false
  }
  if (filters.contractTypes?.length && !filters.contractTypes.includes(row.contractType)) {
    return false
  }
  if (filters.pharmacyIds?.length && !filters.pharmacyIds.includes(row.pharmacyId)) {
    return false
  }
  if (filters.referentIds?.length && !matchesReferent(row, filters.referentIds)) {
    return false
  }
  if (!matchesIsoDateRange(row.sentAt, filters.sentFrom, filters.sentTo)) return false
  return matchesIsoDateRange(row.acceptedAt, filters.acceptedFrom, filters.acceptedTo)
}
