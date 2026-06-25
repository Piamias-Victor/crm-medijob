'use client'

import { Button } from '@/components/atoms/Button'
import {
  PRESENT_CANDIDATE_RADIUS_BCC_TOO_LONG,
  PRESENT_CANDIDATE_RADIUS_DRAFT_RETRY_LABEL,
} from '@/lib/constants/present-candidate-radius-copy'

type Props = {
  draftError?: string
  bccTooLong: boolean
  onRetryDraft?: () => void
}

export function PresentCandidateRadiusModalAlerts({ draftError, bccTooLong, onRetryDraft }: Props) {
  return (
    <>
      {draftError ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-error">{draftError}</p>
          {onRetryDraft ? (
            <Button type="button" variant="outline" className="px-3 py-1.5 text-xs" onClick={onRetryDraft}>
              {PRESENT_CANDIDATE_RADIUS_DRAFT_RETRY_LABEL}
            </Button>
          ) : null}
        </div>
      ) : null}
      {bccTooLong ? <p className="text-sm text-error">{PRESENT_CANDIDATE_RADIUS_BCC_TOO_LONG}</p> : null}
    </>
  )
}
