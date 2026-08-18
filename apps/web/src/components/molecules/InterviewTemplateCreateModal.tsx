'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassModal } from '@/components/molecules/GlassModal'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { InterviewTemplateCopySourceField } from '@/components/molecules/InterviewTemplateCopySourceField'
import {
  createInterviewTemplateSchema,
  type CreateInterviewTemplateForm,
} from '@/view-models/interview-admin-create'
import { suggestInterviewProfileKey } from '@/view-models/interview-template-profile-key'
import { INTERVIEW_MODE_LABELS } from '@/view-models/interview-labels'
import {
  INTERVIEW_TEMPLATE_CANCEL,
  INTERVIEW_TEMPLATE_CREATE,
  INTERVIEW_TEMPLATE_PROFILE_KEY,
} from '@/view-models/interview-template-admin-copy'
import type { InterviewTemplateListRow } from '@/server/interview/template-admin-types'

type Props = {
  open: boolean
  jobTitleId: string
  name: string
  profileKey: string | null
  mode: 'INTERIM' | 'CDD_CDI'
  published: InterviewTemplateListRow[]
  submitting: boolean
  onClose: () => void
  onCreate: (input: CreateInterviewTemplateForm) => Promise<void>
}

export function InterviewTemplateCreateModal({
  open,
  jobTitleId,
  name,
  profileKey,
  mode,
  published,
  submitting,
  onClose,
  onCreate,
}: Props) {
  const form = useForm<CreateInterviewTemplateForm>({
    resolver: zodResolver(createInterviewTemplateSchema),
    values: {
      jobTitleId,
      mode,
      profileKey: profileKey ?? suggestInterviewProfileKey(name),
    },
  })
  return (
    <GlassModal open={open} onClose={onClose} title={INTERVIEW_TEMPLATE_CREATE} className="max-w-md">
      <form className="space-y-3" onSubmit={form.handleSubmit((input) => onCreate(input))}>
        <p className="text-sm text-fg-muted">
          {name} · {INTERVIEW_MODE_LABELS[mode]}
        </p>
        {!profileKey ? (
          <label className="block text-sm font-medium text-fg">
            {INTERVIEW_TEMPLATE_PROFILE_KEY}
            <Input className="mt-1" {...form.register('profileKey')} />
          </label>
        ) : null}
        <InterviewTemplateCopySourceField
          published={published}
          onChange={(source) => form.setValue('source', source)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {INTERVIEW_TEMPLATE_CANCEL}
          </Button>
          <Button type="submit" variant="accent" disabled={submitting}>
            {INTERVIEW_TEMPLATE_CREATE}
          </Button>
        </div>
      </form>
    </GlassModal>
  )
}
