import {
  buildFacturationLinesFilterConfig,
  type FacturationLinesFilterConfig,
} from '@/lib/filters/facturation-lines-filter-config'
import {
  buildFacturationLinesFilterDefaults,
  toFacturationLineListFilters,
} from '@/lib/filters/facturation-lines-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'
import type { FinanceLineKind } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

export function readFacturationLinesFilters(
  kind: FinanceLineKind,
  params: Record<string, string | string[] | undefined>,
  pharmacies: Ref[],
  recruiters: Ref[],
  now = new Date(),
) {
  const filterConfig = buildFacturationLinesFilterConfig(pharmacies, recruiters, now)
  const deserialized = deserializeFilters(filterConfig, toUrlSearchParams(params))
  const defaults = buildFacturationLinesFilterDefaults(filterConfig)
  const values = {
    ...defaults,
    ...deserialized,
    annulation: deserialized.annulation || defaults.annulation,
  }
  return {
    filterConfig,
    serverFilters: toFacturationLineListFilters(kind, values),
  }
}

export type { FacturationLinesFilterConfig }
