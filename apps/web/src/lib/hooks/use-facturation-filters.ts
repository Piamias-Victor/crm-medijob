'use client'

import { useCallback, useMemo } from 'react'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import {
  toFacturationSuiviFilters,
  type FacturationFilterValues,
} from '@/lib/filters/facturation-filter-map'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'

export function useFacturationFilters(filterConfig: FacturationFilterConfig) {
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig)
  const setFilters = useCallback((next: FacturationFilterValues) => onChange(next), [onChange])
  const apiFilters = useMemo(() => toFacturationSuiviFilters(filters), [filters])
  return { values, setFilters, reset, apiFilters }
}
