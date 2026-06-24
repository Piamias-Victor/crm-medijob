'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { DuplicateComparisonTable } from '@/components/organisms/duplicate-detection-page/duplicate-comparison-table'
import {
  DUPLICATE_CANCEL,
  DUPLICATE_IGNORE,
  DUPLICATE_LEFT_TITLE,
  DUPLICATE_MERGE,
  DUPLICATE_MERGING,
  DUPLICATE_RIGHT_TITLE,
} from '@/components/organisms/duplicate-detection-page/duplicate-detection-copy'
import { type DuplicateDetectionPageProps } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'
import { buildDefaultSelections } from '@/lib/merge/build-default-selections'
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
}: DuplicateDetectionPageProps<T>) {
  const fieldKeys = useMemo(() => fields.map((field) => field.key), [fields])
  const [selections, setSelections] = useState(() => buildDefaultSelections(left, right, fields))
  const [merging, setMerging] = useState(false)
  const [ignoring, setIgnoring] = useState(false)
  const busy = merging || ignoring

  function selectField(key: keyof T, side: FieldSide) {
    setSelections((current) => ({ ...current, [key]: side }))
  }

  async function handleMerge() {
    setMerging(true)
    try {
      await onMerge(resolveMergedFields(left, right, selections, fieldKeys))
    } finally {
      setMerging(false)
    }
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
      <DuplicateComparisonTable
        fields={fields}
        left={left}
        right={right}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        selections={selections}
        onSelect={selectField}
      />
      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
          {DUPLICATE_CANCEL}
        </Button>
        <Button type="button" variant="primary" onClick={handleIgnore} disabled={busy}>
          {DUPLICATE_IGNORE}
        </Button>
        <Button type="button" variant="accent" onClick={handleMerge} disabled={busy} className="min-w-30">
          {merging ? DUPLICATE_MERGING : DUPLICATE_MERGE}
        </Button>
      </div>
    </div>
  )
}
