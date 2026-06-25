'use client'

import { useCandidateProfileMutations } from '@/lib/hooks/use-candidate-profile-mutations'
import { useCandidateDuplicateGuard } from '@/lib/hooks/use-candidate-duplicate-guard'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

export function useCandidateProfileSubmit(candidateId: string) {
  const { update } = useCandidateProfileMutations()
  const guardDuplicate = useCandidateDuplicateGuard()

  return async (data: CandidateProfileInput) => {
    const blocked = await guardDuplicate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        excludeId: candidateId,
      },
      data,
      { mode: 'edit', returnPath: `/candidats/${candidateId}`, absorbedId: candidateId },
    )
    if (!blocked) update.mutate({ id: candidateId, data })
  }
}
