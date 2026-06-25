import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import {
  CVTHEQUE_ADVANCED_FILTER_IDS,
  type CvthequeFilterConfig,
} from '@/lib/filters/cvtheque-filter-config'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'
import { buildCvthequeFilterDefaults } from '@/lib/filters/cvtheque-filter-map'

export { buildCvthequeFilterDefaults }

export function splitCvthequeFilterConfig(config: CvthequeFilterConfig) {
  const advanced = new Set<string>(CVTHEQUE_ADVANCED_FILTER_IDS)
  return {
    primary: config.filter((item) => !advanced.has(item.id)),
    advanced: config.filter((item) => advanced.has(item.id)),
  }
}

export function countActiveAdvancedFilters(
  values: CvthequeFilterValues,
  defaults: CvthequeFilterValues,
): number {
  return CVTHEQUE_ADVANCED_FILTER_IDS.filter((id) => {
    const current = values[id]
    const initial = defaults[id]
    if (Array.isArray(current)) return current.length > 0
    return current !== initial
  }).length
}
