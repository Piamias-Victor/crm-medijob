'use client'

import { useMemo } from 'react'
import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { PharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyFilterValues } from '@/lib/filters/pharmacy-filter-map'
import {
  buildPharmacyFilterDefaults,
  countPharmacyAdvancedFilters,
  splitPharmacyFilterConfig,
} from '@/lib/filters/pharmacy-filter-utils'

type Props = {
  filterConfig: PharmacyFilterConfig
  values: PharmacyFilterValues
  onChange: (values: PharmacyFilterValues) => void
  onReset: () => void
}

export function PharmacyFilterBar({ filterConfig, values, onChange, onReset }: Props) {
  const { primary, advanced } = useMemo(() => splitPharmacyFilterConfig(filterConfig), [filterConfig])
  const defaults = useMemo(() => buildPharmacyFilterDefaults(filterConfig), [filterConfig])

  return (
    <EntityListFilterBar
      primary={primary}
      advanced={advanced}
      values={values}
      onChange={onChange}
      onReset={onReset}
      advancedCount={countPharmacyAdvancedFilters(values, defaults)}
    />
  )
}
