'use client'

import { useState } from 'react'
import { AvailabilityTable } from '@/components/organisms/availability-table/availability-table'
import { useAvailabilitySearchQuery } from '@/lib/hooks/use-availability-search-query'
import type { AvailabilityFilterConfig } from '@/lib/filters/availability-filter-config'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'
import type { AvailabilitySearchFilters } from '@/view-models/weekly-availability-search.schema'

type Props = {
  initialRows: DeclaredAvailabilityRow[]
  serverFilters: AvailabilitySearchFilters
  filterConfig: AvailabilityFilterConfig
  onCountChange?: (count: number) => void
  syncUrl?: boolean
}

export function InterimHomeDisponPanel({
  initialRows,
  serverFilters,
  filterConfig,
  onCountChange,
  syncUrl = false,
}: Props) {
  const [, setCount] = useState(initialRows.length)
  const { values, setFilters, reset, rows } = useAvailabilitySearchQuery(
    initialRows,
    serverFilters,
    filterConfig,
    (count) => {
      setCount(count)
      onCountChange?.(count)
    },
    { syncUrl },
  )

  return (
    <AvailabilityTable
      filterConfig={filterConfig}
      values={values}
      onChange={setFilters}
      onReset={reset}
      rows={rows}
    />
  )
}
