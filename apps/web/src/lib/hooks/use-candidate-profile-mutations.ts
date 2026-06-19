'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function useCandidateProfileMutations() {
  const router = useRouter()
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Profil enregistré',
  })
  const refMutation = useEntityMutation()

  return {
    update: trpc.candidate.update.useMutation(mutation),
    createJobTitle: trpc.mission.createJobTitle.useMutation(refMutation),
  }
}
