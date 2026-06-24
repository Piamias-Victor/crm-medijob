'use client'

import {
  DUPLICATE_FIELD_HEADER,
} from '@/components/organisms/duplicate-detection-page/duplicate-detection-copy'
import { DuplicateFieldRow } from '@/components/organisms/duplicate-detection-page/duplicate-field-row'
import { type DuplicateComparisonTableProps } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'

export function DuplicateComparisonTable<T extends Record<string, unknown>>({
  fields,
  left,
  right,
  leftTitle,
  rightTitle,
  selections,
  onSelect,
}: DuplicateComparisonTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="grid grid-cols-[minmax(7rem,11rem)_1fr_1fr] border-b border-border bg-surface/90">
        <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {DUPLICATE_FIELD_HEADER}
        </div>
        <div className="border-l border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {leftTitle}
        </div>
        <div className="border-l border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {rightTitle}
        </div>
      </div>
      {fields.map((field) => (
        <DuplicateFieldRow
          key={String(field.key)}
          field={field}
          leftValue={left[field.key]}
          rightValue={right[field.key]}
          selected={selections[field.key] ?? 'left'}
          onSelect={(side) => onSelect(field.key, side)}
        />
      ))}
    </div>
  )
}
