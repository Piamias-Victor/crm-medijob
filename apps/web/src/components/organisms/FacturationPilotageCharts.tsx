'use client'

import { FacturationComposedChart } from '@/components/molecules/FacturationComposedChart'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PILOTAGE_CHART_CA_TITLE, PILOTAGE_CHART_MARGE_TITLE } from '@/view-models/facturation-chart-copy'
import {
  PILOTAGE_CA_BARS,
  PILOTAGE_CA_LINES,
  PILOTAGE_MARGE_BARS,
  PILOTAGE_MARGE_LINES,
} from '@/view-models/facturation-pilotage-chart-series'
import type { PilotageCharts } from '@/view-models/facturation-pilotage-charts'

export function FacturationPilotageCharts({ charts }: { charts: PilotageCharts }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <SectionCard variant="glass" title={PILOTAGE_CHART_CA_TITLE} bodyClassName="p-4 sm:p-5">
        <FacturationComposedChart data={charts.ca} bars={PILOTAGE_CA_BARS} lines={PILOTAGE_CA_LINES} />
      </SectionCard>
      <SectionCard variant="glass" title={PILOTAGE_CHART_MARGE_TITLE} bodyClassName="p-4 sm:p-5">
        <FacturationComposedChart data={charts.marge} bars={PILOTAGE_MARGE_BARS} lines={PILOTAGE_MARGE_LINES} />
      </SectionCard>
    </div>
  )
}
