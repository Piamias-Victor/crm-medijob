import { applyDefaultAcceptedMonth } from '@/lib/finance/apply-default-accepted-month'
import {
  buildFacturationFilterConfig,
  buildFacturationOverviewFilterConfig,
} from '@/lib/filters/facturation-filter-config'
import {
  toFacturationOverviewFilters,
  toFacturationSuiviFilters,
} from '@/lib/filters/facturation-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Ref = { id: string; name: string }

export function readFacturationFilters(
  params: Record<string, string | string[] | undefined>,
  pharmacies: Ref[],
  recruiters: Ref[],
) {
  const filterConfig = buildFacturationFilterConfig(pharmacies, recruiters)
  const serverFilters = toFacturationSuiviFilters(
    deserializeFilters(filterConfig, toUrlSearchParams(params)),
  )
  return { filterConfig, serverFilters }
}

export function readFacturationOverviewFilters(
  params: Record<string, string | string[] | undefined>,
  pharmacies: Ref[],
  recruiters: Ref[],
  now = new Date(),
) {
  const filterConfig = buildFacturationOverviewFilterConfig(pharmacies, recruiters)
  const serverFilters = applyDefaultAcceptedMonth(
    toFacturationOverviewFilters(deserializeFilters(filterConfig, toUrlSearchParams(params))),
    now,
  )
  return { filterConfig, serverFilters }
}
