export type FieldSide = 'left' | 'right'

/** Shallow merge for flat entity records — nested objects are replaced wholesale. */
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
