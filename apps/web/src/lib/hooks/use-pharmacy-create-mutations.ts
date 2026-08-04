'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { usePharmacyCreateDuplicateGuard } from '@/lib/hooks/use-pharmacy-create-duplicate-guard'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

const SIRET_DUP = 'Une pharmacie avec ce SIRET existe déjà.'

export function usePharmacyCreateMutations() {
  const router = useRouter()
  const guardDuplicate = usePharmacyCreateDuplicateGuard()
  const mutation = useEntityMutation({ successMessage: 'Pharmacie créée' })
  const create = trpc.pharmacy.create.useMutation({
    onSuccess: (result) => {
      mutation.onSuccess()
      router.push(`/pharmacies/${result.id}`)
    },
    onError: async (error, variables) => {
      if (error.message.includes('SIRET') && variables) {
        const blocked = await guardDuplicate(variables as PharmacyInput)
        if (blocked) return
      }
      mutation.onError(error)
    },
  })
  const refMutation = useEntityMutation()

  return {
    create,
    createGroupement: trpc.pharmacy.createGroupement.useMutation(refMutation),
    createSoftware: trpc.pharmacy.createSoftware.useMutation(refMutation),
  }
}

export { SIRET_DUP }
