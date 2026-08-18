'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Input } from '@/components/atoms/Input'
import { SectionCard } from '@/components/molecules/SectionCard'
import { InterviewTemplateEditorToolbar } from '@/components/molecules/InterviewTemplateEditorToolbar'
import { InterviewTemplateSectionEditor } from '@/components/molecules/InterviewTemplateSectionEditor'
import { emptyAdminSection, replaceAt } from '@/view-models/interview-admin-draft'
import {
  INTERVIEW_TEMPLATE_HINT,
  INTERVIEW_TEMPLATE_LABEL,
  INTERVIEW_TEMPLATE_PUBLISH_SUCCESS,
  INTERVIEW_TEMPLATE_SAVE_SUCCESS,
} from '@/view-models/interview-template-admin-copy'
import type { InterviewTemplateWorkingCopy } from '@/server/routers/admin/interview-template'

export function InterviewTemplateEditor({ copy: initial }: { copy: InterviewTemplateWorkingCopy }) {
  const router = useRouter()
  const [copy, setCopy] = useState(initial)
  const saveOptions = useEntityMutation({
    successMessage: INTERVIEW_TEMPLATE_SAVE_SUCCESS,
    onSuccess: () => router.refresh(),
  })
  const publishOptions = useEntityMutation({
    successMessage: INTERVIEW_TEMPLATE_PUBLISH_SUCCESS,
    onSuccess: () => router.refresh(),
  })
  const save = trpc.admin.interviewTemplate.saveWorkingCopy.useMutation(saveOptions)
  const publish = trpc.admin.interviewTemplate.publish.useMutation(publishOptions)

  return (
    <SectionCard
      variant="glass"
      title={copy.label}
      description={INTERVIEW_TEMPLATE_HINT}
      actions={
        <InterviewTemplateEditorToolbar
          saving={save.isPending}
          publishing={publish.isPending}
          onSave={() => save.mutate(copy)}
          onPublish={() => {
            void save
              .mutateAsync(copy)
              .then(() => publish.mutate({ profileKey: copy.profileKey, mode: copy.mode }))
              .catch(() => undefined)
          }}
          onAddSection={() =>
            setCopy({ ...copy, sections: [...copy.sections, emptyAdminSection()] })
          }
        />
      }
    >
      <label className="mb-4 block text-sm font-medium text-fg">
        {INTERVIEW_TEMPLATE_LABEL}
        <Input
          className="mt-1"
          value={copy.label}
          onChange={(event) => setCopy({ ...copy, label: event.target.value })}
        />
      </label>
      <div className="flex flex-col gap-4">
        {copy.sections.map((section, index) => (
          <InterviewTemplateSectionEditor
            key={section.id}
            section={section}
            defaultOpen={index === 0 || section.title === ''}
            onChange={(next) => setCopy({ ...copy, sections: replaceAt(copy.sections, index, next) })}
            onRemove={() =>
              setCopy({ ...copy, sections: copy.sections.filter((_, current) => current !== index) })
            }
          />
        ))}
      </div>
    </SectionCard>
  )
}
