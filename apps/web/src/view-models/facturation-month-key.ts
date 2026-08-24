import { monthLabel } from '@/lib/date-picker-utils'

export function facturationMonthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function facturationMonthLabel(date: Date): string {
  return `${monthLabel(date.getUTCMonth())} ${date.getUTCFullYear()}`
}

export function facturationMonthLabelFromKey(month: string) {
  const [year, monthNum] = month.split('-').map(Number)
  return facturationMonthLabel(new Date(Date.UTC(year ?? 0, (monthNum ?? 1) - 1, 1)))
}
