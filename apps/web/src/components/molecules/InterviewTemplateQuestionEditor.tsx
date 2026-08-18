'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { InterviewTemplateAnswerLegend } from '@/components/molecules/InterviewTemplateAnswerLegend'
import { InterviewTemplateAnswerRow } from '@/components/molecules/InterviewTemplateAnswerRow'
import { InterviewTemplateCollapseToggle } from '@/components/molecules/InterviewTemplateCollapseToggle'
import { InterviewTemplateQuestionMeta } from '@/components/molecules/InterviewTemplateQuestionMeta'
import { emptyAdminAnswer, removeAt, replaceAt } from '@/view-models/interview-admin-draft'
import {
  INTERVIEW_TEMPLATE_ADD_ANSWER,
  INTERVIEW_TEMPLATE_QUESTION_FALLBACK,
  INTERVIEW_TEMPLATE_REMOVE,
} from '@/view-models/interview-template-admin-copy'
import type { InterviewAdminQuestion } from '@/view-models/interview-admin-sections'

type Props = {
  question: InterviewAdminQuestion
  defaultOpen?: boolean
  onChange: (question: InterviewAdminQuestion) => void
  onRemove: () => void
}

export function InterviewTemplateQuestionEditor({
  question,
  defaultOpen = false,
  onChange,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="space-y-3 rounded-md border border-border/40 p-3">
      <div className="flex items-center gap-2">
        <InterviewTemplateCollapseToggle
          open={open}
          title={question.question.trim() || INTERVIEW_TEMPLATE_QUESTION_FALLBACK}
          onToggle={() => setOpen((current) => !current)}
        />
        <Button type="button" variant="danger" className="shrink-0 px-3 py-2" onClick={onRemove}>
          {INTERVIEW_TEMPLATE_REMOVE}
        </Button>
      </div>
      {open ? (
        <>
          <Textarea
            aria-label="Intitulé"
            rows={2}
            value={question.question}
            onChange={(event) => onChange({ ...question, question: event.target.value })}
          />
          <InterviewTemplateQuestionMeta
            eliminatoire={question.eliminatoire}
            mapping={question.mapping}
            mainCritere={question.mainCritere}
            onEliminatoire={(eliminatoire) => onChange({ ...question, eliminatoire })}
            onMapping={(mapping) => onChange({ ...question, mapping })}
            onCriterion={(mainCritere) => onChange({ ...question, mainCritere })}
          />
          <InterviewTemplateAnswerLegend />
          {question.suggestedAnswers.map((answer, index) => (
            <InterviewTemplateAnswerRow
              key={`${question.id}-${index}`}
              answer={answer}
              onChange={(next) =>
                onChange({
                  ...question,
                  suggestedAnswers: replaceAt(question.suggestedAnswers, index, next),
                })
              }
              onRemove={() =>
                onChange({ ...question, suggestedAnswers: removeAt(question.suggestedAnswers, index) })
              }
            />
          ))}
          <Button
            type="button"
            variant="accent"
            onClick={() =>
              onChange({
                ...question,
                suggestedAnswers: [...question.suggestedAnswers, emptyAdminAnswer()],
              })
            }
          >
            {INTERVIEW_TEMPLATE_ADD_ANSWER}
          </Button>
        </>
      ) : null}
    </div>
  )
}
