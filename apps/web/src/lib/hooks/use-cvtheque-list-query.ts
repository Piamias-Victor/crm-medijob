'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { trpc } from '@/lib/trpc/client'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import {
  normalizeCvthequeFilterValues,
  toCandidateListFilters,
  buildCvthequeFilterDefaults,
  type CvthequeFilterValues,
} from '@/lib/filters/cvtheque-filter-map'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import { toCandidateTableRows } from '@/view-models/candidate-list-vm'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

type InitialList = { rows: RawCandidate[]; stages: RawStage[] }

export function useCvthequeListQuery(
  initialList: InitialList,
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
    initialData: initialList,
    placeholderData: (previous) => previous,
  })

  const candidates = listQuery.data?.rows ?? initialList.rows
  const stages = listQuery.data?.stages ?? initialList.stages
  const tableRows = useMemo(() => toCandidateTableRows(candidates), [candidates])

  useEffect(() => {
    onCountChange?.(candidates.length)
  }, [candidates.length, onCountChange])

  return { values, setFilters, reset, candidates, stages, tableRows, apiFilters, defaults }
}
