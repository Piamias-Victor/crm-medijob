'use client'

import { useCallback, useMemo } from 'react'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { applyDefaultAcceptedMonth } from '@/lib/finance/apply-default-accepted-month'
import {
  FACTURATION_LIST_DATE_QUERY_KEYS,
  type FacturationOverviewFilterConfig,
} from '@/lib/filters/facturation-filter-config'
import { mergeEmptyDateRanges } from '@/lib/filters/merge-empty-date-ranges'
import {
  buildFacturationOverviewFilterDefaults,
  toFacturationOverviewFilters,
  type FacturationOverviewFilterValues,
} from '@/lib/filters/facturation-filter-map'

export function useFacturationOverviewFilters(filterConfig: FacturationOverviewFilterConfig) {
  const defaults = useMemo(() => buildFacturationOverviewFilterDefaults(filterConfig), [filterConfig])
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig, {
    defaults,
    preserveSearchParams: FACTURATION_LIST_DATE_QUERY_KEYS,
  })
  const setFilters = useCallback(
    (next: FacturationOverviewFilterValues) => {
      onChange(mergeEmptyDateRanges(filterConfig, next, defaults))
    },
    [defaults, filterConfig, onChange],
  )
  const apiFilters = useMemo(
    () => applyDefaultAcceptedMonth(toFacturationOverviewFilters(filters)),
    [filters],
  )
  return { values, setFilters, reset, apiFilters }
}
