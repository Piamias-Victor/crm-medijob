import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

export function splitFilterConfig<T extends FilterConfig>(
  config: readonly T[],
  advancedIds: readonly string[],
) {
  const advanced = new Set<string>(advancedIds)
  return {
    primary: config.filter((item) => !advanced.has(item.id)),
    advanced: config.filter((item) => advanced.has(item.id)),
  }
}

export function countActiveAdvancedFilters<TValues extends FilterValues<readonly FilterConfig[]>>(
  advancedIds: readonly string[],
  values: TValues,
  defaults: TValues,
): number {
  return advancedIds.filter((id) => {
    const current = values[id as keyof TValues]
    const initial = defaults[id as keyof TValues]
    if (Array.isArray(current)) return current.length > 0
    return current !== initial
  }).length
}
