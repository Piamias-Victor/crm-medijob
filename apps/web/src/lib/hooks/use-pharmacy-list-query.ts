'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { toPharmacyListFilters, type PharmacyFilterValues } from '@/lib/filters/pharmacy-filter-map'
import type { PharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import type { PharmacyListFilters } from '@/view-models/pharmacy-list-filters.schema'

export function usePharmacyListQuery(
  initialRows: PharmacyListRow[],
  serverFilters: PharmacyListFilters,
  filterConfig: PharmacyFilterConfig,
  onCountChange?: (count: number) => void,
) {
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig)

  const setFilters = useCallback(
    (next: PharmacyFilterValues) => onChange(next),
    [onChange],
  )

  const apiFilters = useMemo(() => toPharmacyListFilters(filters), [filters])
  const listQuery = trpc.pharmacy.list.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(listQuery.data, initialRows, apiFilters, serverFilters)

  useEffect(() => {
    onCountChange?.(rows.length)
  }, [rows.length, onCountChange])

  return { values, setFilters, reset, rows, apiFilters }
}
