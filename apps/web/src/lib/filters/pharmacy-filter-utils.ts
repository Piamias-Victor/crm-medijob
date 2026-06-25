import {
  PHARMACY_ADVANCED_FILTER_IDS,
  type PharmacyFilterConfig,
} from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyFilterValues } from '@/lib/filters/pharmacy-filter-map'
import { buildPharmacyFilterDefaults } from '@/lib/filters/pharmacy-filter-map'
import { countActiveAdvancedFilters, splitFilterConfig } from '@/lib/filters/advanced-filter-utils'

export { buildPharmacyFilterDefaults }

export function splitPharmacyFilterConfig(config: PharmacyFilterConfig) {
  return splitFilterConfig(config, PHARMACY_ADVANCED_FILTER_IDS)
}

export function countPharmacyAdvancedFilters(
  values: PharmacyFilterValues,
  defaults: PharmacyFilterValues,
): number {
  return countActiveAdvancedFilters(PHARMACY_ADVANCED_FILTER_IDS, values, defaults)
}
