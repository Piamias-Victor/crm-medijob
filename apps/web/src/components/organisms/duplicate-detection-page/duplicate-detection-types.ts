import { type ReactNode } from 'react'
import { type FieldSide } from '@/lib/merge/resolve-merged-fields'

export type DuplicateField<T extends Record<string, unknown>> = {
  key: keyof T
  label: string
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
  merging?: boolean
}

export type DuplicateFieldRowProps<T extends Record<string, unknown>> = {
  field: DuplicateField<T>
  leftValue: T[keyof T]
  rightValue: T[keyof T]
  selected: FieldSide
  onSelect: (side: FieldSide) => void
}
