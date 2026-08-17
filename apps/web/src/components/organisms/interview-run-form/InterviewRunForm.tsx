'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { InterviewQuestionBlock } from '@/components/molecules/InterviewQuestionBlock'
import { useInterviewDraftAutosave } from '@/lib/hooks/use-interview-draft-autosave'
import { toChecklistOptions } from '@/view-models/interview-checklist'
import { INTERVIEW_CHECKLIST_TITLE } from '@/view-models/interview-copy'
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
  const form = useForm<InterviewDraftAnswers>({
    resolver: zodResolver(interviewDraftAnswersSchema),
    defaultValues: toInterviewRunFormValues(run),
  })
  const { persist } = useInterviewDraftAutosave(form, run.id, !disabled)
  const questions = useWatch({ control: form.control, name: 'questions' }) ?? {}
  const checklist = useWatch({ control: form.control, name: 'checklist' }) ?? {}

  return (
    <form className="flex flex-col gap-8" onSubmit={(event) => event.preventDefault()}>
      {run.sections.map((section) => (
        <section key={section.id} id={section.id} className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-fg">{section.title}</h2>
            {section.hint ? <p className="text-sm text-fg-muted">{section.hint}</p> : null}
          </div>
          {section.questions.map((question) => (
            <InterviewQuestionBlock
              key={question.id}
              question={question}
              choiceLabel={questions[question.id]?.choiceLabel}
              note={questions[question.id]?.note ?? ''}
              disabled={disabled}
              onChoice={(label) => {
                const current = questions[question.id]
                const nextAnswer = { ...current, choiceLabel: label }
                const answers = form.getValues()
                const next = {
                  ...answers,
                  questions: { ...answers.questions, [question.id]: nextAnswer },
                }
                form.setValue(`questions.${question.id}`, nextAnswer)
                persist(next)
              }}
              onNote={(note) => {
                const current = questions[question.id]
                form.setValue(`questions.${question.id}`, { ...current, note })
              }}
            />
          ))}
        </section>
      ))}
      <section id="dossier" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-fg">{INTERVIEW_CHECKLIST_TITLE}</h2>
        <CheckboxGroup
          options={toChecklistOptions(run.checklistItems)}
          values={checklistSelectedIds(checklist)}
          onChange={(selected) => {
            const next = checklistFromSelectedIds(run.checklistItems, selected)
            form.setValue('checklist', next)
            persist({ ...form.getValues(), checklist: next })
          }}
        />
      </section>
    </form>
  )
}
