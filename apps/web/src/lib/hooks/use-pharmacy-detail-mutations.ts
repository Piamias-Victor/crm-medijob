'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function usePharmacyDetailMutations() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Pharmacie enregistrée',
  })
  const missionMutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Mission créée',
  })
  const refMutation = useEntityMutation()

  return {
    update: trpc.pharmacy.update.useMutation(mutation),
    createMission: trpc.mission.create.useMutation(missionMutation),
    createJobTitle: trpc.mission.createJobTitle.useMutation(refMutation),
    newGroupement: trpc.pharmacy.createGroupement.useMutation(refMutation),
    newSoftware: trpc.pharmacy.createSoftware.useMutation(refMutation),
    searchSiret: (query: string) => utils.pharmacy.searchSiret.fetch({ query }),
  }
}
