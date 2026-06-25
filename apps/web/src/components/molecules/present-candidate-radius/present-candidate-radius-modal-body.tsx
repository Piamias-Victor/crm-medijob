'use client'

import { Spinner } from '@/components/atoms/Spinner'
import { PresentCandidatePharmacyDraftFields } from '@/components/molecules/present-candidate-pharmacy/present-candidate-pharmacy-draft-fields'
import { PresentCandidateRadiusFilters } from '@/components/molecules/present-candidate-radius/present-candidate-radius-filters'
import { PresentCandidateRadiusModalAlerts } from '@/components/molecules/present-candidate-radius/present-candidate-radius-modal-alerts'
import { PresentCandidateRadiusModalFooter } from '@/components/molecules/present-candidate-radius/present-candidate-radius-modal-footer'
import { PresentCandidateRadiusPharmacyList } from '@/components/molecules/present-candidate-radius/present-candidate-radius-pharmacy-list'
import {
  PRESENT_CANDIDATE_RADIUS_EMPTY,
  PRESENT_CANDIDATE_RADIUS_GENERATING,
  PRESENT_CANDIDATE_RADIUS_LOADING,
} from '@/lib/constants/present-candidate-radius-copy'
import { isComposeBccTooLong } from '@/lib/mailto/gmail-compose-limits'
import type { usePresentCandidateRadius } from '@/lib/hooks/use-present-candidate-radius'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { PresentCandidateDraft } from '@/view-models/present-candidate-pharmacy-draft.schema'

type Flow = ReturnType<typeof usePresentCandidateRadius>

type Props = {
  candidateId: string
  flow: Flow
  canSend: boolean
  subject: string
  body: string
  register: UseFormRegister<PresentCandidateDraft>
  errors: FieldErrors<PresentCandidateDraft>
  onClose: () => void
  onActivityLogPrompt: (payload: ActivityLogPromptPayload) => void
}

export function PresentCandidateRadiusModalBody({
  candidateId,
  flow,
  canSend,
  subject,
  body,
  register,
  errors,
  onClose,
  onActivityLogPrompt,
}: Props) {
  const bccTooLong = isComposeBccTooLong(flow.bcc)

  return (
    <div className="space-y-5">
      <PresentCandidateRadiusFilters
        radiusKm={flow.radiusInput}
        centerLabel={flow.centerLabel}
        onRadiusChange={flow.setRadiusInput}
      />
      {flow.listLoading ? (
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <Spinner className="size-4 border-accent/40 border-t-accent" />
          {PRESENT_CANDIDATE_RADIUS_LOADING}
        </div>
      ) : null}
      {flow.listError ? <p className="text-sm text-error">{flow.listError}</p> : null}
      {!flow.listLoading && flow.pharmacies.length === 0 ? (
        <p className="text-sm text-fg-muted">{PRESENT_CANDIDATE_RADIUS_EMPTY}</p>
      ) : null}
      {flow.pharmacies.length > 0 ? (
        <PresentCandidateRadiusPharmacyList
          pharmacies={flow.pharmacies}
          selectedIds={flow.selectedIds}
          onToggle={flow.togglePharmacy}
        />
      ) : null}
      <PresentCandidateRadiusModalAlerts
        draftError={flow.draftError}
        bccTooLong={bccTooLong}
        onRetryDraft={flow.retryDraft}
      />
      {flow.generating ? (
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <Spinner className="size-4 border-accent/40 border-t-accent" />
          {PRESENT_CANDIDATE_RADIUS_GENERATING}
        </div>
      ) : null}
      {flow.draft ? <PresentCandidatePharmacyDraftFields register={register} errors={errors} /> : null}
      <PresentCandidateRadiusModalFooter
        canSend={canSend && !bccTooLong}
        bcc={flow.bcc}
        subject={subject}
        body={body}
        activityLogContext={{ candidateId, pharmacyIds: flow.selectedIds }}
        onClose={onClose}
        onActivityLogPrompt={onActivityLogPrompt}
      />
    </div>
  )
}
