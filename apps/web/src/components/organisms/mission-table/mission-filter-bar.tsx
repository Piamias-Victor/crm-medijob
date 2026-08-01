'use client'

import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { MissionFilterConfig } from '@/lib/filters/mission-filter-config'
import type { MissionFilterValues } from '@/lib/filters/mission-filter-map'

type Props = {
  filterConfig: MissionFilterConfig
  values: MissionFilterValues
  onChange: (values: MissionFilterValues) => void
  onReset: () => void
}

export function MissionFilterBar({ filterConfig, values, onChange, onReset }: Props) {
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
