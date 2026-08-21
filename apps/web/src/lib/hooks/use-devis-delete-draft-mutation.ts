'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DEVIS_DELETE_SUCCESS } from '@/view-models/devis-copy'

export function useDevisDeleteDraftMutation() {
  const router = useRouter()
  return trpc.devis.deleteDraft.useMutation(
    useEntityMutation({
      onSuccess: () => router.refresh(),
      successMessage: DEVIS_DELETE_SUCCESS,
    }),
  )
}
