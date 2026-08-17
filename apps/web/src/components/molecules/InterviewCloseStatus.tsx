'use client'

import { CANDIDATE_STATUS_LABELS } from '@/lib/candidate-status-options'
import { INTERVIEW_APPLY_STATUS, INTERVIEW_BLACKLIST } from '@/view-models/interview-copy'
import type { CandidateStatus } from '@/view-models/candidate-status'

type Props = {
  proposedStatus: CandidateStatus | null
  applyStatus: boolean
  blacklist: boolean
  showBlacklist: boolean
  onApplyStatus: (value: boolean) => void
  onBlacklist: (value: boolean) => void
}

export function InterviewCloseStatus({
  proposedStatus,
  applyStatus,
  blacklist,
  showBlacklist,
  onApplyStatus,
  onBlacklist,
}: Props) {
  if (!proposedStatus && !showBlacklist) return null
  return (
    <fieldset className="flex flex-col gap-2 text-sm text-fg">
      {proposedStatus ? (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-[var(--color-accent)]"
            checked={applyStatus}
            onChange={(event) => onApplyStatus(event.target.checked)}
          />
          {INTERVIEW_APPLY_STATUS} → {CANDIDATE_STATUS_LABELS[proposedStatus]}
        </label>
      ) : null}
      {showBlacklist ? (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-[var(--color-accent)]"
            checked={blacklist}
            onChange={(event) => onBlacklist(event.target.checked)}
          />
          {INTERVIEW_BLACKLIST}
        </label>
      ) : null}
    </fieldset>
  )
}
