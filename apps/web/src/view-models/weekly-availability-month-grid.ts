import { addDaysYmd, isPastYmd } from '@/lib/paris-week'
import { monthOf, monthWeekStarts } from '@/lib/paris-month'
import type { AvailabilitySlotInput } from '@/view-models/weekly-availability.schema'

export type MonthGridDay = {
  date: string
  inMonth: boolean
  clickable: boolean
  am: boolean
  pm: boolean
}

export type MonthGridWeek = { weekStart: string; days: MonthGridDay[] }

export type MonthGrid = { month: string; weeks: MonthGridWeek[] }

export function toMonthGrid(input: {
  month: string
  slots: AvailabilitySlotInput[]
  now: Date
}): MonthGrid {
  const selected = new Set(input.slots.map((slot) => `${slot.date}:${slot.period}`))
  const weeks = monthWeekStarts(input.month).map((weekStart) => ({
    weekStart,
    days: Array.from({ length: 7 }, (_, index) => {
      const date = addDaysYmd(weekStart, index)
      const inMonth = monthOf(date) === input.month
      return {
        date,
        inMonth,
        clickable: inMonth && !isPastYmd(date, input.now),
        am: selected.has(`${date}:AM`),
        pm: selected.has(`${date}:PM`),
      }
    }),
  }))
  return { month: input.month, weeks }
}

export function visibleMonthWeeks(grid: MonthGrid): MonthGridWeek[] {
  return grid.weeks
    .map((week) => ({ ...week, days: week.days.filter((day) => day.inMonth) }))
    .filter((week) => week.days.length > 0)
}

export function countSelectedHalfDays(grid: MonthGrid): number {
  return selectedMonthSlots(grid).length
}

export function selectedMonthSlots(grid: MonthGrid): AvailabilitySlotInput[] {
  return grid.weeks
    .flatMap((week) => week.days)
    .filter((day) => day.inMonth)
    .flatMap((day) => [
      ...(day.am ? [{ date: day.date, period: 'AM' as const }] : []),
      ...(day.pm ? [{ date: day.date, period: 'PM' as const }] : []),
    ])
}
