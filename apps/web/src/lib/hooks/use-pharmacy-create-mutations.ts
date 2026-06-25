'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function usePharmacyCreateMutations() {
  const router = useRouter()
  const mutation = useEntityMutation({ successMessage: 'Pharmacie créée' })
  const create = trpc.pharmacy.create.useMutation({
    onSuccess: (result) => {
      mutation.onSuccess()
      router.push(`/pharmacies/${result.id}`)
    },
    onError: mutation.onError,
  })
  const refMutation = useEntityMutation()

  return {
    create,
    createGroupement: trpc.pharmacy.createGroupement.useMutation(refMutation),
    createSoftware: trpc.pharmacy.createSoftware.useMutation(refMutation),
  }
}
