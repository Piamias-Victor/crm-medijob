'use client'

import type { AvailabilitySummary } from '@/view-models/candidate-availability-summary'
import { CANDIDATE_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

type Props = { summary: AvailabilitySummary }

export function AvailabilitySummaryBar({ summary }: Props) {
  const stats = [
    { label: CANDIDATE_AVAILABILITY_COPY.statTotal, value: summary.total },
    { label: CANDIDATE_AVAILABILITY_COPY.statFullDays, value: summary.fullDays },
    { label: CANDIDATE_AVAILABILITY_COPY.statMornings, value: summary.mornings },
    { label: CANDIDATE_AVAILABILITY_COPY.statAfternoons, value: summary.afternoons },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-md border border-border bg-white px-3 py-2">
          <p className="text-lg font-semibold text-fg">{stat.value}</p>
          <p className="text-xs text-fg-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
