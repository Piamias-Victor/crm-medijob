'use client'

import { CandidateCvExtractionForm } from '@/components/organisms/candidate-cv-extraction/CandidateCvExtractionForm'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import type { RefItem } from '@/view-models/referential'

type Props = {
  previewUrl: string
  previewMimeType: string
  previewFilename: string
  extraction: CvExtraction
  suggestedJobTitles: RefItem[]
  defaultValues: CandidateProfileInput
  referentials: { jobTitles: RefItem[]; softwares: RefItem[]; recruiters: RefItem[] }
  submitting: boolean
  onCancel: () => void
  onConfirm: (data: CandidateProfileInput) => void
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
}

export function CandidateCvReviewForm(props: Props) {
  return (
    <CandidateCvExtractionForm
      mode="review"
      previewUrl={props.previewUrl}
      previewMimeType={props.previewMimeType}
      previewFilename={props.previewFilename}
      extraction={props.extraction}
      suggestedJobTitles={props.suggestedJobTitles}
      defaultValues={props.defaultValues}
      referentials={props.referentials}
      submitting={props.submitting}
      onCancel={props.onCancel}
      onSubmit={props.onConfirm}
      onCreateJobTitle={props.onCreateJobTitle}
    />
  )
}
