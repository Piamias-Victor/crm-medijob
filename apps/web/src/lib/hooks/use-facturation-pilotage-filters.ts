'use client'

import { useMemo } from 'react'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { buildPilotageFilterDefaults } from '@/lib/filters/pilotage-filter-defaults'
import { toPilotageFilters } from '@/lib/filters/pilotage-filter-map'
import type { PilotageFilterConfig } from '@/lib/filters/pilotage-filter-config'

export function useFacturationPilotageFilters(filterConfig: PilotageFilterConfig) {
  const defaults = useMemo(() => buildPilotageFilterDefaults(filterConfig), [filterConfig])
  const { values, onChange, reset } = useEntityFilters(filterConfig, { defaults })
  const apiFilters = useMemo(() => toPilotageFilters(values), [values])
  return { values, setFilters: onChange, reset, apiFilters }
}
