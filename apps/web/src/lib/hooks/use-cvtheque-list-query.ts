'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import {
  normalizeCvthequeFilterValues,
  toCandidateListFilters,
  buildCvthequeFilterDefaults,
  type CvthequeFilterValues,
} from '@/lib/filters/cvtheque-filter-map'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import { toCandidateTableRows } from '@/view-models/candidate-list-vm'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

type InitialList = { rows: RawCandidate[]; stages: RawStage[] }

export function useCvthequeListQuery(
  initialList: InitialList,
  serverFilters: CandidateListFilters,
  filterConfig: CvthequeFilterConfig,
  onCountChange?: (count: number) => void,
) {
  const defaults = useMemo(() => buildCvthequeFilterDefaults(filterConfig), [filterConfig])
  const { values, filters, onChange, reset } = useEntityFilters(filterConfig, {
    preserveSearchParams: ['tab'],
  })

  const setFilters = useCallback(
    (next: CvthequeFilterValues) => onChange(normalizeCvthequeFilterValues(next, defaults)),
    [defaults, onChange],
  )

  const apiFilters = useMemo(
    () => toCandidateListFilters(normalizeCvthequeFilterValues(filters, defaults)),
    [defaults, filters],
  )
  const listQuery = trpc.candidate.list.useQuery(apiFilters, {
    placeholderData: keepPreviousData,
  })

  const candidates = resolveEntityListRows(
    listQuery.data?.rows,
    initialList.rows,
    apiFilters,
    serverFilters,
  )
  const stages = listQuery.data?.stages ?? initialList.stages
  const tableRows = useMemo(() => toCandidateTableRows(candidates), [candidates])

  useEffect(() => {
    onCountChange?.(candidates.length)
  }, [candidates.length, onCountChange])

  return { values, setFilters, reset, candidates, stages, tableRows, apiFilters }
}
