'use client'

import { DatePicker } from '@/components/molecules/DatePicker'
import { InterviewSuggestedChoices } from '@/components/molecules/InterviewSuggestedChoices'
import { CLEAR_DATE_LABEL } from '@/lib/date-picker-utils'
import { INTERVIEW_AVAILABLE_NOW, INTERVIEW_PICK_DATE } from '@/view-models/interview-copy'
import { isIsoDateChoice } from '@/view-models/interview-question-kind'

type Props = {
  selected?: string
  disabled?: boolean
  onSelect: (label: string) => void
}

export function InterviewAvailabilityFields({ selected, disabled, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <InterviewSuggestedChoices
        answers={[{ label: INTERVIEW_AVAILABLE_NOW, text: INTERVIEW_AVAILABLE_NOW }]}
        selected={selected === INTERVIEW_AVAILABLE_NOW ? INTERVIEW_AVAILABLE_NOW : undefined}
        disabled={disabled}
        onSelect={onSelect}
      />
      <DatePicker
        value={isIsoDateChoice(selected) ? selected : undefined}
        onChange={(iso) => onSelect(iso ?? '')}
        emptyLabel={INTERVIEW_PICK_DATE}
        clearLabel={CLEAR_DATE_LABEL}
      />
    </div>
  )
}
