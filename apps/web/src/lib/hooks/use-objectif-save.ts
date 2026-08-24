'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { OBJECTIF_SAVE_TOAST } from '@/view-models/objectif'

export function useObjectifSave() {
  const router = useRouter()
  return trpc.admin.objectif.save.useMutation(
    useEntityMutation({
      successMessage: OBJECTIF_SAVE_TOAST,
      onSuccess: () => router.refresh(),
    }),
  )
}
