'use client'

import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { InterviewDossierSection } from '@/components/molecules/InterviewDossierSection'
import { InterviewQuestionBlock } from '@/components/molecules/InterviewQuestionBlock'
import { useInterviewDraftAutosave } from '@/lib/hooks/use-interview-draft-autosave'
import { useToastStore } from '@/stores/toast-store'
import { INTERVIEW_SAVE_SUCCESS, INTERVIEW_VALIDATE } from '@/view-models/interview-copy'
import { interviewClosePath } from '@/view-models/interview-href'
import {
  interviewDraftAnswersSchema,
  type InterviewDraftAnswers,
} from '@/view-models/interview-draft.schema'
import {
  checklistFromSelectedIds,
  checklistSelectedIds,
  toInterviewRunFormValues,
  type InterviewRun,
} from '@/view-models/interview-run'

type Props = { run: InterviewRun }

export function InterviewRunForm({ run }: Props) {
  const disabled = run.status !== 'DRAFT'
  const router = useRouter()
  const push = useToastStore((state) => state.push)
  const form = useForm<InterviewDraftAnswers>({
    resolver: zodResolver(interviewDraftAnswersSchema),
    defaultValues: toInterviewRunFormValues(run),
  })
  const { persist } = useInterviewDraftAutosave(form, run.id, !disabled)
  const questions = useWatch({ control: form.control, name: 'questions' }) ?? {}
  const checklist = useWatch({ control: form.control, name: 'checklist' }) ?? {}

  const setChoice = (questionId: string, choiceLabel: string) => {
    const nextAnswer = { ...questions[questionId], choiceLabel }
    const answers = form.getValues()
    form.setValue(`questions.${questionId}`, nextAnswer)
    persist({ ...answers, questions: { ...answers.questions, [questionId]: nextAnswer } })
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={(event) => event.preventDefault()}>
      {run.sections.map((section) => (
        <section key={section.id} id={section.id} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-fg">{section.title}</h2>
          {section.questions.map((question) => (
            <InterviewQuestionBlock
              key={question.id}
              question={question}
              choiceLabel={questions[question.id]?.choiceLabel}
              note={questions[question.id]?.note ?? ''}
              disabled={disabled}
              onChoice={(label) => setChoice(question.id, label)}
              onNote={(note) => form.setValue(`questions.${question.id}`, { ...questions[question.id], note })}
            />
          ))}
        </section>
      ))}
      <InterviewDossierSection
        candidateId={run.candidateId}
        items={run.checklistItems}
        selected={checklistSelectedIds(checklist)}
        disabled={disabled}
        onChange={(selected) => {
          const next = checklistFromSelectedIds(run.checklistItems, selected)
          form.setValue('checklist', next)
          persist({ ...form.getValues(), checklist: next })
        }}
        onUploaded={(itemId) => {
          const selected = [...new Set([...checklistSelectedIds(checklist), itemId])]
          const next = checklistFromSelectedIds(run.checklistItems, selected)
          form.setValue('checklist', next)
          persist({ ...form.getValues(), checklist: next })
        }}
      />
      {disabled ? null : (
        <Button
          type="button"
          variant="accent"
          onClick={() => {
            persist(form.getValues())
            push({ variant: 'success', message: INTERVIEW_SAVE_SUCCESS })
            router.push(interviewClosePath(run.candidateId, run.id))
          }}
        >
          {INTERVIEW_VALIDATE}
        </Button>
      )}
    </form>
  )
}
