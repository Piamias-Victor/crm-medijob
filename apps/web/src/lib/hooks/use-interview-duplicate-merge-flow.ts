'use client'

import { useRouter } from 'next/navigation'
import type { UseFormReturn } from 'react-hook-form'
import { useCandidateCreateDuplicateAlert } from '@/lib/hooks/use-candidate-create-duplicate-alert'
import { saveDraftAndBuildDuplicateReviewPath } from '@/lib/candidate-duplicate-review-navigation'
import type { DuplicateProbe } from '@/lib/candidate-duplicate-probe'
import { toCandidateCreateInputFromInterviewStart } from '@/view-models/interview-duplicate-incoming'
import { interviewStartPath } from '@/view-models/interview-href'
import type { InterviewStartInput } from '@/view-models/interview-start.schema'

export function useInterviewDuplicateMergeFlow(
  form: UseFormReturn<InterviewStartInput>,
  probe: DuplicateProbe,
  enabled: boolean,
) {
  const router = useRouter()
  const duplicateAlert = useCandidateCreateDuplicateAlert(probe, {
    checkOnMount: enabled,
    enabled,
  })

  function goToMergeReview(existingId: string) {
    const data = form.getValues()
    const path = saveDraftAndBuildDuplicateReviewPath(
      {
        mode: 'interview',
        incoming: toCandidateCreateInputFromInterviewStart(data),
        interviewMode: data.mode,
        matches: duplicateAlert.alertProps.matches,
        returnPath: interviewStartPath(),
      },
      existingId,
    )
    router.push(path)
  }

  return {
    mergeAlertProps: {
      ...duplicateAlert.alertProps,
      variant: 'merge' as const,
      onMerge: goToMergeReview,
    },
    guardSubmit: duplicateAlert.guardSubmit,
  }
}
