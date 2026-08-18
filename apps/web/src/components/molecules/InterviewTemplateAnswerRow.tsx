'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import {
  INTERVIEW_TEMPLATE_ANSWER_LABEL,
  INTERVIEW_TEMPLATE_ANSWER_TEXT,
  INTERVIEW_TEMPLATE_POINTS,
  INTERVIEW_TEMPLATE_REMOVE,
} from '@/view-models/interview-template-admin-copy'

type Answer = { label: string; text: string; points: number; tone: string }

type Props = {
  answer: Answer
  onChange: (answer: Answer) => void
  onRemove: () => void
}

export function InterviewTemplateAnswerRow({ answer, onChange, onRemove }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_2fr_5rem_auto]">
      <Input
        aria-label={INTERVIEW_TEMPLATE_ANSWER_LABEL}
        placeholder={INTERVIEW_TEMPLATE_ANSWER_LABEL}
        value={answer.label}
        onChange={(event) => onChange({ ...answer, label: event.target.value })}
      />
      <Input
        aria-label={INTERVIEW_TEMPLATE_ANSWER_TEXT}
        placeholder={INTERVIEW_TEMPLATE_ANSWER_TEXT}
        value={answer.text}
        onChange={(event) => onChange({ ...answer, text: event.target.value })}
      />
      <Input
        aria-label={INTERVIEW_TEMPLATE_POINTS}
        type="number"
        value={answer.points}
        onChange={(event) => onChange({ ...answer, points: Number(event.target.value) || 0 })}
      />
      <Button
        type="button"
        variant="danger"
        className="px-3"
        aria-label={INTERVIEW_TEMPLATE_REMOVE}
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
