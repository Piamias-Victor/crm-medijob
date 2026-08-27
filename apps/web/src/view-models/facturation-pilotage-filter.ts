import { REFERENT_NONE } from '@/lib/constants/referent-none'
import { uniqueFacturationMonthKeys } from '@/view-models/facturation-month-key'
import {
  currentExerciceStartYear,
  exerciceMonths,
  exerciceWindow,
} from '@/view-models/facturation-exercice'
import type { PilotageFilters } from '@/view-models/facturation-pilotage-filters.schema'
import type { PilotageContribution } from '@/view-models/facturation-pilotage-union'

function parseStartYear(value: string | undefined, now: Date): number | null {
  if (value === 'all') return null
  if (value && /^\d{4}$/.test(value)) return Number(value)
  return currentExerciceStartYear(now)
}

function inWindow(date: Date, from: Date, to: Date) {
  return date >= from && date <= to
}

function matchesReferent(referentId: string | null, filter?: string) {
  if (!filter) return true
  if (filter === REFERENT_NONE) return referentId == null
  return referentId === filter
}

export function filterPilotageContributions(
  items: PilotageContribution[],
  filters: PilotageFilters = {},
  now = new Date(),
) {
  const startYear = parseStartYear(filters.exercice, now)
  const window = startYear == null ? null : exerciceWindow(startYear)
  const filtered = items.filter((item) => {
    if (window && !inWindow(item.occurredAt, window.from, window.to)) return false
    return matchesReferent(item.referentId, filters.referentId)
  })
  const months =
    startYear == null
      ? uniqueFacturationMonthKeys(filtered.map((item) => item.occurredAt))
      : exerciceMonths(startYear)
  return { items: filtered, months }
}
