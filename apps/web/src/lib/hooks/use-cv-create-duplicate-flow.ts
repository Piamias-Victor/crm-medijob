'use client'

import type { UseFormReturn } from 'react-hook-form'
import { useCandidateDuplicateMergeFlow } from '@/lib/hooks/use-candidate-duplicate-merge-flow'
import type { DuplicateProbe } from '@/lib/candidate-duplicate-probe'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'

type Options = {
  cvUrl?: string
  enabled?: boolean
}

export function useCvCreateDuplicateFlow(
  form: UseFormReturn<CandidateCreateInput>,
  probe: DuplicateProbe,
  options: Options = {},
) {
  return useCandidateDuplicateMergeFlow(form, probe, {
    mode: 'cv',
    returnPath: '/candidats/new?source=cv',
    cvUrl: options.cvUrl,
    enabled: options.enabled,
  })
}
