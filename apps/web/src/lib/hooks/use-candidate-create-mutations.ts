'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { useCreateJobTitleMutation } from '@/lib/hooks/use-create-job-title-mutation'

export function useCandidateCreateMutations() {
  const router = useRouter()
  const mutation = useEntityMutation({ successMessage: 'Candidat créé' })
  const create = trpc.candidate.create.useMutation({
    onSuccess: (result) => {
      mutation.onSuccess()
      router.push(`/candidats/${result.id}`)
    },
    onError: mutation.onError,
  })

  return {
    create,
    createJobTitle: useCreateJobTitleMutation(),
  }
}
