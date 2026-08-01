'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { toMissionListFilters, type MissionFilterValues } from '@/lib/filters/mission-filter-map'
import type { MissionFilterConfig } from '@/lib/filters/mission-filter-config'
import type { MissionListFilters } from '@/view-models/mission-list-filters.schema'
import type { RawMission } from '@/view-models/mission-kanban.types'

export function useMissionListQuery(
  initialRows: RawMission[],
  serverFilters: MissionListFilters,
  filterConfig: MissionFilterConfig,
  onCountChange?: (count: number) => void,
) {
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig)

  const setFilters = useCallback(
    (next: MissionFilterValues) => onChange(next),
    [onChange],
  )

  const apiFilters = useMemo(() => toMissionListFilters(filters), [filters])
  const listQuery = trpc.mission.list.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })
  const rows = resolveEntityListRows(
    listQuery.data?.rows,
    initialRows,
    apiFilters,
    serverFilters,
  )

  useEffect(() => {
    onCountChange?.(rows.length)
  }, [rows.length, onCountChange])

  return { values, setFilters, reset, rows, apiFilters }
}
