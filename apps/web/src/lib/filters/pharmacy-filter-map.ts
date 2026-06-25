import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { PharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyListFilters } from '@/view-models/pharmacy-list-filters.schema'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

export type PharmacyFilterValues = FilterValues<PharmacyFilterConfig>

export function toPharmacyListFilters(values: PharmacyFilterValues): PharmacyListFilters {
  const statuses = values.statut.filter((value): value is (typeof PHARMACY_STATUSES)[number] =>
    (PHARMACY_STATUSES as readonly string[]).includes(value),
  )

  return {
    statuses: statuses.length ? statuses : undefined,
    departments: values.departement.length ? values.departement : undefined,
    activeMission: values.missionActive ?? undefined,
    groupementIds: values.groupement.length ? values.groupement : undefined,
    softwareIds: values.logiciel.length ? values.logiciel : undefined,
  }
}

export function buildPharmacyFilterDefaults(config: PharmacyFilterConfig): PharmacyFilterValues {
  return buildDefaultFilterValues(config)
}
