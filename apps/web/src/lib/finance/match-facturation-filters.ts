import { REFERENT_NONE } from '@/lib/constants/referent-none'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

function dayStartUtc(isoDate: string) {
  return new Date(`${isoDate}T00:00:00.000Z`)
}

function dayEndUtc(isoDate: string) {
  return new Date(`${isoDate}T23:59:59.999Z`)
}

function matchesSentAt(row: FacturationSuiviRow, filters: FacturationSuiviFilters) {
  if (!filters.sentFrom && !filters.sentTo) return true
  if (!row.sentAt) return false
  if (filters.sentFrom && row.sentAt < dayStartUtc(filters.sentFrom)) return false
  if (filters.sentTo && row.sentAt > dayEndUtc(filters.sentTo)) return false
  return true
}

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
  return matchesSentAt(row, filters)
}
