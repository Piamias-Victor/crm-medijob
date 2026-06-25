'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { toContactListFilters, type ContactFilterValues } from '@/lib/filters/contact-filter-map'
import type { ContactFilterConfig } from '@/lib/filters/contact-filter-config'
import type { ContactListRow } from '@/view-models/contact-list'
import type { ContactListFilters } from '@/view-models/contact-list-filters.schema'

export function useContactListQuery(
  initialRows: ContactListRow[],
  serverFilters: ContactListFilters,
  filterConfig: ContactFilterConfig,
  onCountChange?: (count: number) => void,
) {
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig)

  const setFilters = useCallback(
    (next: ContactFilterValues) => onChange(next),
    [onChange],
  )

  const apiFilters = useMemo(() => toContactListFilters(filters), [filters])
  const listQuery = trpc.contact.list.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(listQuery.data, initialRows, apiFilters, serverFilters)

  useEffect(() => {
    onCountChange?.(rows.length)
  }, [rows.length, onCountChange])

  return { values, setFilters, reset, rows, apiFilters }
}
