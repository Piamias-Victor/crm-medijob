'use client'

import { useCallback, useMemo } from 'react'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { FACTURATION_OVERVIEW_DATE_QUERY_KEYS } from '@/lib/filters/facturation-filter-config'
import {
  toFacturationSuiviFilters,
  type FacturationFilterValues,
} from '@/lib/filters/facturation-filter-map'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'

export function useFacturationFilters(filterConfig: FacturationFilterConfig) {
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig, {
    preserveSearchParams: FACTURATION_OVERVIEW_DATE_QUERY_KEYS,
  })
  const setFilters = useCallback((next: FacturationFilterValues) => onChange(next), [onChange])
  const apiFilters = useMemo(() => toFacturationSuiviFilters(filters), [filters])
  return { values, setFilters, reset, apiFilters }
}
