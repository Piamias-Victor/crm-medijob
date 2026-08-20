'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { StatTiles } from '@/components/molecules/StatTiles'
import { buildFacturationKpis } from '@/view-models/facturation-kpi'
import type { FacturationOverview } from '@/view-models/facturation-overview'

type Props = { overview: FacturationOverview }

export function FacturationOverviewPage({ overview }: Props) {
  return (
    <SectionCard
      variant="glass"
      title="Vue d’ensemble"
      description="Compteurs d’état commercial, CA HT accepté et marge."
      bodyClassName="p-4 sm:p-5"
    >
      <StatTiles items={buildFacturationKpis(overview)} />
    </SectionCard>
  )
}
