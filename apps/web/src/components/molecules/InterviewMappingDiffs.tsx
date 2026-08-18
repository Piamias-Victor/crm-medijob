'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { InterviewMappingFieldRow } from '@/components/molecules/InterviewMappingFieldRow'
import type { InterviewMappingDiff } from '@/view-models/interview-mapping-types'
import {
  INTERVIEW_MAPPING_HINT,
  INTERVIEW_MAPPING_TITLE,
} from '@/view-models/interview-copy'

type Props = {
  diffs: InterviewMappingDiff[]
  values: Record<string, string>
  savedFields: string[]
  onEdit: (field: string, value: string) => void
  onToggleSave: (field: string, saved: boolean) => void
}

export function InterviewMappingDiffs({ diffs, values, savedFields, onEdit, onToggleSave }: Props) {
  if (!diffs.length) return null
  return (
    <SectionCard
      variant="glass"
      title={INTERVIEW_MAPPING_TITLE}
      description={INTERVIEW_MAPPING_HINT}
      bodyClassName="flex flex-col gap-2 p-4 sm:p-5"
    >
      {diffs.map((diff) => (
        <InterviewMappingFieldRow
          key={diff.field}
          diff={diff}
          value={values[diff.field] ?? ''}
          saved={savedFields.includes(diff.field)}
          onEdit={(value) => onEdit(diff.field, value)}
          onToggleSave={(saved) => onToggleSave(diff.field, saved)}
        />
      ))}
    </SectionCard>
  )
}
