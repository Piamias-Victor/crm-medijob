import { addDaysYmd } from '@/lib/paris-week'

export function weekRangeLabel(weekStart: string): string {
  const end = addDaysYmd(weekStart, 6)
  return `${toFr(weekStart)} – ${toFr(end)}`
}

function toFr(ymd: string): string {
  const [y, m, d] = ymd.split('-')
  return `${d}/${m}/${y}`
}
