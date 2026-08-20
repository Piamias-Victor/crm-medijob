'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DEVIS_ACCEPT_SUCCESS } from '@/view-models/devis-copy'

export function useDevisAcceptMutation() {
  const router = useRouter()
  return trpc.devis.accept.useMutation(
    useEntityMutation({
      successMessage: DEVIS_ACCEPT_SUCCESS,
      onSuccess: () => router.refresh(),
    }),
  )
}
