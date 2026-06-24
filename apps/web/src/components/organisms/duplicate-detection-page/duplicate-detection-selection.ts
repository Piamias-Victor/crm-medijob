import { type FieldSide } from '@/lib/merge/resolve-merged-fields'

export function buildDefaultSelections<T extends Record<string, unknown>>(
  left: T,
  right: T,
  fields: Array<keyof T>,
): Partial<Record<keyof T, FieldSide>> {
  const selections: Partial<Record<keyof T, FieldSide>> = {}

  for (const key of fields) {
    if (left[key] !== right[key]) selections[key] = 'left'
  }

  return selections
}

export function fieldValuesDiffer<T extends Record<string, unknown>>(
  left: T,
  right: T,
  key: keyof T,
): boolean {
  return left[key] !== right[key]
}
