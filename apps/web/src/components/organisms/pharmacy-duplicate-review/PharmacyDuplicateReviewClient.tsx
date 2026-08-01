'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { DuplicateDetectionPage } from '@/components/organisms/duplicate-detection-page/duplicate-detection-page'
import { PharmacyDuplicatePicker } from '@/components/molecules/PharmacyDuplicatePicker'
import { buildPharmacyDuplicateFields } from '@/lib/pharmacy-duplicate-fields'
import { usePharmacyDuplicateReviewActions } from '@/lib/hooks/use-pharmacy-duplicate-review-actions'
import {
  PHARMACY_DUPLICATE_REVIEW_EXPIRED,
  PHARMACY_DUPLICATE_REVIEW_LOADING,
} from '@/lib/pharmacy-duplicate-copy'
import {
  toPharmacyDuplicateRowFromFormSource,
  toPharmacyDuplicateRowFromInput,
} from '@/view-models/pharmacy-duplicate-compare'
import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail'

type Props = {
  initialExistingId?: string
  pick?: boolean
  existing?: PharmacyDetailPayload | null
}

export function PharmacyDuplicateReviewClient({ initialExistingId, pick, existing }: Props) {
  const [existingId, setExistingId] = useState(initialExistingId)
  const { draft, onMerge, onIgnore, onCancel } = usePharmacyDuplicateReviewActions(existingId ?? '')
  const profileQuery = trpc.pharmacy.getById.useQuery(
    { id: existingId ?? '' },
    { enabled: Boolean(existingId) && !existing },
  )
  const profile = existing ?? profileQuery.data

  if (!draft) {
    return <p className="text-sm text-fg-muted">{PHARMACY_DUPLICATE_REVIEW_EXPIRED}</p>
  }

  if (pick && !existingId) {
    return <PharmacyDuplicatePicker matches={draft.matches} onSelect={setExistingId} />
  }

  if (!existingId || !profile) {
    return <p className="text-sm text-fg-muted">{PHARMACY_DUPLICATE_REVIEW_LOADING}</p>
  }

  return (
    <DuplicateDetectionPage
      left={toPharmacyDuplicateRowFromFormSource(profile.formSource)}
      right={toPharmacyDuplicateRowFromInput(draft.incoming)}
      fields={buildPharmacyDuplicateFields()}
      onMerge={onMerge}
      onIgnore={onIgnore}
      onCancel={onCancel}
    />
  )
}
