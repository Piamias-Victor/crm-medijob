import { serializeFilters } from '@/lib/filters/serialize'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

/** True when serialized filter query matches current URL query (order-insensitive). */
export function filterQueriesEqual(a: string, b: string): boolean {
  const pa = new URLSearchParams(a)
  const pb = new URLSearchParams(b)
  const keys = new Set([...pa.keys(), ...pb.keys()])
  for (const key of keys) {
    const va = pa.getAll(key).sort().join('\0')
    const vb = pb.getAll(key).sort().join('\0')
    if (va !== vb) return false
  }
  return true
}

export function serializeFilterQuery<TConfigs extends readonly FilterConfig[]>(
  config: TConfigs,
  values: FilterValues<TConfigs>,
): string {
  return serializeFilters(config, values).toString()
}
