import { buildPilotageFilterConfig } from '@/lib/filters/pilotage-filter-config'
import { buildPilotageFilterDefaults } from '@/lib/filters/pilotage-filter-defaults'
import { toPilotageFilters } from '@/lib/filters/pilotage-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Ref = { id: string; name: string }

export function readPilotageFilters(
  params: Record<string, string | string[] | undefined>,
  recruiters: Ref[],
  now = new Date(),
) {
  const filterConfig = buildPilotageFilterConfig(recruiters, now)
  const defaults = buildPilotageFilterDefaults(filterConfig, now)
  const deserialized = deserializeFilters(filterConfig, toUrlSearchParams(params))
  const values = {
    ...defaults,
    ...deserialized,
    exercice: deserialized.exercice || defaults.exercice,
  }
  return { filterConfig, serverFilters: toPilotageFilters(values) }
}
