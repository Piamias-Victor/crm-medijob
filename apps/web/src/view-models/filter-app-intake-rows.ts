import { REFERENT_NONE } from '@/lib/constants/referent-none'
import type { FilterValues } from '@/lib/filters/filter-types'
import type { AppIntakeFilterConfig } from '@/lib/filters/app-intake-filter-config'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import { matchesAppIntakeSearch } from '@/view-models/app-intake-search'
import { dateInRange } from '@/view-models/date-in-range'

export function filterAppIntakeRows(
  rows: AppProfileListItem[],
  values: FilterValues<AppIntakeFilterConfig>,
): AppProfileListItem[] {
  return rows.filter((row) => matchesAppIntakeFilters(row, values))
}

function matchesAppIntakeFilters(
  row: AppProfileListItem,
  values: FilterValues<AppIntakeFilterConfig>,
): boolean {
  if (!matchesAppIntakeSearch(row, values.q)) return false
  if (values.intakeStatus.length > 0 && !values.intakeStatus.includes(row.intakeStatus)) return false
  if (
    values.callOutcome.length > 0 &&
    (row.callOutcome == null || !values.callOutcome.includes(row.callOutcome))
  ) {
    return false
  }
  if (values.referent.length > 0 && !matchesReferent(row, values.referent)) return false
  if (values.city.trim() && !(row.city ?? '').toLowerCase().includes(values.city.trim().toLowerCase())) {
    return false
  }
  if (
    values.postalCode.trim() &&
    !(row.postalCode ?? '').toLowerCase().includes(values.postalCode.trim().toLowerCase())
  ) {
    return false
  }
  if (values.metier.trim() && !matchesMetier(row, values.metier.trim().toLowerCase())) return false
  if (values.smsSent === 'sent' && row.intakeBookingSmsLabel !== 'Envoyé') return false
  if (values.smsSent === 'missing' && row.intakeBookingSmsLabel === 'Envoyé') return false
  if (values.overdue === true && !row.isRelanceOverdue) return false
  if (values.overdue === false && row.isRelanceOverdue) return false
  if (values.hasNotes === true && !(row.notes ?? '').trim()) return false
  if (values.hasNotes === false && (row.notes ?? '').trim()) return false
  if (!dateInRange(row.createdAt, values.enrolledAt)) return false
  if (!dateInRange(row.relanceAt, values.relanceAt)) return false
  if (!dateInRange(row.plannedRdvAt, values.plannedRdvAt)) return false
  return true
}

function matchesReferent(row: AppProfileListItem, selected: string[]) {
  const none = selected.includes(REFERENT_NONE)
  if (none && !row.referentId) return true
  return row.referentId != null && selected.includes(row.referentId)
}

function matchesMetier(row: AppProfileListItem, needle: string) {
  const hay = `${row.jobTitleName ?? ''} ${row.activityLabel ?? ''}`.toLowerCase()
  return hay.includes(needle)
}
