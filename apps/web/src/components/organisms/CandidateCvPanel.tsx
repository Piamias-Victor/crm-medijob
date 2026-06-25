'use client'

import { CandidateCvReviewForm } from '@/components/molecules/CandidateCvReviewForm'
import { CandidateCvActionsBar } from '@/components/molecules/CandidateCvActionsBar'
import { useCandidateCvReviewState } from '@/lib/hooks/use-candidate-cv-review-state'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { RefItem } from '@/view-models/referential'

type Referentials = {
  jobTitles: RefItem[]
  softwares: RefItem[]
  recruiters: RefItem[]
}

type Props = {
  profile: CandidateProfilePayload
  referentials: Referentials
  onPresentPharmacy?: () => void
  onPresentRadius?: () => void
}

export function CandidateCvPanel({ profile, referentials, onPresentPharmacy, onPresentRadius }: Props) {
  const cv = useCandidateCvReviewState(profile, referentials)

  if (cv.review && cv.reviewDefaults && cv.preview) {
    return (
      <CandidateCvReviewForm
        previewUrl={cv.preview.url}
        previewMimeType={cv.preview.mimeType}
        previewFilename={cv.preview.filename}
        extraction={cv.review.extraction}
        suggestedJobTitles={cv.review.suggestedJobTitles}
        defaultValues={cv.reviewDefaults}
        referentials={referentials}
        submitting={cv.confirmPending}
        onCancel={cv.clearReview}
        onConfirm={cv.confirmReview}
        onCreateJobTitle={async (name) => {
          const created = await cv.createJobTitle.mutateAsync({ name })
          return { value: created.id, label: created.name }
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 pb-6">
      <CandidateCvActionsBar
        candidateId={profile.id}
        hasCv={Boolean(profile.cvUrl)}
        submitting={cv.extractPending}
        onFile={(file) => void cv.onUpload(file)}
        onPresentPharmacy={onPresentPharmacy}
        onPresentRadius={onPresentRadius}
      />
      {cv.uploadError ? <p className="text-sm text-error">{cv.uploadError}</p> : null}
      {cv.extractError ? <p className="text-sm text-error">{cv.extractError.message}</p> : null}
    </div>
  )
}
