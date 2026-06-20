'use client'

import { CandidateCvPreview } from '@/components/molecules/CandidateCvPreview'
import { candidateCvApiPath, inferCvFilename, inferCvMimeType } from '@/lib/candidate-cv-url'

type Props = {
  candidateId: string
  cvUrl: string
}

export function CandidateCvStoredPreview({ candidateId, cvUrl }: Props) {
  return (
    <CandidateCvPreview
      previewUrl={candidateCvApiPath(candidateId)}
      mimeType={inferCvMimeType(cvUrl)}
      filename={inferCvFilename(cvUrl)}
      size="stored"
    />
  )
}
