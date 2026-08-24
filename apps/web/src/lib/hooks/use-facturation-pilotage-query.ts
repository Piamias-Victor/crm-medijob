'use client'

import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { filtersEqual } from '@/lib/filters/filters-equal'
import { useFacturationPilotageFilters } from '@/lib/hooks/use-facturation-pilotage-filters'
import { EMPTY_PILOTAGE } from '@/view-models/facturation-pilotage'
import type { PilotageFilterConfig } from '@/lib/filters/pilotage-filter-config'
import type { PilotageFilters } from '@/view-models/facturation-pilotage-filters.schema'
import type { Pilotage } from '@/view-models/facturation-pilotage'

export function useFacturationPilotageQuery(
  initialPilotage: Pilotage,
  serverFilters: PilotageFilters,
  filterConfig: PilotageFilterConfig,
) {
  const { values, setFilters, reset, apiFilters } = useFacturationPilotageFilters(filterConfig)
  const query = trpc.facturation.pilotage.useQuery(apiFilters, { placeholderData: keepPreviousData })
  const pilotage =
    query.data ?? (filtersEqual(apiFilters, serverFilters) ? initialPilotage : EMPTY_PILOTAGE)
  return { values, setFilters, reset, pilotage }
}
