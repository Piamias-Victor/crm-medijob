'use client'

import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { cn } from '@/lib/cn'
import type { InterviewMappingDiff } from '@/view-models/interview-mapping-types'
import { INTERVIEW_MAPPING_FIELD_LABELS, formatMappingValue } from '@/view-models/interview-mapping-labels'
import { mappingInputType } from '@/view-models/interview-mapping-edit'
import { INTERVIEW_SOFTWARE_OPTIONS } from '@/view-models/interview-software'
import { createContractOptions } from '@/lib/contract-options'
import { joinChoiceLabels, splitChoiceLabels } from '@/view-models/interview-question-kind'
import {
  INTERVIEW_MAPPING_CURRENT,
  INTERVIEW_MAPPING_SAVE,
  INTERVIEW_MAPPING_SAVED,
} from '@/view-models/interview-copy'

type Props = {
  diff: InterviewMappingDiff
  value: string
  saved: boolean
  onEdit: (value: string) => void
  onToggleSave: (saved: boolean) => void
}

export function InterviewMappingFieldRow({ diff, value, saved, onEdit, onToggleSave }: Props) {
  const label = INTERVIEW_MAPPING_FIELD_LABELS[diff.field]
  const save = (
    <Button type="button" variant={saved ? 'accent' : 'outline'} onClick={() => onToggleSave(!saved)}>
      {saved ? INTERVIEW_MAPPING_SAVED : INTERVIEW_MAPPING_SAVE}
    </Button>
  )
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border px-3 py-3',
        saved ? 'border-accent bg-accent-muted' : 'border-border bg-white',
      )}
    >
      <p className="text-sm font-semibold text-fg">{label}</p>
      {diff.kind === 'overwrite' ? (
        <p className="text-xs text-fg-muted">
          {INTERVIEW_MAPPING_CURRENT} : {formatMappingValue(diff.current)}
        </p>
      ) : null}
      {diff.field === 'softwareNames' || diff.field === 'contractTypes' ? (
        <>
          <CheckboxGroup
            options={diff.field === 'softwareNames' ? INTERVIEW_SOFTWARE_OPTIONS : createContractOptions}
            values={splitChoiceLabels(value)}
            onChange={(values) => onEdit(joinChoiceLabels(values))}
          />
          <div className="flex justify-end">{save}</div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            aria-label={label}
            className="min-w-0 flex-1"
            type={mappingInputType(diff.field)}
            value={value}
            onChange={(event) => onEdit(event.target.value)}
          />
          {save}
        </div>
      )}
    </div>
  )
}
