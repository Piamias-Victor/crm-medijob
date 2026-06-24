import { defaultFieldValuesEqual } from '@/lib/merge/field-values-equal'

export type DuplicateFieldConfig<T extends Record<string, unknown>> = {
  key: keyof T
  label: string
  equals?: (left: T[keyof T], right: T[keyof T]) => boolean
}

export function getFieldEquals<T extends Record<string, unknown>>(
  field: DuplicateFieldConfig<T>,
): (left: T[keyof T], right: T[keyof T]) => boolean {
  return field.equals ?? defaultFieldValuesEqual
}
