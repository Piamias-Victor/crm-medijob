'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCandidateCvMutations } from '@/lib/hooks/use-candidate-cv-mutations'
import { cvUploadError } from '@/lib/cv-upload'
import { fileToBase64 } from '@/lib/cv-upload-file'
import { buildCvReviewFormValues } from '@/view-models/cv-extraction-review'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { RefItem } from '@/view-models/referential'

type Referentials = {
  jobTitles: RefItem[]
  softwares: RefItem[]
  recruiters: RefItem[]
}

type PreviewState = { url: string; mimeType: string; filename: string }
type ReviewState = { cvUrl: string; extraction: CvExtraction; suggestedJobTitles: RefItem[] }

export function useCandidateCvReviewState(profile: CandidateProfilePayload, referentials: Referentials) {
  const { extract, confirm, createJobTitle } = useCandidateCvMutations(profile.id)
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [review, setReview] = useState<ReviewState | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url)
    }
  }, [preview?.url])

  const reviewDefaults = useMemo(
    () => (review ? buildCvReviewFormValues(review.extraction, profile, referentials) : null),
    [profile, referentials, review],
  )

  const clearReview = () => {
    setReview(null)
    if (preview?.url) URL.revokeObjectURL(preview.url)
    setPreview(null)
  }

  const onUpload = async (file: File) => {
    setUploadError(null)
    const mimeType = file.type || 'application/octet-stream'
    const validationError = cvUploadError({ filename: file.name, mimeType })
    if (validationError) return setUploadError(validationError)

    if (preview?.url) URL.revokeObjectURL(preview.url)
    setPreview({ url: URL.createObjectURL(file), mimeType, filename: file.name })

    const result = await extract.mutateAsync({
      candidateId: profile.id,
      filename: file.name,
      mimeType,
      size: file.size,
      dataBase64: await fileToBase64(file),
    })
    setReview({
      cvUrl: result.cvUrl,
      extraction: result.extraction,
      suggestedJobTitles: result.suggestedJobTitles,
    })
  }

  return {
    preview,
    review,
    reviewDefaults,
    uploadError,
    extractPending: extract.isPending,
    confirmPending: confirm.isPending,
    extractError: extract.error,
    onUpload,
    clearReview,
    confirmReview: async (data: Parameters<typeof confirm.mutate>[0]['data']) => {
      if (!review) return
      await confirm.mutateAsync({ candidateId: profile.id, cvUrl: review.cvUrl, data })
      clearReview()
    },
    createJobTitle,
  }
}
