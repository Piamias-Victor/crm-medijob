'use client'

import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { JobOfferFilterConfig } from '@/lib/filters/job-offer-filter-config'
import type { JobOfferFilterValues } from '@/lib/filters/job-offer-filter-map'

type Props = {
  filterConfig: JobOfferFilterConfig
  values: JobOfferFilterValues
  onChange: (values: JobOfferFilterValues) => void
  onReset: () => void
}

export function JobOfferFilterBar({ filterConfig, values, onChange, onReset }: Props) {
  return (
    <EntityListFilterBar
      primary={[...filterConfig]}
      advanced={[]}
      values={values}
      onChange={onChange}
      onReset={onReset}
      advancedCount={0}
    />
  )
}
