'use client'

import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { InterviewAvailabilityFields } from '@/components/molecules/InterviewAvailabilityFields'
import { INTERVIEW_SOFTWARE_OPTIONS } from '@/view-models/interview-software'
import { interviewChipDisplayLabel } from '@/view-models/interview-quality-chip-labels'
import { pertinentInterviewChips } from '@/view-models/interview-pertinent-chips'
import {
  interviewQuestionKind,
  persistChoiceValues,
  selectedChoiceValues,
} from '@/view-models/interview-question-kind'
import type { InterviewRunQuestion } from '@/view-models/interview-template'

type Props = {
  question: InterviewRunQuestion
  choiceLabel?: string
  disabled?: boolean
  onChoice: (label: string) => void
}

function chipOptions(question: InterviewRunQuestion) {
  if (interviewQuestionKind(question.question) === 'software') return INTERVIEW_SOFTWARE_OPTIONS
  const chips = pertinentInterviewChips(question.question) ?? question.suggestedAnswers
  return chips.map((chip) => ({
    value: chip.label,
    label: interviewChipDisplayLabel(chip.label),
  }))
}

export function InterviewQuestionInputs({ question, choiceLabel, disabled, onChoice }: Props) {
  if (interviewQuestionKind(question.question) === 'availability') {
    return (
      <InterviewAvailabilityFields selected={choiceLabel} disabled={disabled} onSelect={onChoice} />
    )
  }
  const options = chipOptions(question)
  if (options.length === 0) return null
  const exclusive = interviewQuestionKind(question.question) === 'choice'
  return (
    <CheckboxGroup
      exclusive={exclusive}
      options={options}
      values={selectedChoiceValues(choiceLabel, exclusive)}
      onChange={(values) => onChoice(persistChoiceValues(values, exclusive))}
      disabled={disabled}
    />
  )
}
