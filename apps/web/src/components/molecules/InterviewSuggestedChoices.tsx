'use client'

import { Button } from '@/components/atoms/Button'

type Choice = { label: string; text: string }

type Props = {
  answers: Choice[]
  selected?: string
  disabled?: boolean
  onSelect: (label: string) => void
}

export function InterviewSuggestedChoices({ answers, selected, disabled, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {answers.map((answer) => (
        <Button
          key={answer.label}
          type="button"
          title={answer.text}
          variant={selected === answer.label ? 'accent' : 'outline'}
          disabled={disabled}
          aria-pressed={selected === answer.label}
          onClick={() => onSelect(answer.label)}
        >
          {answer.label}
        </Button>
      ))}
    </div>
  )
}
