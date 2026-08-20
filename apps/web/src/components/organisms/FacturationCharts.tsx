'use client'

import { FacturationBarChart } from '@/components/molecules/FacturationBarChart'
import { SectionCard } from '@/components/molecules/SectionCard'
import { FACTURATION_CHART_TITLES } from '@/view-models/facturation-chart-copy'
import type { FacturationSlices } from '@/view-models/facturation-slice-bucket'

const CHARTS = [
  { key: 'byReferent', title: FACTURATION_CHART_TITLES.byReferent },
  { key: 'byPharmacy', title: FACTURATION_CHART_TITLES.byPharmacy },
  { key: 'byContract', title: FACTURATION_CHART_TITLES.byContract },
  { key: 'byMonth', title: FACTURATION_CHART_TITLES.byMonth },
] as const

type Props = { slices: FacturationSlices }

export function FacturationCharts({ slices }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {CHARTS.map((chart) => (
        <SectionCard
          key={chart.key}
          variant="glass"
          title={chart.title}
          bodyClassName="p-4 sm:p-5"
        >
          <FacturationBarChart data={slices[chart.key]} />
        </SectionCard>
      ))}
    </div>
  )
}
