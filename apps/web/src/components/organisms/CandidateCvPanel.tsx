'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CandidateCvReviewForm } from '@/components/molecules/CandidateCvReviewForm'
import { CandidateCvActionsBar } from '@/components/molecules/CandidateCvActionsBar'
import { useCandidateCvReviewState } from '@/lib/hooks/use-candidate-cv-review-state'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { ANONYMIZED_REGENERATE_CONFIRM } from '@/lib/constants/anonymized-dossier'
import { candidateAnonymizedPdfPath } from '@/lib/candidate-anonymized-pdf-url'
import { trpc } from '@/lib/trpc/client'
import { hasStructuredAnonymizedDossier } from '@/view-models/anonymized-dossier'
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
  const router = useRouter()
  const [anonError, setAnonError] = useState<string>()
  const hasStructured = hasStructuredAnonymizedDossier(profile.anonymizedProfile)
  const toast = useEntityMutation({
    successMessage: 'Dossier anonymisé enregistré — téléchargement…',
    onSuccess: () => {
      router.refresh()
      window.open(candidateAnonymizedPdfPath(profile.id), '_blank', 'noopener,noreferrer')
    },
    onError: (error) => setAnonError(error.message),
  })
  const generateAnonymized = trpc.candidate.generateAnonymized.useMutation(toast)

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
        hasAnonymized={hasStructured}
        anonymizedPending={generateAnonymized.isPending}
        submitting={cv.extractPending}
        onFile={(file) => void cv.onUpload(file)}
        onGenerateAnonymized={() => {
          if (hasStructured && !window.confirm(ANONYMIZED_REGENERATE_CONFIRM)) return
          setAnonError(undefined)
          generateAnonymized.mutate({ id: profile.id })
        }}
        onPresentPharmacy={onPresentPharmacy}
        onPresentRadius={onPresentRadius}
      />
      {anonError ? <p className="text-sm text-error">{anonError}</p> : null}
      {cv.uploadError ? <p className="text-sm text-error">{cv.uploadError}</p> : null}
      {cv.extractError ? <p className="text-sm text-error">{cv.extractError.message}</p> : null}
    </div>
  )
}
