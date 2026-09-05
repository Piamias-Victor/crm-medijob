'use client'

import { cn } from '@/lib/cn'
import { dayNumber } from '@/view-models/weekly-availability-month-label'
import type { MonthGridDay } from '@/view-models/weekly-availability-month-grid'
import type { MonthSelectionTarget } from '@/view-models/weekly-availability-month-toggle'

type Props = {
  day: MonthGridDay
  today: boolean
  onSelect?: (target: MonthSelectionTarget) => void
}

export function AvailabilityCalendarCell({ day, today, onSelect }: Props) {
  if (!day.inMonth) return <div aria-hidden className="rounded-md bg-surface/60" />
  const full = day.am && day.pm
  const editable = Boolean(onSelect) && day.clickable
  return (
    <div
      className={cn(
        'flex min-h-16 flex-col gap-1 rounded-md border p-1',
        full ? 'border-accent-hover bg-accent-muted' : 'border-border bg-white',
        today && 'ring-2 ring-sky',
      )}
    >
      <button
        type="button"
        disabled={!editable}
        onClick={() => onSelect?.({ kind: 'day', date: day.date })}
        className={cn(
          'text-left text-[11px] font-semibold text-fg-muted',
          editable && 'hover:text-fg',
        )}
      >
        {dayNumber(day.date)}
      </button>
      <div className="flex flex-1 flex-col gap-0.5">
        <Half
          label="M"
          on={day.am}
          disabled={!editable}
          onClick={() => onSelect?.({ kind: 'cell', date: day.date, period: 'AM' })}
        />
        <Half
          label="A"
          on={day.pm}
          disabled={!editable}
          onClick={() => onSelect?.({ kind: 'cell', date: day.date, period: 'PM' })}
        />
      </div>
    </div>
  )
}

function Half({
  label,
  on,
  disabled,
  onClick,
}: {
  label: string
  on: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center rounded-sm text-[10px] font-semibold',
        on ? 'bg-accent text-accent-fg' : 'bg-surface text-fg-muted/50',
        !disabled && 'hover:opacity-90',
      )}
    >
      {label}
    </button>
  )
}
