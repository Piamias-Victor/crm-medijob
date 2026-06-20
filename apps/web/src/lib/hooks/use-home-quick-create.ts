'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { HomeQuickCreateKind, HomeReferentials } from '@/view-models/home-referentials'

export function useHomeQuickCreate(refs: HomeReferentials) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [open, setOpen] = useState<HomeQuickCreateKind | null>(null)

  const refresh = useCallback(() => {
    setOpen(null)
    router.refresh()
  }, [router])

  const candidateMutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Candidat créé' })
  const missionMutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Mission créée' })
  const pharmacyMutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Pharmacie créée' })
  const contactMutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Contact créé' })
  const refMutation = useEntityMutation()

  const createCandidate = trpc.candidate.create.useMutation(candidateMutation)
  const createMission = trpc.mission.create.useMutation(missionMutation)
  const createPharmacy = trpc.pharmacy.create.useMutation(pharmacyMutation)
  const createContact = trpc.contact.create.useMutation(contactMutation)
  const newGroupement = trpc.pharmacy.createGroupement.useMutation(refMutation)
  const newSoftware = trpc.pharmacy.createSoftware.useMutation(refMutation)
  const newJobTitle = trpc.mission.createJobTitle.useMutation(refMutation)

  return {
    open,
    setOpen,
    refs,
    createCandidate,
    createMission,
    createPharmacy,
    createContact,
    newGroupement,
    newSoftware,
    newJobTitle,
    searchSiret: (query: string) => utils.pharmacy.searchSiret.fetch({ query }),
  }
}

export type HomeQuickCreateState = ReturnType<typeof useHomeQuickCreate>
