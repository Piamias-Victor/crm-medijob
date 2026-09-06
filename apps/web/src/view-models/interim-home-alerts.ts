import { serializeFilters } from '@/lib/filters/serialize'
import { needFilterConfig } from '@/lib/filters/badakan-interim-filters'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'
import { isOpenNeed } from '@/view-models/badakan-need'
import { currentWeekRange, periodOverlapsWeek } from '@/view-models/badakan-period-week'

export type HomeAlertMissionItem = {
  id: string
  pharmacyName: string
  jobTitleLabel: string
  periodLabel: string
  href: string
}

export type HomeAlertCandidateItem = {
  id: string
  name: string
  jobTitle: string | null
  href: string
}

export function besoinsWeekHref(): string {
  const values = { ...buildDefaultFilterValues(needFilterConfig), week: 'current' }
  const query = serializeFilters(needFilterConfig, values).toString()
  return `/interim/besoins?${query}`
}

export function candidatsCreatedWithinHref(hours: number): string {
  return `/interim/candidats?createdWithinHours=${hours}`
}

export function listUnfilledThisWeek(
  rows: BadakanNeedListItem[],
  now = new Date(),
): HomeAlertMissionItem[] {
  const { start, end } = currentWeekRange(now)
  return rows
    .filter((row) => isOpenNeed(row) && periodOverlapsWeek(row.periods, start, end))
    .map((row) => ({
      id: row.id,
      pharmacyName: row.pharmacyName,
      jobTitleLabel: row.jobTitleLabel,
      periodLabel: row.periodLabel,
      href: row.href,
    }))
}

export function countUnfilledThisWeek(rows: BadakanNeedListItem[], now = new Date()): number {
  return listUnfilledThisWeek(rows, now).length
}

export function toHomeAlertCandidates(
  rows: Array<{
    id: string
    firstName: string
    lastName: string
    jobTitle: { name: string } | null
  }>,
): HomeAlertCandidateItem[] {
  return rows.map((row) => ({
    id: row.id,
    name: `${row.firstName} ${row.lastName}`.trim(),
    jobTitle: row.jobTitle?.name ?? null,
    href: `/candidats/${row.id}`,
  }))
}
