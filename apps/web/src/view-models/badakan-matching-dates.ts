import type { PeriodLike } from '@/view-models/badakan-mission-periods'

function ymd(value: string): string | null {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value)
  if (match) return match[1]!
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

export function missionDateRange(
  periods: PeriodLike[],
): { from: string; to: string } | null {
  let from: string | null = null
  let to: string | null = null
  for (const period of periods) {
    const start = period.start ? ymd(period.start) : null
    const end = period.end ? ymd(period.end) : start
    if (start && (!from || start < from)) from = start
    if (end && (!to || end > to)) to = end
  }
  if (!from || !to) return null
  return { from, to }
}
