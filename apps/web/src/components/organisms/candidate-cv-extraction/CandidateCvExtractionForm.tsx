'use client'

import type { CandidateCvExtractionFormProps } from '@/components/organisms/candidate-cv-extraction/candidate-cv-extraction-form.types'
import { CandidateCvExtractionCreateForm } from '@/components/organisms/candidate-cv-extraction/CandidateCvExtractionCreateForm'
import { CandidateCvExtractionReviewForm } from '@/components/organisms/candidate-cv-extraction/CandidateCvExtractionReviewForm'

export function CandidateCvExtractionForm(props: CandidateCvExtractionFormProps) {
  if (props.mode === 'create') {
    return <CandidateCvExtractionCreateForm {...props} />
  }
  return <CandidateCvExtractionReviewForm {...props} />
}
