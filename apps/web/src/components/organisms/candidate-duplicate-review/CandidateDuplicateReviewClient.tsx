'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { DuplicateDetectionPage } from '@/components/organisms/duplicate-detection-page/duplicate-detection-page'
import { CandidateDuplicatePicker } from '@/components/molecules/CandidateDuplicatePicker'
import { buildCandidateDuplicateFields } from '@/lib/candidate-duplicate-fields'
import { useCandidateDuplicateReviewActions } from '@/lib/hooks/use-candidate-duplicate-review-actions'
import {
  DUPLICATE_REVIEW_EXPIRED,
  DUPLICATE_REVIEW_LOADING,
} from '@/components/organisms/candidate-duplicate-review/candidate-duplicate-review-copy'
import {
  toDuplicateRowFromInput,
  toDuplicateRowFromProfile,
} from '@/view-models/candidate-duplicate-compare'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { RefItem } from '@/view-models/referential'

type Props = {
  initialExistingId?: string
  pick?: boolean
  existing?: CandidateProfilePayload | null
  referentials: { jobTitles: RefItem[]; softwares: RefItem[]; recruiters: RefItem[] }
}

export function CandidateDuplicateReviewClient({
  initialExistingId,
  pick,
  existing,
  referentials,
}: Props) {
  const [existingId, setExistingId] = useState(initialExistingId)
  const { draft, onMerge, onIgnore, onCancel } = useCandidateDuplicateReviewActions(existingId ?? '')
  const profileQuery = trpc.candidate.getById.useQuery(
    { id: existingId ?? '' },
    { enabled: Boolean(existingId) && !existing },
  )
  const profile = existing ?? profileQuery.data

  if (!draft) {
    return <p className="text-sm text-fg-muted">{DUPLICATE_REVIEW_EXPIRED}</p>
  }

  if (pick && !existingId) {
    return <CandidateDuplicatePicker matches={draft.matches} onSelect={setExistingId} />
  }

  if (!existingId || !profile) return <p className="text-sm text-fg-muted">{DUPLICATE_REVIEW_LOADING}</p>

  const left = toDuplicateRowFromProfile(profile)
  const right = toDuplicateRowFromInput(draft.incoming, draft.cvUrl)

  return (
    <DuplicateDetectionPage
      left={left}
      right={right}
      fields={buildCandidateDuplicateFields(referentials)}
      onMerge={onMerge}
      onIgnore={onIgnore}
      onCancel={onCancel}
    />
  )
}
