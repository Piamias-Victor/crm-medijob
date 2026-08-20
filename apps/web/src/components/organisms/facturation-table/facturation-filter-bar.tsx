'use client'

import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationFilterValues } from '@/lib/filters/facturation-filter-map'

type Props = {
  filterConfig: FacturationFilterConfig
  values: FacturationFilterValues
  onChange: (values: FacturationFilterValues) => void
  onReset: () => void
}

export function FacturationFilterBar({ filterConfig, values, onChange, onReset }: Props) {
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
