import type { FilterConfig } from '@/lib/filters/filter-types'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { appIntakePrimaryFilters } from '@/lib/filters/app-intake-filter-primary'
import { appIntakeAdvancedFilters } from '@/lib/filters/app-intake-filter-advanced'

type Ref = { id: string; name: string }

export const APP_INTAKE_ADVANCED_FILTER_IDS = [
  'city',
  'postalCode',
  'metier',
  'smsSent',
  'overdue',
  'hasNotes',
  'enrolledAt',
  'relanceAt',
  'plannedRdvAt',
] as const

export function buildAppIntakeFilterConfig(recruiters: readonly Ref[]) {
  return [
    ...appIntakePrimaryFilters(recruiters),
    ...appIntakeAdvancedFilters(),
  ] as const satisfies readonly FilterConfig[]
}

export type AppIntakeFilterConfig = ReturnType<typeof buildAppIntakeFilterConfig>

export { buildReferentFilterOptions }
