'use client'

import { useEffect, useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import {
  toAvailabilityFilterValues,
  toAvailabilitySearchFilters,
} from '@/lib/filters/availability-filter-map'
import type { AvailabilityFilterConfig } from '@/lib/filters/availability-filter-config'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'
import type { AvailabilitySearchFilters } from '@/view-models/weekly-availability-search.schema'

export function useAvailabilitySearchQuery(
  initialRows: DeclaredAvailabilityRow[],
  serverFilters: AvailabilitySearchFilters,
  filterConfig: AvailabilityFilterConfig,
  onCountChange?: (count: number) => void,
  options: { syncUrl?: boolean } = {},
) {
  const syncUrl = options.syncUrl ?? true
  const defaults = useMemo(
    () => (syncUrl ? undefined : toAvailabilityFilterValues(filterConfig, serverFilters)),
    [filterConfig, serverFilters, syncUrl],
  )
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig, {
    syncUrl,
    defaults,
  })
  const apiFilters = useMemo(() => toAvailabilitySearchFilters(filters), [filters])
  const listQuery = trpc.weeklyAvailability.search.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(listQuery.data, initialRows, apiFilters, serverFilters)

  useEffect(() => {
    onCountChange?.(rows.length)
  }, [rows.length, onCountChange])

  return { values, setFilters: onChange, reset, rows }
}
