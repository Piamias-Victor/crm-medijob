'use client'

import { AvailabilityCalendarCell } from '@/components/molecules/AvailabilityCalendarCell'
import { parisYmd } from '@/lib/paris-week'
import { weekSectionLabel } from '@/view-models/weekly-availability-month-label'
import { WEEKDAY_LABELS } from '@/view-models/weekly-availability-copy'
import type { MonthGrid } from '@/view-models/weekly-availability-month-grid'
import type { MonthSelectionTarget } from '@/view-models/weekly-availability-month-toggle'

type Props = {
  grid: MonthGrid
  onSelect?: (target: MonthSelectionTarget) => void
}

const COLUMNS = 'grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] gap-1'

export function AvailabilityCalendar({ grid, onSelect }: Props) {
  const today = parisYmd(new Date())
  return (
    <div className="flex flex-col gap-1">
      <div className={COLUMNS}>
        <span aria-hidden />
        {WEEKDAY_LABELS.map((label) => (
          <p key={label} className="text-center text-xs font-medium text-fg-muted">
            {label}
          </p>
        ))}
      </div>
      {grid.weeks.map((week) => (
        <div key={week.weekStart} className={COLUMNS}>
          <p className="self-center text-[11px] text-fg-muted">
            {weekSectionLabel(week.days.filter((day) => day.inMonth).map((day) => day.date)).replace(
              'Semaine du ',
              '',
            )}
          </p>
          {week.days.map((day) => (
            <AvailabilityCalendarCell
              key={day.date}
              day={day}
              today={day.date === today}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
