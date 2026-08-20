'use client'

import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { filtersEqual } from '@/lib/filters/filters-equal'
import { useFacturationFilters } from '@/lib/hooks/use-facturation-filters'
import { EMPTY_FACTURATION_OVERVIEW } from '@/view-models/facturation-overview'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationOverview } from '@/view-models/facturation-overview'

export function useFacturationOverviewQuery(
  initialOverview: FacturationOverview,
  serverFilters: FacturationSuiviFilters,
  filterConfig: FacturationFilterConfig,
) {
  const { values, setFilters, reset, apiFilters } = useFacturationFilters(filterConfig)
  const query = trpc.facturation.overview.useQuery(apiFilters, { placeholderData: keepPreviousData })
  const overview =
    query.data ??
    (filtersEqual(apiFilters, serverFilters) ? initialOverview : EMPTY_FACTURATION_OVERVIEW)

  return { values, setFilters, reset, overview }
}
