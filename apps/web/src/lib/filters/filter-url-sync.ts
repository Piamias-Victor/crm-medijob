import { filterQueriesEqual } from '@/lib/filters/filter-query-equal'

/** Whether URL→state sync should overwrite local filter values. */
export function shouldApplyUrlFilters(input: {
  pendingWrittenQuery: string | null
  currentQuery: string
}): boolean {
  if (input.pendingWrittenQuery == null) return true
  // Our own replace just landed — keep local state, clear pending in caller.
  if (filterQueriesEqual(input.pendingWrittenQuery, input.currentQuery)) return false
  // External navigation (back/forward or unrelated param) — apply URL.
  return true
}

export const FILTER_URL_WRITE_DEBOUNCE_MS = 300
