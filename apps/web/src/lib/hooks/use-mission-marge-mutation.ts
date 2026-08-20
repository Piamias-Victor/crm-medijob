'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { MARGE_SAVE_SUCCESS } from '@/view-models/devis-copy'

export function useMissionMargeMutation() {
  const router = useRouter()
  return trpc.mission.updateMarge.useMutation(
    useEntityMutation({
      onSuccess: () => router.refresh(),
      successMessage: MARGE_SAVE_SUCCESS,
    }),
  )
}
