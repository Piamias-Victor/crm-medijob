import { visibleMonthWeeks, type MonthGrid } from '@/view-models/weekly-availability-month-grid'

export type AvailabilitySummary = {
  total: number
  fullDays: number
  mornings: number
  afternoons: number
}

export function availabilitySummary(grid: MonthGrid): AvailabilitySummary {
  const days = visibleMonthWeeks(grid).flatMap((week) => week.days)
  const mornings = days.filter((day) => day.am).length
  const afternoons = days.filter((day) => day.pm).length
  return {
    total: mornings + afternoons,
    fullDays: days.filter((day) => day.am && day.pm).length,
    mornings,
    afternoons,
  }
}
