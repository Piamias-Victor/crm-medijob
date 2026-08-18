'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { interviewTemplateEditorHref } from '@/view-models/job-title-trame-cards'
import {
  INTERVIEW_TEMPLATE_CREATE_SUCCESS,
  INTERVIEW_TEMPLATE_TITLE,
} from '@/view-models/interview-template-admin-copy'
import { InterviewTemplateCreateModal } from '@/components/molecules/InterviewTemplateCreateModal'
import {
  JobTitleModeButtons,
  type JobTitleTrameMode,
} from '@/components/molecules/JobTitleModeButtons'
import type { InterviewTemplatePairStatus } from '@/view-models/interview-template-pairs'
import type { InterviewTemplateListRow } from '@/server/interview/template-admin-types'
import type { RefItem } from '@/view-models/referential'

type Props = {
  item: RefItem
  pairs: InterviewTemplatePairStatus[]
  published: InterviewTemplateListRow[]
}

export function JobTitleTrameLinks({ item, pairs, published }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<JobTitleTrameMode | null>(null)
  const create = trpc.admin.interviewTemplate.create.useMutation(
    useEntityMutation({
      successMessage: INTERVIEW_TEMPLATE_CREATE_SUCCESS,
      onSuccess: () => router.refresh(),
    }),
  )
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">{INTERVIEW_TEMPLATE_TITLE}</p>
      <JobTitleModeButtons item={item} pairs={pairs} onCreate={setMode} />
      {mode ? (
        <InterviewTemplateCreateModal
          open
          jobTitleId={item.id}
          name={item.name}
          profileKey={item.profileKey ?? null}
          mode={mode}
          published={published}
          submitting={create.isPending}
          onClose={() => setMode(null)}
          onCreate={async (input) => {
            const copy = await create.mutateAsync(input)
            router.push(interviewTemplateEditorHref(copy.profileKey, copy.mode))
          }}
        />
      ) : null}
    </div>
  )
}
