import { matchesSelection, matchesText } from '@/lib/filters/badakan-filter-match'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'
import { isOpenNeed } from '@/view-models/badakan-need'
import {
  currentWeekRange,
  isCurrentWeekFilter,
  periodOverlapsWeek,
} from '@/view-models/badakan-period-week'

export type NeedMatchValues = {
  q: string
  steps: string[]
  week: string
  ville: string
  departement: string[]
  metier: string
}

function matchesDepartment(postalCode: string | null, departments: string[]): boolean {
  if (departments.length === 0) return true
  if (!postalCode?.trim()) return false
  return departments.some((code) => postalCode.trim().startsWith(code))
}

function matchesNeedStep(row: BadakanNeedListItem, steps: string[]): boolean {
  if (steps.length > 0) return matchesSelection(row.step, steps)
  return isOpenNeed(row)
}

function matchesNeedWeek(row: BadakanNeedListItem, week: string, now: Date): boolean {
  if (!isCurrentWeekFilter(week)) return true
  const { start, end } = currentWeekRange(now)
  return periodOverlapsWeek(row.periods, start, end)
}

export function matchesNeed(
  row: BadakanNeedListItem,
  values: NeedMatchValues,
  now = new Date(),
): boolean {
  return (
    matchesText([row.pharmacyName, row.softwareLabel], values.q) &&
    matchesNeedStep(row, values.steps) &&
    matchesNeedWeek(row, values.week, now) &&
    matchesText([row.cityLabel], values.ville) &&
    matchesDepartment(row.postalCode, values.departement) &&
    matchesText([row.jobTitleLabel], values.metier)
  )
}
