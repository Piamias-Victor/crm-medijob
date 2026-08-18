'use client'

import { CheckboxChip } from '@/components/molecules/CheckboxChip'
import { Combobox } from '@/components/molecules/Combobox'
import { parseCloseMapping, type InterviewCloseMapping } from '@/view-models/interview-close-mapping'
import {
  INTERVIEW_CRITERION_OPTIONS,
  INTERVIEW_MAPPING_OPTIONS,
} from '@/view-models/interview-template-meta-options'
import {
  INTERVIEW_TEMPLATE_CRITERION,
  INTERVIEW_TEMPLATE_MAPPING,
} from '@/view-models/interview-template-admin-copy'
import { INTERVIEW_ELIMINATOIRE } from '@/view-models/interview-copy'

type Props = {
  eliminatoire: boolean
  mapping: InterviewCloseMapping
  mainCritere?: string
  onEliminatoire: (value: boolean) => void
  onMapping: (value: InterviewCloseMapping) => void
  onCriterion: (value: string | undefined) => void
}

export function InterviewTemplateQuestionMeta({
  eliminatoire,
  mapping,
  mainCritere,
  onEliminatoire,
  onMapping,
  onCriterion,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] sm:items-end">
      <CheckboxChip label={INTERVIEW_ELIMINATOIRE} checked={eliminatoire} onChange={onEliminatoire} />
      <div className="min-w-0 text-sm font-medium text-fg">
        {INTERVIEW_TEMPLATE_MAPPING}
        <div className="mt-1">
          <Combobox
            value={mapping}
            options={INTERVIEW_MAPPING_OPTIONS}
            onChange={(value) => onMapping(parseCloseMapping(value))}
          />
        </div>
      </div>
      <div className="min-w-0 text-sm font-medium text-fg">
        {INTERVIEW_TEMPLATE_CRITERION}
        <div className="mt-1">
          <Combobox
            value={mainCritere ?? ''}
            options={INTERVIEW_CRITERION_OPTIONS}
            onChange={(value) => onCriterion(value || undefined)}
          />
        </div>
      </div>
    </div>
  )
}
