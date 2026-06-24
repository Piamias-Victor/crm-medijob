'use client'

import type { UseFormReturn } from 'react-hook-form'
import { useCandidateCreateDuplicateAlert } from '@/lib/hooks/use-candidate-create-duplicate-alert'
import { useCandidateDuplicateMergeNavigation } from '@/lib/hooks/use-candidate-duplicate-merge-navigation'
import type { DuplicateProbe } from '@/lib/candidate-duplicate-probe'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'

type Options = {
  mode: 'create' | 'cv'
  returnPath: string
  cvUrl?: string
  checkOnMount?: boolean
  enabled?: boolean
}

export function useCandidateDuplicateMergeFlow(
  form: UseFormReturn<CandidateCreateInput>,
  probe: DuplicateProbe,
  options: Options,
) {
  const enabled = options.enabled ?? true
  const duplicateAlert = useCandidateCreateDuplicateAlert(probe, {
    checkOnMount: options.checkOnMount ?? enabled,
    enabled,
  })
  const goToMergeReview = useCandidateDuplicateMergeNavigation(form, duplicateAlert.alertProps.matches, {
    mode: options.mode,
    returnPath: options.returnPath,
    cvUrl: options.cvUrl,
  })

  return {
    mergeAlertProps: {
      ...duplicateAlert.alertProps,
      variant: options.mode === 'cv' ? ('merge-cv' as const) : ('merge' as const),
      onMerge: goToMergeReview,
    },
    guardSubmit: duplicateAlert.guardSubmit,
  }
}
