import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'

export type CvthequeFilterValues = FilterValues<CvthequeFilterConfig>

export function normalizeCvthequeFilterValues(
  values: CvthequeFilterValues,
  _defaults: CvthequeFilterValues,
): CvthequeFilterValues {
  if (values.disponible !== true) return values
  return values.missionActive === true ? { ...values, missionActive: null } : values
}

export function toCandidateListFilters(values: CvthequeFilterValues): CandidateListFilters {
  const normalized = normalizeCvthequeFilterValues(values, values)
  const contractTypes = normalized.contrat.filter(
    (value): value is 'CDI' | 'CDD' | 'INTERIM' =>
      value === 'CDI' || value === 'CDD' || value === 'INTERIM',
  )

  return {
    jobTitleIds: normalized.metier.length ? normalized.metier : undefined,
    available: normalized.disponible ?? undefined,
    departments: normalized.departement.length ? normalized.departement : undefined,
    referentIds: normalized.referent.length ? normalized.referent : undefined,
    softwareIds: normalized.logiciel.length ? normalized.logiciel : undefined,
    contractTypes: contractTypes.length ? contractTypes : undefined,
    profileIncomplete: normalized.incomplet ?? undefined,
    activeMission: normalized.missionActive ?? undefined,
  }
}

export function buildCvthequeFilterDefaults(config: CvthequeFilterConfig): CvthequeFilterValues {
  return buildDefaultFilterValues(config)
}
