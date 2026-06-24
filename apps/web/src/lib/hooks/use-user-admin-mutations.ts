'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function useUserAdminMutations(onClose: () => void, clearDelete: () => void) {
  const router = useRouter()
  const refresh = () => router.refresh()
  const mutation = useEntityMutation({ onSuccess: refresh })

  return {
    create: trpc.admin.user.create.useMutation({
      ...mutation,
      onSuccess: () => {
        onClose()
        mutation.onSuccess()
      },
    }),
    update: trpc.admin.user.update.useMutation({
      ...mutation,
      onSuccess: () => {
        onClose()
        mutation.onSuccess()
      },
    }),
    remove: trpc.admin.user.remove.useMutation({
      onSuccess: () => {
        clearDelete()
        refresh()
      },
    }),
  }
}
