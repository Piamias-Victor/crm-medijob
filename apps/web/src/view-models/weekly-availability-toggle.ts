import type { WeekGridDay } from './weekly-availability-grid'

export function toggleGridDay(
  days: WeekGridDay[],
  date: string,
  period: 'AM' | 'PM',
): WeekGridDay[] {
  return days.map((day) => {
    if (day.date !== date || !day.clickable) return day
    return period === 'AM' ? { ...day, am: !day.am } : { ...day, pm: !day.pm }
  })
}
