'use client'

import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { InterviewAvailabilityFields } from '@/components/molecules/InterviewAvailabilityFields'
import { InterviewSuggestedChoices } from '@/components/molecules/InterviewSuggestedChoices'
import { INTERVIEW_SOFTWARE_OPTIONS } from '@/view-models/interview-software'
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

export function InterviewQuestionInputs({ question, choiceLabel, disabled, onChoice }: Props) {
  const kind = interviewQuestionKind(question.question)
  if (kind === 'notes') return null
  if (kind === 'software') {
    return (
      <CheckboxGroup
        options={INTERVIEW_SOFTWARE_OPTIONS}
        values={splitChoiceLabels(choiceLabel)}
        onChange={(values) => onChoice(joinChoiceLabels(values))}
      />
    )
  }
  if (kind === 'availability') {
    return (
      <InterviewAvailabilityFields selected={choiceLabel} disabled={disabled} onSelect={onChoice} />
    )
  }
  return (
    <InterviewSuggestedChoices
      answers={question.suggestedAnswers}
      selected={choiceLabel}
      disabled={disabled}
      onSelect={onChoice}
    />
  )
}
