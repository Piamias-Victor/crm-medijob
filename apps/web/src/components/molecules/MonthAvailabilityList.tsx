'use client'

import { MonthAvailabilityWeek } from '@/components/molecules/MonthAvailabilityWeek'
import { visibleMonthWeeks, type MonthGrid } from '@/view-models/weekly-availability-month-grid'
import type { MonthSelectionTarget } from '@/view-models/weekly-availability-month-toggle'

type Props = {
  grid: MonthGrid
  readOnly?: boolean
  onSelect?: (target: MonthSelectionTarget) => void
}

export function MonthAvailabilityList({ grid, readOnly, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {visibleMonthWeeks(grid).map((week) => (
        <MonthAvailabilityWeek
          key={week.weekStart}
          week={week}
          readOnly={readOnly}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
