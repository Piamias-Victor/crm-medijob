'use client'

import { Building2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { EmailButton } from '@/components/molecules/email-button/email-button'
import { PRESENT_CANDIDATE_PHARMACY_GMAIL_LABEL } from '@/lib/constants/present-candidate-pharmacy-copy'
import type { ActivityLogContext } from '@/components/molecules/email-button/activity-log-context'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'

type Props = {
  canSend: boolean
  to?: string
  subject: string
  body: string
  activityLogContext: ActivityLogContext
  onClose: () => void
  onActivityLogPrompt: (payload: ActivityLogPromptPayload) => void
}

export function PresentCandidatePharmacyModalFooter({
  canSend,
  to,
  subject,
  body,
  activityLogContext,
  onClose,
  onActivityLogPrompt,
}: Props) {
  return (
    <div className="flex justify-end gap-2 border-t border-border pt-4">
      <Button type="button" variant="ghost" onClick={onClose}>
        Annuler
      </Button>
      {canSend && to ? (
        <EmailButton
          to={to}
          subject={subject}
          body={body}
          label={PRESENT_CANDIDATE_PHARMACY_GMAIL_LABEL}
          activityLogContext={activityLogContext}
          onActivityLogPrompt={(payload) => {
            onClose()
            onActivityLogPrompt(payload)
          }}
        />
      ) : (
        <Button type="button" variant="accent" disabled>
          <Building2 className="size-4" />
          {PRESENT_CANDIDATE_PHARMACY_GMAIL_LABEL}
        </Button>
      )}
    </div>
  )
}
