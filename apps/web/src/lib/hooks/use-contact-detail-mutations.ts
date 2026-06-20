'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function useContactDetailMutations() {
  const router = useRouter()
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Contact enregistré',
  })
  const primaryMutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Contact principal mis à jour',
  })

  return {
    update: trpc.contact.update.useMutation(mutation),
    setPrimary: trpc.contact.setPrimary.useMutation(primaryMutation),
  }
}
