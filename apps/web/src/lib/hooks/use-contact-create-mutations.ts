'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function useContactCreateMutations() {
  const router = useRouter()
  const mutation = useEntityMutation({ successMessage: 'Contact créé' })
  const create = trpc.contact.create.useMutation({
    onSuccess: (result) => {
      mutation.onSuccess()
      router.push(`/contacts/${result.id}`)
    },
    onError: mutation.onError,
  })

  return { create }
}
