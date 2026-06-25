'use client'

import { useMemo } from 'react'
import { CvthequeExportButton } from '@/components/organisms/cvtheque-table/cvtheque-export-button'
import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'
import {
  buildCvthequeFilterDefaults,
  countCvthequeAdvancedFilters,
  splitCvthequeFilterConfig,
} from '@/lib/filters/cvtheque-filter-utils'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

type Props = {
  filterConfig: CvthequeFilterConfig
  values: CvthequeFilterValues
  onChange: (values: CvthequeFilterValues) => void
  onReset: () => void
  exportFilters: CandidateListFilters
  sort: EntityTableSortState | null
  exportDisabled?: boolean
}

export function CvthequeFilterBar({
  filterConfig,
  values,
  onChange,
  onReset,
  exportFilters,
  sort,
  exportDisabled = false,
}: Props) {
  const { primary, advanced } = useMemo(() => splitCvthequeFilterConfig(filterConfig), [filterConfig])
  const defaults = useMemo(() => buildCvthequeFilterDefaults(filterConfig), [filterConfig])

  return (
    <EntityListFilterBar
      primary={primary}
      advanced={advanced}
      values={values}
      onChange={onChange}
      onReset={onReset}
      advancedCount={countCvthequeAdvancedFilters(values, defaults)}
      trailing={
        <CvthequeExportButton filters={exportFilters} sort={sort} disabled={exportDisabled} />
      }
    />
  )
}
