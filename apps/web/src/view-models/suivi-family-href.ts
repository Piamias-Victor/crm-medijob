import { serializeFilters } from '@/lib/filters/serialize'
import { needFilterConfig } from '@/lib/filters/badakan-interim-filters'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'

export type SuiviFamily = 'open' | 'proposed' | 'staffed'

const FAMILY_STEPS: Record<SuiviFamily, string[]> = {
  open: ['CREATED'],
  proposed: ['PROPOSE'],
  staffed: ['STAFFED'],
}

/** Lien board suivi → besoins avec filtre étape (tracking). */
export function suiviFamilyHref(family: SuiviFamily): string {
  const values = {
    ...buildDefaultFilterValues(needFilterConfig),
    steps: FAMILY_STEPS[family],
  }
  const params = serializeFilters(needFilterConfig, values)
  const query = params.toString()
  return query ? `/interim/besoins?${query}` : '/interim/besoins'
}
