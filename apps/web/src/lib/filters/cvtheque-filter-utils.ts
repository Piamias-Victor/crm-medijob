import {
  CVTHEQUE_ADVANCED_FILTER_IDS,
  type CvthequeFilterConfig,
} from '@/lib/filters/cvtheque-filter-config'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'
import { buildCvthequeFilterDefaults } from '@/lib/filters/cvtheque-filter-map'
import { countActiveAdvancedFilters, splitFilterConfig } from '@/lib/filters/advanced-filter-utils'

export { buildCvthequeFilterDefaults }

export function splitCvthequeFilterConfig(config: CvthequeFilterConfig) {
  return splitFilterConfig(config, CVTHEQUE_ADVANCED_FILTER_IDS)
}

export function countCvthequeAdvancedFilters(
  values: CvthequeFilterValues,
  defaults: CvthequeFilterValues,
): number {
  return countActiveAdvancedFilters(CVTHEQUE_ADVANCED_FILTER_IDS, values, defaults)
}
