export type FieldSide = 'left' | 'right'

export function resolveMergedFields<T extends Record<string, unknown>>(
  left: T,
  right: T,
  selections: Partial<Record<keyof T, FieldSide>>,
  fields: Array<keyof T>,
): T {
  const merged = { ...left }
  for (const key of fields) {
    const side = selections[key] ?? 'left'
    merged[key] = side === 'left' ? left[key] : right[key]
  }
  return merged
}
