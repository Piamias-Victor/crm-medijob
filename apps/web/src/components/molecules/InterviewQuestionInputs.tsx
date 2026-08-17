'use client'

import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { InterviewAvailabilityFields } from '@/components/molecules/InterviewAvailabilityFields'
import { INTERVIEW_SOFTWARE_OPTIONS } from '@/view-models/interview-software'
import { pertinentInterviewChips } from '@/view-models/interview-pertinent-chips'
import {
  interviewQuestionKind,
  joinChoiceLabels,
  splitChoiceLabels,
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
  return chips.map((chip) => ({ value: chip.label, label: chip.label }))
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
      values={splitChoiceLabels(choiceLabel)}
      onChange={(values) => onChoice(joinChoiceLabels(values))}
    />
  )
}
