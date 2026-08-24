'use client'

import { useMemo } from 'react'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { FacturationFilterBar } from '@/components/organisms/facturation-table/facturation-filter-bar'
import { buildPilotageFilterDefaults } from '@/lib/filters/pilotage-filter-defaults'
import type { PilotageFilterConfig } from '@/lib/filters/pilotage-filter-config'

type Props = { filterConfig: PilotageFilterConfig }

export function FacturationPilotagePage({ filterConfig }: Props) {
  const defaults = useMemo(() => buildPilotageFilterDefaults(filterConfig), [filterConfig])
  const { values, onChange, reset } = useEntityFilters(filterConfig, { defaults })
  return (
    <div className="space-y-4">
      <FacturationFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={onChange}
        onReset={reset}
      />
    </div>
  )
}
