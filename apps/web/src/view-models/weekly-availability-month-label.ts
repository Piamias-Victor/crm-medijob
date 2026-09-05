import { weeklyAvailabilityPath } from '@/view-models/weekly-availability-path'
import { firstDayOfMonth } from '@/lib/paris-month'

const MONTH_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function monthLabel(month: string): string {
  const raw = MONTH_FORMAT.format(new Date(`${firstDayOfMonth(month)}T12:00:00.000Z`))
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export function monthHref(token: string, month: string): string {
  return `${weeklyAvailabilityPath(token)}?month=${month}`
}

export function dayNumber(ymd: string): string {
  return String(Number(ymd.slice(8, 10)))
}

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: 'UTC' })

export function dayRowLabel(ymd: string): string {
  const weekday = WEEKDAY_FORMAT.format(new Date(`${ymd}T12:00:00.000Z`))
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${dayNumber(ymd)}`
}

export function weekSectionLabel(days: string[]): string {
  const first = dayNumber(days[0]!)
  const last = dayNumber(days.at(-1)!)
  return first === last ? `Semaine du ${first}` : `Semaine du ${first} au ${last}`
}
