import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import { CANDIDATE_STATUSES, type CandidateStatus } from '@/view-models/candidate-status'

export type CvthequeFilterValues = FilterValues<CvthequeFilterConfig>

export function normalizeCvthequeFilterValues(
  values: CvthequeFilterValues,
  _defaults: CvthequeFilterValues,
): CvthequeFilterValues {
  if (values.disponible !== true) return values
  return values.missionActive === true ? { ...values, missionActive: null } : values
}

function parseMaxMobilityKm(raw: string): number | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  const value = Number(trimmed)
  if (!Number.isInteger(value) || value < 1 || value > 500) return undefined
  return value
}

function toStatuses(values: string[]): CandidateStatus[] | undefined {
  const statuses = values.filter((value): value is CandidateStatus =>
    (CANDIDATE_STATUSES as readonly string[]).includes(value),
  )
  return statuses.length ? statuses : undefined
}

export function toCandidateListFilters(values: CvthequeFilterValues): CandidateListFilters {
  const normalized = normalizeCvthequeFilterValues(values, values)
  const contractTypes = normalized.contrat.filter(
    (value): value is 'CDI' | 'CDD' | 'INTERIM' =>
      value === 'CDI' || value === 'CDD' || value === 'INTERIM',
  )
  const city = normalized.ville.trim()
  const maxMobilityKm = parseMaxMobilityKm(normalized.mobilite)

  return {
    jobTitleIds: normalized.metier.length ? normalized.metier : undefined,
    available: normalized.disponible ?? undefined,
    departments: normalized.departement.length ? normalized.departement : undefined,
    referentIds: normalized.referent.length ? normalized.referent : undefined,
    softwareIds: normalized.logiciel.length ? normalized.logiciel : undefined,
    contractTypes: contractTypes.length ? contractTypes : undefined,
    profileIncomplete: normalized.incomplet ?? undefined,
    activeMission: normalized.missionActive ?? undefined,
    statuses: toStatuses(normalized.statut),
    city: city || undefined,
    maxMobilityKm,
  }
}

export function buildCvthequeFilterDefaults(config: CvthequeFilterConfig): CvthequeFilterValues {
  return buildDefaultFilterValues(config)
}
