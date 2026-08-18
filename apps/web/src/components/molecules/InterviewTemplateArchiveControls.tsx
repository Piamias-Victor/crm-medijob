'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Button } from '@/components/atoms/Button'
import { GlassModal } from '@/components/molecules/GlassModal'
import { canArchiveInterviewProfile } from '@/view-models/interview-template-profile-key'
import {
  INTERVIEW_TEMPLATE_ARCHIVE,
  INTERVIEW_TEMPLATE_ARCHIVE_HINT,
  INTERVIEW_TEMPLATE_ARCHIVE_SUCCESS,
  INTERVIEW_TEMPLATE_CANCEL,
} from '@/view-models/interview-template-admin-copy'
import type { InterviewMode } from '@prisma/client'

type Props = { profileKey: string; mode: InterviewMode }

export function InterviewTemplateArchiveControls({ profileKey, mode }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const archive = trpc.admin.interviewTemplate.archive.useMutation(
    useEntityMutation({
      successMessage: INTERVIEW_TEMPLATE_ARCHIVE_SUCCESS,
      onSuccess: () => router.push('/admin/metiers'),
    }),
  )
  if (!canArchiveInterviewProfile(profileKey)) return null
  return (
    <>
      <Button type="button" variant="danger" disabled={archive.isPending} onClick={() => setOpen(true)}>
        {INTERVIEW_TEMPLATE_ARCHIVE}
      </Button>
      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={INTERVIEW_TEMPLATE_ARCHIVE}
        description={INTERVIEW_TEMPLATE_ARCHIVE_HINT}
        className="max-w-md"
        role="alertdialog"
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {INTERVIEW_TEMPLATE_CANCEL}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={archive.isPending}
            onClick={() => archive.mutate({ profileKey, mode })}
          >
            {INTERVIEW_TEMPLATE_ARCHIVE}
          </Button>
        </div>
      </GlassModal>
    </>
  )
}
