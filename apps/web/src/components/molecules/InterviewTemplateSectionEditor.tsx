'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { InterviewTemplateCollapseToggle } from '@/components/molecules/InterviewTemplateCollapseToggle'
import { InterviewTemplateQuestionEditor } from '@/components/molecules/InterviewTemplateQuestionEditor'
import { emptyAdminQuestion, removeAt, replaceAt } from '@/view-models/interview-admin-draft'
import {
  INTERVIEW_TEMPLATE_ADD_QUESTION,
  INTERVIEW_TEMPLATE_REMOVE,
  INTERVIEW_TEMPLATE_SECTION_FALLBACK,
  interviewTemplateQuestionCount,
} from '@/view-models/interview-template-admin-copy'
import type { InterviewAdminSection } from '@/view-models/interview-admin-sections'

type Props = {
  section: InterviewAdminSection
  defaultOpen?: boolean
  onChange: (section: InterviewAdminSection) => void
  onRemove: () => void
}

export function InterviewTemplateSectionEditor({
  section,
  defaultOpen = false,
  onChange,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-white/80 p-4">
      <div className="flex items-center gap-2">
        <InterviewTemplateCollapseToggle
          open={open}
          title={section.title.trim() || INTERVIEW_TEMPLATE_SECTION_FALLBACK}
          meta={interviewTemplateQuestionCount(section.questions.length)}
          onToggle={() => setOpen((current) => !current)}
        />
        <Button type="button" variant="danger" className="shrink-0 px-3 py-2" onClick={onRemove}>
          {INTERVIEW_TEMPLATE_REMOVE}
        </Button>
      </div>
      {open ? (
        <>
          <div className="flex gap-2">
            <Input
              aria-label="Titre de section"
              value={section.title}
              onChange={(event) => onChange({ ...section, title: event.target.value })}
            />
            <Input
              aria-label="Hint"
              placeholder="B1"
              value={section.hint ?? ''}
              onChange={(event) => onChange({ ...section, hint: event.target.value || undefined })}
            />
          </div>
          {section.questions.map((question, index) => (
            <InterviewTemplateQuestionEditor
              key={question.id}
              question={question}
              defaultOpen={index === 0 || question.question === ''}
              onChange={(next) =>
                onChange({ ...section, questions: replaceAt(section.questions, index, next) })
              }
              onRemove={() =>
                onChange({ ...section, questions: removeAt(section.questions, index) })
              }
            />
          ))}
          <Button
            type="button"
            variant="accent"
            onClick={() =>
              onChange({ ...section, questions: [...section.questions, emptyAdminQuestion()] })
            }
          >
            {INTERVIEW_TEMPLATE_ADD_QUESTION}
          </Button>
        </>
      ) : null}
    </div>
  )
}
