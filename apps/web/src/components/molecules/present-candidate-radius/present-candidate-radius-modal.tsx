'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassModal } from '@/components/molecules/GlassModal'
import { PresentCandidateRadiusModalBody } from '@/components/molecules/present-candidate-radius/present-candidate-radius-modal-body'
import {
  PRESENT_CANDIDATE_RADIUS_MODAL_DESCRIPTION,
  PRESENT_CANDIDATE_RADIUS_MODAL_TITLE,
} from '@/lib/constants/present-candidate-radius-copy'
import { usePresentCandidateRadius } from '@/lib/hooks/use-present-candidate-radius'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'
import {
  presentCandidateDraftSchema,
  type PresentCandidateDraft,
} from '@/view-models/present-candidate-pharmacy-draft.schema'

type Props = {
  candidateId: string
  defaultRadiusKm: number
  onClose: () => void
  onActivityLogPrompt: (payload: ActivityLogPromptPayload) => void
}

export function PresentCandidateRadiusModal({
  candidateId,
  defaultRadiusKm,
  onClose,
  onActivityLogPrompt,
}: Props) {
  const flow = usePresentCandidateRadius(candidateId, defaultRadiusKm)
  const { control, reset, register, formState } = useForm<PresentCandidateDraft>({
    resolver: zodResolver(presentCandidateDraftSchema),
    defaultValues: { subject: '', body: '' },
  })
  const subject = useWatch({ control, name: 'subject' })
  const body = useWatch({ control, name: 'body' })

  useEffect(() => {
    if (!flow.draft) return
    reset({ subject: flow.draft.subject, body: flow.draft.body })
  }, [flow.draft, reset])

  const canSend = Boolean(flow.bcc && subject?.trim() && body?.trim() && flow.selectedIds.length > 0)

  return (
    <GlassModal
      open
      onClose={onClose}
      title={PRESENT_CANDIDATE_RADIUS_MODAL_TITLE}
      description={PRESENT_CANDIDATE_RADIUS_MODAL_DESCRIPTION}
      className="max-w-2xl"
      trapFocus
    >
      <PresentCandidateRadiusModalBody
        candidateId={candidateId}
        flow={flow}
        canSend={canSend}
        subject={subject ?? ''}
        body={body ?? ''}
        register={register}
        errors={formState.errors}
        onClose={onClose}
        onActivityLogPrompt={onActivityLogPrompt}
      />
    </GlassModal>
  )
}
