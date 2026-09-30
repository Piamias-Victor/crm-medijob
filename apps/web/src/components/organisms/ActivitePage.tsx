'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { PilotageStatTiles } from '@/components/molecules/PilotageStatTiles'
import { ActivitePeriodForm } from '@/components/molecules/ActivitePeriodForm'
import { ActiviteCharts } from '@/components/molecules/ActiviteCharts'
import { buildActiviteKpis } from '@/view-models/activite-kpis'
import type { ActiviteOverview } from '@/view-models/activite-overview'

type Props = { overview: ActiviteOverview }

export function ActivitePage({ overview }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard
        variant="glass"
        title="Période"
        description="Bornes inclusives (Europe/Paris). Défaut : 30 derniers jours."
        bodyClassName="p-4 sm:p-5"
      >
        <ActivitePeriodForm fromYmd={overview.fromYmd} toYmd={overview.toYmd} />
      </SectionCard>
      <SectionCard
        variant="glass"
        title="Volumes"
        description={`${overview.fromYmd} → ${overview.toYmd}`}
        bodyClassName="p-4 sm:p-5"
      >
        <PilotageStatTiles items={buildActiviteKpis(overview.counts)} />
      </SectionCard>
      <ActiviteCharts entrants={overview.entrants} missions={overview.missions} />
    </div>
  )
}
