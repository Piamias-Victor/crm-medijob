'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import {
  DUPLICATE_CANCEL,
  DUPLICATE_IGNORE,
  DUPLICATE_LEFT_TITLE,
  DUPLICATE_MERGE,
  DUPLICATE_MERGING,
  DUPLICATE_RIGHT_TITLE,
} from '@/components/organisms/duplicate-detection-page/duplicate-detection-copy'
import { DuplicateFieldRow } from '@/components/organisms/duplicate-detection-page/duplicate-field-row'
import { buildDefaultSelections } from '@/components/organisms/duplicate-detection-page/duplicate-detection-selection'
import { type DuplicateDetectionPageProps } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'
import { resolveMergedFields, type FieldSide } from '@/lib/merge/resolve-merged-fields'

export function DuplicateDetectionPage<T extends Record<string, unknown>>({
  left,
  right,
  leftTitle = DUPLICATE_LEFT_TITLE,
  rightTitle = DUPLICATE_RIGHT_TITLE,
  fields,
  onMerge,
  onIgnore,
  onCancel,
  merging = false,
}: DuplicateDetectionPageProps<T>) {
  const fieldKeys = useMemo(() => fields.map((field) => field.key), [fields])
  const [selections, setSelections] = useState(() =>
    buildDefaultSelections(left, right, fieldKeys),
  )
  const [ignoring, setIgnoring] = useState(false)
  const busy = merging || ignoring

  function selectField(key: keyof T, side: FieldSide) {
    setSelections((current) => ({ ...current, [key]: side }))
  }

  async function handleMerge() {
    await onMerge(resolveMergedFields(left, right, selections, fieldKeys))
  }

  async function handleIgnore() {
    setIgnoring(true)
    try {
      await onIgnore()
    } finally {
      setIgnoring(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <h2 className="text-lg font-semibold text-fg">{leftTitle}</h2>
        <h2 className="text-lg font-semibold text-fg">{rightTitle}</h2>
      </div>
      <div className="space-y-4">
        {fields.map((field) => (
          <DuplicateFieldRow
            key={String(field.key)}
            field={field}
            leftValue={left[field.key]}
            rightValue={right[field.key]}
            selected={selections[field.key] ?? 'left'}
            onSelect={(side) => selectField(field.key, side)}
          />
        ))}
      </div>
      <div className="flex flex-wrap justify-end gap-3 border-t border-border/50 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
          {DUPLICATE_CANCEL}
        </Button>
        <Button type="button" variant="ghost" onClick={handleIgnore} disabled={busy}>
          {DUPLICATE_IGNORE}
        </Button>
        <Button type="button" onClick={handleMerge} disabled={busy} className="min-w-30">
          {merging ? DUPLICATE_MERGING : DUPLICATE_MERGE}
        </Button>
      </div>
    </div>
  )
}
