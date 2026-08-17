'use client'

import { Select } from '@/components/atoms/Select'
import { INTERVIEW_DECISION_OPTIONS } from '@/view-models/interview-labels'
import { INTERVIEW_DECISION_TITLE } from '@/view-models/interview-copy'
import type { InterviewCloseInput } from '@/view-models/interview-close.schema'

type Props = {
  value: InterviewCloseInput['decision']
  onChange: (value: InterviewCloseInput['decision']) => void
}

export function InterviewDecisionSelect({ value, onChange }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm text-fg">
      <span className="font-semibold">{INTERVIEW_DECISION_TITLE}</span>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value as InterviewCloseInput['decision'])}
      >
        {INTERVIEW_DECISION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  )
}
