import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { FacturationLinesFilterConfig } from '@/lib/filters/facturation-lines-filter-config'
import type { FacturationLineListFiltersInput } from '@/view-models/facturation-line-filters.schema'
import { PLACEMENT_CONTRACT_TYPES, type FinanceLineKind } from '@/view-models/finance-line'

export type FacturationLinesFilterValues = FilterValues<FacturationLinesFilterConfig>

function cancelledOf(value: string) {
  if (value === 'CANCELLED') return true
  if (value === 'ACTIVE') return false
  return undefined
}

export function toFacturationLineListFilters(
  kind: FinanceLineKind,
  values: FacturationLinesFilterValues,
): FacturationLineListFiltersInput {
  const search = values.recherche.trim()
  const contractTypes = values.contrat.filter(
    (value): value is (typeof PLACEMENT_CONTRACT_TYPES)[number] =>
      (PLACEMENT_CONTRACT_TYPES as readonly string[]).includes(value),
  )
  const cancelled = cancelledOf(values.annulation)
  return {
    kind,
    search: search.length ? search : undefined,
    month: values.mois.trim() || undefined,
    contractTypes: kind === 'PLACEMENT' && contractTypes.length ? contractTypes : undefined,
    pharmacyIds: values.pharmacie.length ? values.pharmacie : undefined,
    referentIds: values.referent.length ? values.referent : undefined,
    ...(cancelled === undefined ? {} : { cancelled }),
  }
}

export function buildFacturationLinesFilterDefaults(
  config: FacturationLinesFilterConfig,
): FacturationLinesFilterValues {
  return { ...buildDefaultFilterValues(config), annulation: 'ACTIVE' }
}
