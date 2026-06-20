'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { useCreateJobTitleMutation } from '@/lib/hooks/use-create-job-title-mutation'

export function useCandidateProfileMutations() {
  const router = useRouter()
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Profil enregistré',
  })

  return {
    update: trpc.candidate.update.useMutation(mutation),
    createJobTitle: useCreateJobTitleMutation(),
  }
}
