import { addDaysYmd } from '@/lib/paris-week'

export function weeklyAvailabilityPath(token: string): string {
  return `/dispo/${token}`
}

export function weeklyAvailabilityUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/$/, '')}${weeklyAvailabilityPath(token)}`
}

export function weekHref(token: string, weekStart: string): string {
  return `${weeklyAvailabilityPath(token)}?week=${weekStart}`
}

export function adjacentWeekStart(weekStart: string, direction: -1 | 1): string {
  return addDaysYmd(weekStart, direction * 7)
}
