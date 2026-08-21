'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DEVIS_SAVE_SUCCESS } from '@/view-models/devis-copy'

export function useDevisDraftMutation() {
  const router = useRouter()
  return trpc.devis.save.useMutation(
    useEntityMutation({
      onSuccess: () => router.refresh(),
      successMessage: DEVIS_SAVE_SUCCESS,
    }),
  )
}
