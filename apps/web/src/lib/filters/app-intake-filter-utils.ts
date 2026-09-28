import type { AppIntakeFilterConfig } from '@/lib/filters/app-intake-filter-config'
import { APP_INTAKE_ADVANCED_FILTER_IDS } from '@/lib/filters/app-intake-filter-config'
import { buildDefaultFilterValues, type FilterValues } from '@/lib/filters/filter-types'

export function splitAppIntakeFilterConfig(config: AppIntakeFilterConfig) {
  const advancedIds = new Set<string>(APP_INTAKE_ADVANCED_FILTER_IDS)
  return {
    primary: config.filter((item) => !advancedIds.has(item.id)),
    advanced: config.filter((item) => advancedIds.has(item.id)),
  }
}

export function buildAppIntakeFilterDefaults(config: AppIntakeFilterConfig) {
  return buildDefaultFilterValues(config)
}

export function countAppIntakeAdvancedFilters(
  values: FilterValues<AppIntakeFilterConfig>,
  defaults: FilterValues<AppIntakeFilterConfig>,
) {
  let count = 0
  for (const id of APP_INTAKE_ADVANCED_FILTER_IDS) {
    if (JSON.stringify(values[id]) !== JSON.stringify(defaults[id])) count += 1
  }
  return count
}

export function intakeListKeyFromFilters(values: FilterValues<AppIntakeFilterConfig>) {
  return {
    referentScope: (values.referentScope === 'all' ? 'all' : 'mine') as 'mine' | 'all',
    population: (values.population === 'archive' ? 'archive' : 'default') as
      | 'default'
      | 'archive',
  }
}
