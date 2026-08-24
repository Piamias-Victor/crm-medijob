import { REFERENT_NONE } from '@/lib/constants/referent-none'
import { facturationMonthKey } from '@/view-models/facturation-month-key'
import { matchesFinanceLineSearch } from '@/lib/finance/match-finance-line-search'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { PlacementContractType } from '@/view-models/finance-line'

export type FinanceLineMatchFilters = {
  search?: string
  month?: string
  contractTypes?: PlacementContractType[]
  pharmacyIds?: string[]
  referentIds?: string[]
  cancelled?: boolean
}

function matchesReferent(row: FacturationSuiviRow, referentIds: string[]) {
  const wantsNone = referentIds.includes(REFERENT_NONE)
  const ids = referentIds.filter((id) => id !== REFERENT_NONE)
  if (wantsNone && row.referentId == null) return true
  return row.referentId != null && ids.includes(row.referentId)
}

export function matchesFinanceLineFilters(
  row: FacturationSuiviRow,
  filters: FinanceLineMatchFilters,
) {
  if (!matchesFinanceLineSearch(row, filters.search)) return false
  if (filters.month && (!row.acceptedAt || facturationMonthKey(row.acceptedAt) !== filters.month)) {
    return false
  }
  if (filters.contractTypes?.length) {
    const type = row.contractType
    if (type !== 'CDD' && type !== 'CDI') return false
    if (!filters.contractTypes.includes(type)) return false
  }
  if (filters.pharmacyIds?.length && !filters.pharmacyIds.includes(row.pharmacyId)) return false
  if (filters.referentIds?.length && !matchesReferent(row, filters.referentIds)) return false
  if (filters.cancelled === true && !row.cancelled) return false
  if (filters.cancelled === false && row.cancelled) return false
  return true
}
