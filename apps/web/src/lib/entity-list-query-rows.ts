import { filtersEqual } from '@/lib/filters/filters-equal'

export function resolveEntityListRows<TRow>(
  data: TRow[] | undefined,
  initialRows: TRow[],
  apiFilters: unknown,
  serverFilters: unknown,
): TRow[] {
  if (data !== undefined) return data
  if (filtersEqual(apiFilters, serverFilters)) return initialRows
  return []
}
