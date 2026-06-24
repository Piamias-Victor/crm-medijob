import { type ReactNode } from 'react'
import { type DuplicateFieldConfig } from '@/lib/merge/duplicate-field-config'
import { type FieldSide } from '@/lib/merge/resolve-merged-fields'

export type DuplicateField<T extends Record<string, unknown>> = DuplicateFieldConfig<T> & {
  render: (value: T[keyof T]) => ReactNode
}

export type DuplicateDetectionPageProps<T extends Record<string, unknown>> = {
  left: T
  right: T
  leftTitle?: string
  rightTitle?: string
  fields: DuplicateField<T>[]
  onMerge: (merged: T) => void | Promise<void>
  onIgnore: () => void | Promise<void>
  onCancel: () => void
}

export type DuplicateFieldRowProps<T extends Record<string, unknown>> = {
  field: DuplicateField<T>
  leftValue: T[keyof T]
  rightValue: T[keyof T]
  selected: FieldSide
  onSelect: (side: FieldSide) => void
}

export type DuplicateFieldOptionProps = {
  name: string
  selected: boolean
  label: string
  onSelect: () => void
  children: ReactNode
}

export type DuplicateComparisonTableProps<T extends Record<string, unknown>> = {
  fields: DuplicateField<T>[]
  left: T
  right: T
  leftTitle: string
  rightTitle: string
  selections: Partial<Record<keyof T, FieldSide>>
  onSelect: (key: keyof T, side: FieldSide) => void
}
