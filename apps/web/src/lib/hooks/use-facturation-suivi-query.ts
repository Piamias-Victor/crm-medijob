'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import {
  toFacturationSuiviFilters,
  type FacturationFilterValues,
} from '@/lib/filters/facturation-filter-map'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function useFacturationSuiviQuery(
  initialRows: FacturationSuiviRow[],
  serverFilters: FacturationSuiviFilters,
  filterConfig: FacturationFilterConfig,
  onCountChange?: (count: number) => void,
) {
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig)
  const setFilters = useCallback((next: FacturationFilterValues) => onChange(next), [onChange])
  const apiFilters = useMemo(() => toFacturationSuiviFilters(filters), [filters])
  const listQuery = trpc.facturation.listSuivi.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(listQuery.data?.rows, initialRows, apiFilters, serverFilters)

  useEffect(() => {
    onCountChange?.(rows.length)
  }, [rows.length, onCountChange])

  return { values, setFilters, reset, rows }
}
