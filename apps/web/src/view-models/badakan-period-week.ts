import type { PeriodLike } from '@/view-models/badakan-mission-periods'
import { addDaysYmd, currentMonday, parisYmd } from '@/lib/paris-week'

function ymdOf(value: string | null): string | null {
  if (!value) return null
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value)
  return match?.[1] ?? null
}

/** True if any period overlaps [weekStart, weekStart+6] (inclusive, Paris YMD). */
export function periodOverlapsWeek(
  periods: PeriodLike[],
  weekStart: string,
  weekEnd = addDaysYmd(weekStart, 6),
): boolean {
  return periods.some((period) => {
    const start = ymdOf(period.start) ?? ymdOf(period.end)
    const end = ymdOf(period.end) ?? ymdOf(period.start)
    if (!start || !end) return false
    return start <= weekEnd && end >= weekStart
  })
}

export function currentWeekRange(now = new Date()): { start: string; end: string } {
  const start = currentMonday(now)
  return { start, end: addDaysYmd(start, 6) }
}

export function isCurrentWeekFilter(value: string): boolean {
  return value === 'current'
}

export function todayYmd(now = new Date()): string {
  return parisYmd(now)
}
