'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { DUPLICATE_PROBE_ERROR } from '@/lib/candidate-duplicate-copy'
import { saveCandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import { buildDuplicateReviewPath } from '@/lib/candidate-duplicate-review-navigation'
import type { DetectDuplicateInput } from '@/view-models/candidate-duplicate.schema'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

type EditGuardOptions = {
  mode: 'edit'
  returnPath: string
  absorbedId: string
  cvUrl?: string
}

export function useCandidateDuplicateGuard() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)

  return async function guard(
    probe: DetectDuplicateInput,
    incoming: CandidateProfileInput,
    options: EditGuardOptions,
  ) {
    try {
      const matches = await utils.candidate.detectDuplicate.fetch(probe)
      if (!matches.length) return false

      saveCandidateDuplicateDraft({
        mode: 'edit',
        incoming,
        matches,
        returnPath: options.returnPath,
        absorbedId: options.absorbedId,
        cvUrl: options.cvUrl,
      })

      router.push(buildDuplicateReviewPath(matches))
      return true
    } catch {
      push({ variant: 'error', message: DUPLICATE_PROBE_ERROR })
      return false
    }
  }
}
