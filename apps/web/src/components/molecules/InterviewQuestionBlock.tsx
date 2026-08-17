'use client'

import { Badge } from '@/components/atoms/Badge'
import { Textarea } from '@/components/atoms/Textarea'
import { InterviewQuestionInputs } from '@/components/molecules/InterviewQuestionInputs'
import { INTERVIEW_ELIMINATOIRE, INTERVIEW_NOTES } from '@/view-models/interview-copy'
import type { InterviewRunQuestion } from '@/view-models/interview-template'
import { cn } from '@/lib/cn'

type Props = {
  question: InterviewRunQuestion
  choiceLabel?: string
  note: string
  disabled?: boolean
  onChoice: (label: string) => void
  onNote: (note: string) => void
}

export function InterviewQuestionBlock({
  question,
  choiceLabel,
  note,
  disabled,
  onChoice,
  onNote,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-4',
        question.eliminatoire ? 'border-error/50 bg-error/10' : 'border-border bg-white',
      )}
    >
      <div className="flex flex-wrap items-start gap-2">
        <h3 className="text-sm font-semibold text-fg">{question.question}</h3>
        {question.eliminatoire ? <Badge variant="error">{INTERVIEW_ELIMINATOIRE}</Badge> : null}
      </div>
      <InterviewQuestionInputs
        question={question}
        choiceLabel={choiceLabel}
        disabled={disabled}
        onChoice={onChoice}
      />
      <Textarea
        value={note}
        disabled={disabled}
        placeholder={INTERVIEW_NOTES}
        rows={2}
        onChange={(event) => onNote(event.target.value)}
      />
    </div>
  )
}
