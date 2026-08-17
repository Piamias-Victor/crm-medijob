'use client'

import type { InterviewMappingDiff } from '@/view-models/interview-mapping-types'
import {
  formatMappingValue,
  INTERVIEW_MAPPING_FIELD_LABELS,
} from '@/view-models/interview-mapping-labels'
import {
  INTERVIEW_MAPPING_FILL,
  INTERVIEW_MAPPING_OVERWRITE,
  INTERVIEW_MAPPING_TITLE,
} from '@/view-models/interview-copy'

type Props = {
  diffs: InterviewMappingDiff[]
  overwriteFields: string[]
  onToggleOverwrite: (field: string, checked: boolean) => void
}

export function InterviewMappingDiffs({ diffs, overwriteFields, onToggleOverwrite }: Props) {
  if (!diffs.length) return null
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-fg">{INTERVIEW_MAPPING_TITLE}</legend>
      {diffs.map((diff) => (
        <div key={diff.field} className="flex flex-col gap-1 text-sm text-fg">
          <p className="font-medium">{INTERVIEW_MAPPING_FIELD_LABELS[diff.field]}</p>
          <p className="text-fg-muted">
            {formatMappingValue(diff.current)} → {formatMappingValue(diff.next)}
          </p>
          {diff.kind === 'fill' ? (
            <p className="text-xs text-fg-muted">{INTERVIEW_MAPPING_FILL}</p>
          ) : (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-[var(--color-accent)]"
                checked={overwriteFields.includes(diff.field)}
                onChange={(event) => onToggleOverwrite(diff.field, event.target.checked)}
              />
              {INTERVIEW_MAPPING_OVERWRITE}
            </label>
          )}
        </div>
      ))}
    </fieldset>
  )
}
