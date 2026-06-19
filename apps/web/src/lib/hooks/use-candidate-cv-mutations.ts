'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function useCandidateCvMutations(candidateId: string) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const extractMutation = useEntityMutation({ successMessage: 'CV analysé — revue requise' })
  const confirmMutation = useEntityMutation({
    onSuccess: async () => {
      await utils.candidate.getById.invalidate({ id: candidateId })
      router.refresh()
    },
    successMessage: 'Profil mis à jour depuis le CV',
  })
  const refMutation = useEntityMutation()

  return {
    extract: trpc.candidate.extractCv.useMutation(extractMutation),
    confirm: trpc.candidate.confirmExtraction.useMutation(confirmMutation),
    createJobTitle: trpc.mission.createJobTitle.useMutation(refMutation),
    candidateId,
  }
}
