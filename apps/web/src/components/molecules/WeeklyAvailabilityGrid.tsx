'use client'

import { WEEKDAY_LABELS, WEEKLY_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'
import type { WeekGridDay } from '@/view-models/weekly-availability-grid'
import { cn } from '@/lib/cn'

type Props = {
  days: WeekGridDay[]
  onToggle: (date: string, period: 'AM' | 'PM') => void
}

export function WeeklyAvailabilityGrid({ days, onToggle }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, i) => (
        <div key={day.date} className="flex flex-col gap-2">
          <p className="text-center text-xs font-medium text-fg-muted">{WEEKDAY_LABELS[i]}</p>
          <SlotButton
            label={WEEKLY_AVAILABILITY_COPY.am}
            selected={day.am}
            disabled={!day.clickable}
            onClick={() => onToggle(day.date, 'AM')}
          />
          <SlotButton
            label={WEEKLY_AVAILABILITY_COPY.pm}
            selected={day.pm}
            disabled={!day.clickable}
            onClick={() => onToggle(day.date, 'PM')}
          />
        </div>
      ))}
    </div>
  )
}

function SlotButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string
  selected: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-md border px-1 py-3 text-xs font-medium transition-colors',
        selected
          ? 'border-accent bg-accent text-accent-fg'
          : 'border-border bg-white text-fg',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      {label}
    </button>
  )
}
