'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ASAP_DATE_LABEL, monthLabel, WEEKDAY_LABELS } from '@/lib/date-picker-utils'

type Props = {
  view: Date
  selected: Date | null
  today: Date
  days: (Date | null)[]
  onPrev: () => void
  onNext: () => void
  onPick: (date: Date) => void
  onClear: () => void
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export function DatePickerPanel({ view, selected, today, days, onPrev, onNext, onPick, onClear }: Props) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={onPrev} className="rounded-md p-1 hover:bg-surface" aria-label="Mois précédent">
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold capitalize">
          {monthLabel(view.getMonth())} {view.getFullYear()}
        </span>
        <button type="button" onClick={onNext} className="rounded-md p-1 hover:bg-surface" aria-label="Mois suivant">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-fg-muted">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) =>
          day ? (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onPick(day)}
              className={cn(
                'rounded-md py-1.5 text-sm transition-colors hover:bg-accent-muted',
                selected && sameDay(day, selected) && 'bg-accent text-primary-fg hover:bg-accent-hover',
                !selected && sameDay(day, today) && 'font-semibold text-accent',
              )}
            >
              {day.getDate()}
            </button>
          ) : (
            <span key={`pad-${i}`} />
          ),
        )}
      </div>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-border py-1.5 text-xs text-fg-muted hover:bg-surface"
      >
        <X className="size-3" /> {ASAP_DATE_LABEL}
      </button>
    </>
  )
}
