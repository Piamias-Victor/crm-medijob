'use client'

import { Input } from '@/components/atoms/Input'
import { interviewCriterionLabel } from '@/view-models/interview-criteria-labels'
import { INTERVIEW_SCORES_TITLE } from '@/view-models/interview-copy'

type Props = {
  scores: Record<string, number>
  onChange: (id: string, value: number) => void
}

export function InterviewScoreGrid({ scores, onChange }: Props) {
  const ids = Object.keys(scores).sort()
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-fg">{INTERVIEW_SCORES_TITLE}</legend>
      {ids.map((id) => (
        <label key={id} className="flex items-center justify-between gap-4 text-sm text-fg">
          <span>
            {id} — {interviewCriterionLabel(id)}
          </span>
          <Input
            type="number"
            className="w-24"
            value={scores[id]}
            onChange={(event) => onChange(id, Number(event.target.value))}
          />
        </label>
      ))}
    </fieldset>
  )
}
