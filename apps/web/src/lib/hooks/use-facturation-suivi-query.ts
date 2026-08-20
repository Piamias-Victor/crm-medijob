'use client'

import { useEffect } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useFacturationFilters } from '@/lib/hooks/use-facturation-filters'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function useFacturationSuiviQuery(
  initialRows: FacturationSuiviRow[],
  serverFilters: FacturationSuiviFilters,
  filterConfig: FacturationFilterConfig,
  onCountChange?: (count: number) => void,
) {
  const { values, setFilters, reset, apiFilters } = useFacturationFilters(filterConfig)
  const listQuery = trpc.facturation.listSuivi.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(listQuery.data?.rows, initialRows, apiFilters, serverFilters)

  useEffect(() => {
    onCountChange?.(rows.length)
  }, [rows.length, onCountChange])

  return { values, setFilters, reset, rows }
}
