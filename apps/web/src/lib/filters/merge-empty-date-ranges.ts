import type { DateRangeValue, FilterConfig, FilterValues } from '@/lib/filters/filter-types'

export function mergeEmptyDateRanges<T extends readonly FilterConfig[]>(
  config: T,
  values: FilterValues<T>,
  defaults: FilterValues<T>,
): FilterValues<T> {
  const next = { ...values }
  for (const item of config) {
    if (item.type !== 'date-range') continue
    const current = values[item.id as keyof FilterValues<T>] as DateRangeValue
    const fallback = defaults[item.id as keyof FilterValues<T>] as DateRangeValue
    if (!current.from && !current.to && (fallback.from || fallback.to)) {
      Object.assign(next, { [item.id]: fallback })
    }
  }
  return next
}
