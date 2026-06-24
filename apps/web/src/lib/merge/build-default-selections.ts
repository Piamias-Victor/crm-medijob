import { type FieldSide } from '@/lib/merge/resolve-merged-fields'
import {
  type DuplicateFieldConfig,
  getFieldEquals,
} from '@/lib/merge/duplicate-field-config'
import { fieldValuesDiffer } from '@/lib/merge/field-values-equal'

export function buildDefaultSelections<T extends Record<string, unknown>>(
  left: T,
  right: T,
  fields: DuplicateFieldConfig<T>[],
): Partial<Record<keyof T, FieldSide>> {
  const selections: Partial<Record<keyof T, FieldSide>> = {}

  for (const field of fields) {
    const equals = getFieldEquals(field)
    if (fieldValuesDiffer(left[field.key], right[field.key], equals)) {
      selections[field.key] = 'left'
    }
  }

  return selections
}
