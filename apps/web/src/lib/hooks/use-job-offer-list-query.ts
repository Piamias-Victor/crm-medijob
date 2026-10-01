'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import {
  toJobOfferListFilters,
  type JobOfferFilterValues,
} from '@/lib/filters/job-offer-filter-map'
import type { JobOfferFilterConfig } from '@/lib/filters/job-offer-filter-config'
import type { JobOfferListFilters } from '@/view-models/job-offer-list-filters.schema'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

export function useJobOfferListQuery(
  initialRows: JobOfferListRow[],
  serverFilters: JobOfferListFilters,
  filterConfig: JobOfferFilterConfig,
  onCountChange?: (count: number) => void,
) {
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig)
  const setFilters = useCallback(
    (next: JobOfferFilterValues) => onChange(next),
    [onChange],
  )
  const apiFilters = useMemo(() => toJobOfferListFilters(filters), [filters])
  const listQuery = trpc.jobOffer.list.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(
    listQuery.data,
    initialRows,
    apiFilters,
    serverFilters,
  )

  useEffect(() => {
    onCountChange?.(rows.length)
  }, [rows.length, onCountChange])

  return { values, setFilters, reset, rows }
}
