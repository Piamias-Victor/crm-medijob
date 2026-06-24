'use client'

import { useRouter } from 'next/navigation'
import type { UseFormReturn } from 'react-hook-form'
import { saveDraftAndBuildDuplicateReviewPath } from '@/lib/candidate-duplicate-review-navigation'
import type { CandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'

type Options = {
  mode: Extract<CandidateDuplicateDraft['mode'], 'create' | 'cv'>
  returnPath: string
  cvUrl?: string
}

export function useCandidateDuplicateMergeNavigation(
  form: UseFormReturn<CandidateCreateInput>,
  matches: DuplicateMatch[],
  options: Options,
) {
  const router = useRouter()

  return function goToMergeReview(existingId: string) {
    const path = saveDraftAndBuildDuplicateReviewPath(
      {
        mode: options.mode,
        incoming: form.getValues(),
        matches,
        returnPath: options.returnPath,
        cvUrl: options.cvUrl,
      },
      existingId,
    )
    router.push(path)
  }
}
