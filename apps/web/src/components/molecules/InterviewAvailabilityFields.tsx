'use client'

import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { DatePicker } from '@/components/molecules/DatePicker'
import { CLEAR_DATE_LABEL } from '@/lib/date-picker-utils'
import { INTERVIEW_AVAILABLE_NOW, INTERVIEW_PICK_DATE } from '@/view-models/interview-copy'
import { isIsoDateChoice } from '@/view-models/interview-question-kind'

type Props = {
  selected?: string
  disabled?: boolean
  onSelect: (label: string) => void
}

const NOW_OPTIONS = [{ value: INTERVIEW_AVAILABLE_NOW, label: INTERVIEW_AVAILABLE_NOW }]

export function InterviewAvailabilityFields({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup
        exclusive
        options={NOW_OPTIONS}
        values={selected === INTERVIEW_AVAILABLE_NOW ? [INTERVIEW_AVAILABLE_NOW] : []}
        onChange={(values) =>
          onSelect(values.includes(INTERVIEW_AVAILABLE_NOW) ? INTERVIEW_AVAILABLE_NOW : '')
        }
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
