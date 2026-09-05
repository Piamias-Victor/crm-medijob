import { addDaysYmd, mondayOf, parisYmd } from '@/lib/paris-week'

export function monthOf(ymd: string): string {
  return ymd.slice(0, 7)
}

export function currentMonth(now: Date): string {
  return monthOf(parisYmd(now))
}

export function firstDayOfMonth(month: string): string {
  return `${month}-01`
}

export function lastDayOfMonth(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return new Date(Date.UTC(y!, m!, 0, 12)).toISOString().slice(0, 10)
}

export function adjacentMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const shifted = new Date(Date.UTC(y!, m! - 1 + delta, 1, 12))
  return shifted.toISOString().slice(0, 7)
}

export function monthWeekStarts(month: string): string[] {
  const last = mondayOf(lastDayOfMonth(month))
  const starts: string[] = []
  for (let cursor = mondayOf(firstDayOfMonth(month)); cursor <= last; cursor = addDaysYmd(cursor, 7)) {
    starts.push(cursor)
  }
  return starts
}
