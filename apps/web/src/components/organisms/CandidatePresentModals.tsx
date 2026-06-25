'use client'

import { PresentCandidatePharmacyModal } from '@/components/molecules/present-candidate-pharmacy/present-candidate-pharmacy-modal'
import { PresentCandidateRadiusModal } from '@/components/molecules/present-candidate-radius/present-candidate-radius-modal'
import { ActivityLogPromptModal } from '@/components/molecules/email-button/activity-log-prompt-modal'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'

type Props = {
  candidateId: string
  defaultRadiusKm: number
  presentOpen: boolean
  presentRadiusOpen: boolean
  activityLogPrompt: ActivityLogPromptPayload | null
  onClosePresent: () => void
  onClosePresentRadius: () => void
  onActivityLogPrompt: (payload: ActivityLogPromptPayload) => void
  onActivityLogPromptClose: () => void
}

export function CandidatePresentModals({
  candidateId,
  defaultRadiusKm,
  presentOpen,
  presentRadiusOpen,
  activityLogPrompt,
  onClosePresent,
  onClosePresentRadius,
  onActivityLogPrompt,
  onActivityLogPromptClose,
}: Props) {
  return (
    <>
      {presentOpen ? (
        <PresentCandidatePharmacyModal
          candidateId={candidateId}
          onClose={onClosePresent}
          onActivityLogPrompt={onActivityLogPrompt}
        />
      ) : null}
      {presentRadiusOpen ? (
        <PresentCandidateRadiusModal
          candidateId={candidateId}
          defaultRadiusKm={defaultRadiusKm}
          onClose={onClosePresentRadius}
          onActivityLogPrompt={onActivityLogPrompt}
        />
      ) : null}
      {activityLogPrompt ? (
        <ActivityLogPromptModal
          open
          onOpenChange={(open) => {
            if (!open) onActivityLogPromptClose()
          }}
          defaultContent={activityLogPrompt.defaultContent}
          scopes={activityLogPrompt.scopes}
        />
      ) : null}
    </>
  )
}
