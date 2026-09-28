'use client'

import { useMemo } from 'react'
import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { AppIntakeFilterConfig } from '@/lib/filters/app-intake-filter-config'
import type { FilterValues } from '@/lib/filters/filter-types'
import {
  buildAppIntakeFilterDefaults,
  countAppIntakeAdvancedFilters,
  splitAppIntakeFilterConfig,
} from '@/lib/filters/app-intake-filter-utils'

type Values = FilterValues<AppIntakeFilterConfig>
type Props = {
  filterConfig: AppIntakeFilterConfig
  values: Values
  onChange: (values: Values) => void
  onReset: () => void
}

export function AppIntakeFilterBar({ filterConfig, values, onChange, onReset }: Props) {
  const { primary, advanced } = useMemo(
    () => splitAppIntakeFilterConfig(filterConfig),
    [filterConfig],
  )
  const defaults = useMemo(() => buildAppIntakeFilterDefaults(filterConfig), [filterConfig])
  return (
    <EntityListFilterBar
      primary={[...primary]}
      advanced={[...advanced]}
      values={values}
      onChange={onChange}
      onReset={onReset}
      advancedCount={countAppIntakeAdvancedFilters(values, defaults)}
    />
  )
}
