'use client'

import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useFacturationLinesFilters } from '@/lib/hooks/use-facturation-lines-filters'
import type { FacturationLinesFilterConfig } from '@/lib/filters/facturation-lines-filter-config'
import type { FacturationLineListFiltersInput } from '@/view-models/facturation-line-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FinanceLineKind } from '@/view-models/finance-line'

export function useFacturationLinesQuery(
  kind: FinanceLineKind,
  initialRows: FacturationSuiviRow[],
  serverFilters: FacturationLineListFiltersInput,
  filterConfig: FacturationLinesFilterConfig,
) {
  const { values, setFilters, reset, apiFilters } = useFacturationLinesFilters(kind, filterConfig)
  const listQuery = trpc.facturation.listLines.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(listQuery.data?.rows, initialRows, apiFilters, serverFilters)
  return { values, setFilters, reset, rows }
}
