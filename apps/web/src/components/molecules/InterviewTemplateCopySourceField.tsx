'use client'

import { useState } from 'react'
import { Combobox } from '@/components/molecules/Combobox'
import {
  interviewTemplateCopySourceOptions,
  parseInterviewTemplateSource,
} from '@/view-models/interview-admin-create'
import { INTERVIEW_TEMPLATE_COPY_SOURCE } from '@/view-models/interview-template-admin-copy'
import type { InterviewTemplateListRow } from '@/server/interview/template-admin-types'
import type { CreateInterviewTemplateForm } from '@/view-models/interview-admin-create'

type Props = {
  published: InterviewTemplateListRow[]
  onChange: (source: CreateInterviewTemplateForm['source']) => void
}

export function InterviewTemplateCopySourceField({ published, onChange }: Props) {
  const [value, setValue] = useState('')
  return (
    <div className="min-w-0 text-sm font-medium text-fg">
      {INTERVIEW_TEMPLATE_COPY_SOURCE}
      <div className="mt-1">
        <Combobox
          value={value}
          options={interviewTemplateCopySourceOptions(published)}
          onChange={(next) => {
            setValue(next)
            onChange(parseInterviewTemplateSource(next))
          }}
        />
      </div>
    </div>
  )
}
