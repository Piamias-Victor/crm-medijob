import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { MissionFilterConfig } from '@/lib/filters/mission-filter-config'
import type { MissionListFilters } from '@/view-models/mission-list-filters.schema'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { MISSION_STATUS_ORDER } from '@/lib/mission-options'

export type MissionFilterValues = FilterValues<MissionFilterConfig>

export function toMissionListFilters(values: MissionFilterValues): MissionListFilters {
  const contractTypes = values.contrat.filter(
    (value): value is (typeof CONTRACT_TYPES)[number] =>
      (CONTRACT_TYPES as readonly string[]).includes(value),
  )
  const statuses = values.statut.filter(
    (value): value is (typeof MISSION_STATUS_ORDER)[number] =>
      (MISSION_STATUS_ORDER as readonly string[]).includes(value),
  )
  const city = values.ville.trim()
  const createdFrom = values.periode.from.trim()
  const createdTo = values.periode.to.trim()

  return {
    contractTypes: contractTypes.length ? contractTypes : undefined,
    statuses: statuses.length ? statuses : undefined,
    jobTitleIds: values.metier.length ? values.metier : undefined,
    pharmacyIds: values.pharmacie.length ? values.pharmacie : undefined,
    departments: values.departement.length ? values.departement : undefined,
    city: city.length ? city : undefined,
    referentIds: values.referent.length ? values.referent : undefined,
    createdFrom: createdFrom.length ? createdFrom : undefined,
    createdTo: createdTo.length ? createdTo : undefined,
  }
}

export function buildMissionFilterDefaults(config: MissionFilterConfig): MissionFilterValues {
  return buildDefaultFilterValues(config)
}
