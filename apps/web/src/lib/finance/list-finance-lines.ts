import { toFinanceLineSuiviRow } from '@/lib/finance/to-finance-line-row'
import { matchesFinanceLineFilters } from '@/lib/finance/match-finance-line-filters'
import type { FacturationLineListFiltersInput } from '@/view-models/facturation-line-filters.schema'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function listFinanceLines(
  lines: FinanceLineRecord[],
  filters: FacturationLineListFiltersInput,
): FacturationSuiviRow[] {
  return lines
    .filter((line) => line.kind === filters.kind)
    .map(toFinanceLineSuiviRow)
    .filter((row) => matchesFinanceLineFilters(row, filters))
}
