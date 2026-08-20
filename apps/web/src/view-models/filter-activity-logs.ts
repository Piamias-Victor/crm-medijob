import type { ActivityLogRow } from '@/view-models/activity-log'

export function filterActivityLogsByTypes(
  logs: ActivityLogRow[],
  types: readonly string[],
): ActivityLogRow[] {
  if (types.length === 0) return logs
  const selected = new Set(types)
  return logs.filter((log) => selected.has(log.type))
}
