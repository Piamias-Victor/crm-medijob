'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { AvailabilityTable } from '@/components/organisms/availability-table/availability-table'
import { useAvailabilitySearchQuery } from '@/lib/hooks/use-availability-search-query'
import { interimCountLabel } from '@/view-models/interim-count-label'
import type { AvailabilityFilterConfig } from '@/lib/filters/availability-filter-config'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'
import type { AvailabilitySearchFilters } from '@/view-models/weekly-availability-search.schema'

type Props = {
  initialRows: DeclaredAvailabilityRow[]
  serverFilters: AvailabilitySearchFilters
  filterConfig: AvailabilityFilterConfig
}

export function AvailabilitySearchPage({ initialRows, serverFilters, filterConfig }: Props) {
  const [count, setCount] = useState(initialRows.length)
  const { values, setFilters, reset, rows } = useAvailabilitySearchQuery(
    initialRows,
    serverFilters,
    filterConfig,
    setCount,
  )

  return (
    <SectionCard
      title="Disponibilités déclarées"
      description={`${interimCountLabel(count, 'candidat')} à venir, depuis les créneaux remplis par les candidats.`}
    >
      <AvailabilityTable
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
        rows={rows}
      />
    </SectionCard>
  )
}
