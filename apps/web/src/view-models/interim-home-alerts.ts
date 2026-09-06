import { serializeFilters } from '@/lib/filters/serialize'
import { needFilterConfig } from '@/lib/filters/badakan-interim-filters'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'
import { isOpenNeed } from '@/view-models/badakan-need'
import { currentWeekRange, periodOverlapsWeek } from '@/view-models/badakan-period-week'

export function besoinsWeekHref(): string {
  const values = { ...buildDefaultFilterValues(needFilterConfig), week: 'current' }
  const query = serializeFilters(needFilterConfig, values).toString()
  return `/interim/besoins?${query}`
}

export function candidatsCreatedWithinHref(hours: number): string {
  return `/interim/candidats?createdWithinHours=${hours}`
}

export function countUnfilledThisWeek(rows: BadakanNeedListItem[], now = new Date()): number {
  const { start, end } = currentWeekRange(now)
  return rows.filter(
    (row) => isOpenNeed(row) && periodOverlapsWeek(row.periods, start, end),
  ).length
}
