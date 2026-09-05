'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { adjacentMonth } from '@/lib/paris-month'
import { monthLabel } from '@/view-models/weekly-availability-month-label'
import { MONTH_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

type Props = {
  month: string
  onChange: (month: string) => void
}

export function MonthAvailabilityNav({ month, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <NavButton
        label={MONTH_AVAILABILITY_COPY.prevMonth}
        onClick={() => onChange(adjacentMonth(month, -1))}
      >
        <ChevronLeft aria-hidden className="size-5" />
      </NavButton>
      <p className="text-base font-semibold text-fg">{monthLabel(month)}</p>
      <NavButton
        label={MONTH_AVAILABILITY_COPY.nextMonth}
        onClick={() => onChange(adjacentMonth(month, 1))}
      >
        <ChevronRight aria-hidden className="size-5" />
      </NavButton>
    </div>
  )
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full border border-border text-fg-muted active:bg-surface"
    >
      {children}
    </button>
  )
}
