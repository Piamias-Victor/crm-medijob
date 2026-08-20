'use client'

import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

type Props<C extends readonly FilterConfig[]> = {
  filterConfig: C
  values: FilterValues<C>
  onChange: (values: FilterValues<C>) => void
  onReset: () => void
}

export function FacturationFilterBar<C extends readonly FilterConfig[]>({
  filterConfig,
  values,
  onChange,
  onReset,
}: Props<C>) {
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
