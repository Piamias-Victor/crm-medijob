'use client'

import type { MonthSelectionTarget } from '@/view-models/weekly-availability-month-toggle'
import { MONTH_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

type Props = { onSelect: (target: MonthSelectionTarget) => void }

const PICKS: { label: string; target: MonthSelectionTarget }[] = [
  { label: MONTH_AVAILABILITY_COPY.allMonth, target: { kind: 'month' } },
  { label: MONTH_AVAILABILITY_COPY.allMornings, target: { kind: 'period', period: 'AM' } },
  { label: MONTH_AVAILABILITY_COPY.allAfternoons, target: { kind: 'period', period: 'PM' } },
]

export function MonthAvailabilityQuickPicks({ onSelect }: Props) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {PICKS.map((pick) => (
        <button
          key={pick.label}
          type="button"
          onClick={() => onSelect(pick.target)}
          className="min-h-9 shrink-0 rounded-full border border-border bg-white px-4 text-sm font-medium text-fg active:bg-surface"
        >
          {pick.label}
        </button>
      ))}
    </div>
  )
}
