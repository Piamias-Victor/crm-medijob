import type { MonthGrid, MonthGridDay } from '@/view-models/weekly-availability-month-grid'
import type { AvailabilitySlotInput } from '@/view-models/weekly-availability.schema'

type AmPm = AvailabilitySlotInput['period']

export type MonthSelectionTarget =
  | { kind: 'cell'; date: string; period: AmPm }
  | { kind: 'day'; date: string }
  | { kind: 'week'; weekStart: string }
  | { kind: 'period'; period: AmPm }
  | { kind: 'month' }

type Scope = { weekStart: string; day: MonthGridDay }

function inTarget({ weekStart, day }: Scope, target: MonthSelectionTarget): boolean {
  if (target.kind === 'week') return weekStart === target.weekStart
  if (target.kind === 'period' || target.kind === 'month') return true
  return day.date === target.date
}

function periodsOf(target: MonthSelectionTarget): AmPm[] {
  return target.kind === 'cell' || target.kind === 'period' ? [target.period] : ['AM', 'PM']
}

function isSelected(day: MonthGridDay, period: AmPm): boolean {
  return period === 'AM' ? day.am : day.pm
}

export function toggleMonthSelection(grid: MonthGrid, target: MonthSelectionTarget): MonthGrid {
  const periods = periodsOf(target)
  const scoped = grid.weeks.flatMap((week) =>
    week.days
      .filter((day) => day.clickable && inTarget({ weekStart: week.weekStart, day }, target))
      .map((day) => ({ weekStart: week.weekStart, day })),
  )
  const turnOn = !scoped.every(({ day }) => periods.every((period) => isSelected(day, period)))
  const touched = new Set(scoped.map(({ day }) => day.date))
  return {
    ...grid,
    weeks: grid.weeks.map((week) => ({
      ...week,
      days: week.days.map((day) => {
        if (!touched.has(day.date) || !inTarget({ weekStart: week.weekStart, day }, target)) {
          return day
        }
        return {
          ...day,
          ...(periods.includes('AM') ? { am: turnOn } : {}),
          ...(periods.includes('PM') ? { pm: turnOn } : {}),
        }
      }),
    })),
  }
}
