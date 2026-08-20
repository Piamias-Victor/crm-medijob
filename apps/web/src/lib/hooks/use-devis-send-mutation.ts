'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DEVIS_SEND_SUCCESS } from '@/view-models/devis-copy'

export function useDevisSendMutation() {
  const router = useRouter()
  return trpc.devis.send.useMutation(
    useEntityMutation({
      successMessage: DEVIS_SEND_SUCCESS,
      onSuccess: () => router.refresh(),
    }),
  )
}
