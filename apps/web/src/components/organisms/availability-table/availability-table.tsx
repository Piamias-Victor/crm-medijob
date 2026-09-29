'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { CalendarClock } from 'lucide-react'
import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { availabilityTableColumns } from '@/components/organisms/availability-table/availability-table-columns'
import {
  AVAILABILITY_ADVANCED_FILTER_IDS,
  type AvailabilityFilterConfig,
  type AvailabilityFilterValues,
} from '@/lib/filters/availability-filter-config'
import {
  countActiveAdvancedFilters,
  splitFilterConfig,
} from '@/lib/filters/advanced-filter-utils'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { buildCvthequeReturnPath, cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'

type Props = {
  filterConfig: AvailabilityFilterConfig
  values: AvailabilityFilterValues
  onChange: (values: AvailabilityFilterValues) => void
  onReset: () => void
  rows: DeclaredAvailabilityRow[]
}

export function AvailabilityTable({ filterConfig, values, onChange, onReset, rows }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnPath = useMemo(
    () => buildCvthequeReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const { primary, advanced } = useMemo(
    () => splitFilterConfig(filterConfig, AVAILABILITY_ADVANCED_FILTER_IDS),
    [filterConfig],
  )
  const advancedCount = countActiveAdvancedFilters(
    AVAILABILITY_ADVANCED_FILTER_IDS,
    values,
    buildDefaultFilterValues(filterConfig),
  )

  return (
    <div className="space-y-4">
      <EntityListFilterBar
        primary={[...primary]}
        advanced={[...advanced]}
        values={values}
        onChange={onChange}
        onReset={onReset}
        advancedCount={advancedCount}
      />
      <EntityTable
        rows={rows}
        columns={availabilityTableColumns}
        getRowId={(row) => row.id}
        getRowHref={(row) => cvthequeCandidateHref(row.id, returnPath)}
        emptyIcon={CalendarClock}
        emptyTitle="Aucune dispo déclarée"
        emptyDescription="Personne n’a encore renseigné de créneau sur ces critères."
        sort={sort}
        onSortChange={setSort}
      />
    </div>
  )
}
