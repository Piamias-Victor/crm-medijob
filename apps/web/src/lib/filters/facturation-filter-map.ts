import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { currentMonthRange } from '@/lib/date-picker-utils'
import type {
  FacturationFilterConfig,
  FacturationOverviewFilterConfig,
} from '@/lib/filters/facturation-filter-config'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { COMMERCIAL_STATUSES } from '@/lib/finance/derive-commercial-status'

export type FacturationFilterValues = FilterValues<FacturationFilterConfig>
export type FacturationOverviewFilterValues = FilterValues<FacturationOverviewFilterConfig>

type DimensionValues = {
  contrat: string[]
  etat: string[]
  pharmacie: string[]
  referent: string[]
  annulation: string
}

function mapDimensions(values: DimensionValues): FacturationSuiviFilters {
  const contractTypes = values.contrat.filter(
    (value): value is (typeof CONTRACT_TYPES)[number] =>
      (CONTRACT_TYPES as readonly string[]).includes(value),
  )
  const commercialStatuses = values.etat.filter(
    (value): value is (typeof COMMERCIAL_STATUSES)[number] =>
      (COMMERCIAL_STATUSES as readonly string[]).includes(value),
  )
  const cancelled =
    values.annulation === 'CANCELLED' ? true : values.annulation === 'ACTIVE' ? false : undefined
  return {
    contractTypes: contractTypes.length ? contractTypes : undefined,
    pharmacyIds: values.pharmacie.length ? values.pharmacie : undefined,
    referentIds: values.referent.length ? values.referent : undefined,
    commercialStatuses: commercialStatuses.length ? commercialStatuses : undefined,
    ...(cancelled === undefined ? {} : { cancelled }),
  }
}

function trimRange(range: { from: string; to: string }) {
  const from = range.from.trim()
  const to = range.to.trim()
  return { from: from.length ? from : undefined, to: to.length ? to : undefined }
}

export function toFacturationSuiviFilters(values: FacturationFilterValues): FacturationSuiviFilters {
  const range = trimRange(values.periode)
  return { ...mapDimensions(values), sentFrom: range.from, sentTo: range.to }
}

export function toFacturationOverviewFilters(
  values: FacturationOverviewFilterValues,
): FacturationSuiviFilters {
  const range = trimRange(values.acceptation)
  return { ...mapDimensions(values), acceptedFrom: range.from, acceptedTo: range.to }
}

export function buildFacturationFilterDefaults(config: FacturationFilterConfig): FacturationFilterValues {
  return buildDefaultFilterValues(config)
}

export function buildFacturationOverviewFilterDefaults(
  config: FacturationOverviewFilterConfig,
  now = new Date(),
): FacturationOverviewFilterValues {
  return { ...buildDefaultFilterValues(config), acceptation: currentMonthRange(now) }
}
