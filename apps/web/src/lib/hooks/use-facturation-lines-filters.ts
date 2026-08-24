'use client'

import { useCallback, useMemo } from 'react'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import {
  buildFacturationLinesFilterDefaults,
  toFacturationLineListFilters,
  type FacturationLinesFilterValues,
} from '@/lib/filters/facturation-lines-filter-map'
import type { FacturationLinesFilterConfig } from '@/lib/filters/facturation-lines-filter-config'
import type { FinanceLineKind } from '@/view-models/finance-line'

export function useFacturationLinesFilters(
  kind: FinanceLineKind,
  filterConfig: FacturationLinesFilterConfig,
) {
  const defaults = useMemo(() => buildFacturationLinesFilterDefaults(filterConfig), [filterConfig])
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig, { defaults })
  const setFilters = useCallback(
    (next: FacturationLinesFilterValues) => onChange(next),
    [onChange],
  )
  const apiFilters = useMemo(
    () => toFacturationLineListFilters(kind, filters),
    [filters, kind],
  )
  return { values, setFilters, reset, apiFilters }
}
