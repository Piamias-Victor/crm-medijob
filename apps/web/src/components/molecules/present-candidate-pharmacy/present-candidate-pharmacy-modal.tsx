'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/atoms/Spinner'
import { GlassModal } from '@/components/molecules/GlassModal'
import {
  PRESENT_CANDIDATE_PHARMACY_GENERATING,
  PRESENT_CANDIDATE_PHARMACY_MODAL_DESCRIPTION,
  PRESENT_CANDIDATE_PHARMACY_MODAL_TITLE,
} from '@/lib/constants/present-candidate-pharmacy-copy'
import { PresentCandidatePharmacyDraftFields } from '@/components/molecules/present-candidate-pharmacy/present-candidate-pharmacy-draft-fields'
import { PresentCandidatePharmacyModalFooter } from '@/components/molecules/present-candidate-pharmacy/present-candidate-pharmacy-modal-footer'
import { PresentCandidatePharmacyPickers } from '@/components/molecules/present-candidate-pharmacy/present-candidate-pharmacy-pickers'
import { usePresentCandidatePharmacy } from '@/lib/hooks/use-present-candidate-pharmacy'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'
import {
  presentCandidateDraftSchema,
  type PresentCandidateDraft,
} from '@/view-models/present-candidate-pharmacy-draft.schema'

type Props = {
  candidateId: string
  onClose: () => void
  onActivityLogPrompt: (payload: ActivityLogPromptPayload) => void
}

export function PresentCandidatePharmacyModal({ candidateId, onClose, onActivityLogPrompt }: Props) {
  const flow = usePresentCandidatePharmacy(candidateId)
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

  const canSend = Boolean(flow.draft?.to && subject?.trim() && body?.trim() && !flow.noEmailContacts)

  return (
    <GlassModal
      open
      onClose={onClose}
      title={PRESENT_CANDIDATE_PHARMACY_MODAL_TITLE}
      description={PRESENT_CANDIDATE_PHARMACY_MODAL_DESCRIPTION}
      className="max-w-2xl"
      trapFocus
    >
      <div className="space-y-5">
        <PresentCandidatePharmacyPickers
          pharmacyId={flow.pharmacyId}
          contactId={flow.contactId}
          pharmacyOptions={flow.pharmacyOptions}
          contactOptions={flow.contactOptions}
          pharmacySearchLoading={flow.pharmacySearchLoading}
          contactsLoading={flow.contactsLoading}
          noEmailContacts={flow.noEmailContacts}
          onPharmacySearch={flow.setPharmacySearchTerm}
          onPharmacyChange={flow.selectPharmacy}
          onContactChange={flow.selectContact}
        />
        {flow.error ? <p className="text-sm text-error">{flow.error}</p> : null}
        {flow.generating ? (
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <Spinner className="size-4 border-accent/40 border-t-accent" />
            {PRESENT_CANDIDATE_PHARMACY_GENERATING}
          </div>
        ) : null}
        {flow.draft ? (
          <PresentCandidatePharmacyDraftFields register={register} errors={formState.errors} />
        ) : null}
        <PresentCandidatePharmacyModalFooter
          canSend={canSend}
          to={flow.draft?.to}
          subject={subject ?? ''}
          body={body ?? ''}
          activityLogContext={{
            candidateId,
            pharmacyId: flow.pharmacyId,
            contactId: flow.contactId,
          }}
          onClose={onClose}
          onActivityLogPrompt={onActivityLogPrompt}
        />
      </div>
    </GlassModal>
  )
}
