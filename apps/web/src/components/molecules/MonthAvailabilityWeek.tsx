'use client'

import { MonthAvailabilityDayRow } from '@/components/molecules/MonthAvailabilityDayRow'
import { weekSectionLabel } from '@/view-models/weekly-availability-month-label'
import { MONTH_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'
import type { MonthGridWeek } from '@/view-models/weekly-availability-month-grid'
import type { MonthSelectionTarget } from '@/view-models/weekly-availability-month-toggle'

type Props = {
  week: MonthGridWeek
  readOnly?: boolean
  onSelect?: (target: MonthSelectionTarget) => void
}

export function MonthAvailabilityWeek({ week, readOnly, onSelect }: Props) {
  const openDays = week.days.some((day) => day.clickable)
  return (
    <section className="rounded-2xl border border-border bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-fg">
          {weekSectionLabel(week.days.map((day) => day.date))}
        </h2>
        {readOnly || !openDays ? null : (
          <button
            type="button"
            onClick={() => onSelect?.({ kind: 'week', weekStart: week.weekStart })}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted active:bg-surface"
          >
            {MONTH_AVAILABILITY_COPY.wholeWeek}
          </button>
        )}
      </div>
      <div className="divide-y divide-border">
        {week.days.map((day) => (
          <MonthAvailabilityDayRow
            key={day.date}
            day={day}
            readOnly={readOnly}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
