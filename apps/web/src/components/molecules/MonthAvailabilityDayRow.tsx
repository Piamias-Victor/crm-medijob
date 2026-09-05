'use client'

import { SlotToggle } from '@/components/atoms/SlotToggle'
import { cn } from '@/lib/cn'
import { dayRowLabel } from '@/view-models/weekly-availability-month-label'
import {
  MONTH_AVAILABILITY_COPY,
  WEEKLY_AVAILABILITY_COPY,
} from '@/view-models/weekly-availability-copy'
import type { MonthGridDay } from '@/view-models/weekly-availability-month-grid'
import type { MonthSelectionTarget } from '@/view-models/weekly-availability-month-toggle'

type Props = {
  day: MonthGridDay
  readOnly?: boolean
  onSelect?: (target: MonthSelectionTarget) => void
}

export function MonthAvailabilityDayRow({ day, readOnly, onSelect }: Props) {
  const locked = readOnly || !day.clickable
  return (
    <div className="flex items-center gap-2 py-2">
      <button
        type="button"
        disabled={locked}
        title={MONTH_AVAILABILITY_COPY.wholeDay}
        onClick={() => onSelect?.({ kind: 'day', date: day.date })}
        className={cn(
          'w-24 shrink-0 text-left text-sm font-medium text-fg disabled:cursor-default',
          !day.clickable && 'text-fg-muted line-through',
        )}
      >
        {dayRowLabel(day.date)}
      </button>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <SlotToggle
          label={WEEKLY_AVAILABILITY_COPY.am}
          selected={day.am}
          disabled={!day.clickable}
          readOnly={readOnly}
          onClick={() => onSelect?.({ kind: 'cell', date: day.date, period: 'AM' })}
        />
        <SlotToggle
          label={WEEKLY_AVAILABILITY_COPY.pm}
          selected={day.pm}
          disabled={!day.clickable}
          readOnly={readOnly}
          onClick={() => onSelect?.({ kind: 'cell', date: day.date, period: 'PM' })}
        />
      </div>
    </div>
  )
}
