import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { FacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { COMMERCIAL_STATUSES } from '@/lib/finance/derive-commercial-status'

export type FacturationFilterValues = FilterValues<FacturationFilterConfig>

export function toFacturationSuiviFilters(values: FacturationFilterValues): FacturationSuiviFilters {
  const contractTypes = values.contrat.filter(
    (value): value is (typeof CONTRACT_TYPES)[number] =>
      (CONTRACT_TYPES as readonly string[]).includes(value),
  )
  const commercialStatuses = values.etat.filter(
    (value): value is (typeof COMMERCIAL_STATUSES)[number] =>
      (COMMERCIAL_STATUSES as readonly string[]).includes(value),
  )
  const sentFrom = values.periode.from.trim()
  const sentTo = values.periode.to.trim()

  return {
    contractTypes: contractTypes.length ? contractTypes : undefined,
    pharmacyIds: values.pharmacie.length ? values.pharmacie : undefined,
    referentIds: values.referent.length ? values.referent : undefined,
    commercialStatuses: commercialStatuses.length ? commercialStatuses : undefined,
    sentFrom: sentFrom.length ? sentFrom : undefined,
    sentTo: sentTo.length ? sentTo : undefined,
  }
}

export function buildFacturationFilterDefaults(config: FacturationFilterConfig): FacturationFilterValues {
  return buildDefaultFilterValues(config)
}
