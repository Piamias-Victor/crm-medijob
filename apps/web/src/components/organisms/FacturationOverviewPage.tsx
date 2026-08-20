'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { StatTiles } from '@/components/molecules/StatTiles'
import { FacturationFilterBar } from '@/components/organisms/facturation-table/facturation-filter-bar'
import { useFacturationOverviewQuery } from '@/lib/hooks/use-facturation-overview-query'
import { buildFacturationKpis } from '@/view-models/facturation-kpi'
import type { FacturationOverview } from '@/view-models/facturation-overview'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'

type Props = {
  initialOverview: FacturationOverview
  serverFilters: FacturationSuiviFilters
  filterConfig: FacturationFilterConfig
}

export function FacturationOverviewPage({ initialOverview, serverFilters, filterConfig }: Props) {
  const { values, setFilters, reset, overview } = useFacturationOverviewQuery(
    initialOverview,
    serverFilters,
    filterConfig,
  )

  return (
    <div className="space-y-4">
      <FacturationFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
      />
      <SectionCard
        variant="glass"
        title="Vue d’ensemble"
        description="Compteurs d’état commercial, CA HT accepté et marge."
        bodyClassName="p-4 sm:p-5"
      >
        <StatTiles items={buildFacturationKpis(overview)} />
      </SectionCard>
    </div>
  )
}
