import { buildFacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import { toFacturationSuiviFilters } from '@/lib/filters/facturation-filter-map'
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
