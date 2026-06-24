'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { referentialQueriesFor } from '@/view-models/home-referential-queries'
import type { HomeQuickCreateKind, HomeReferentials } from '@/view-models/home-referentials'

const EMPTY_REFS: HomeReferentials = {
  jobTitles: [],
  recruiters: [],
  pharmacies: [],
  groupements: [],
  softwares: [],
}

export function useHomeQuickCreate() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [open, setOpen] = useState<HomeQuickCreateKind | null>(null)
  const queries = referentialQueriesFor(open)
  const missionRefs = trpc.mission.referentials.useQuery(undefined, { enabled: queries.mission })
  const pharmacyRefs = trpc.pharmacy.referentials.useQuery(undefined, { enabled: queries.pharmacy })

  const refs = useMemo<HomeReferentials>(
    () => ({
      jobTitles: missionRefs.data?.jobTitles ?? EMPTY_REFS.jobTitles,
      recruiters: missionRefs.data?.recruiters ?? EMPTY_REFS.recruiters,
      pharmacies: missionRefs.data?.pharmacies ?? EMPTY_REFS.pharmacies,
      groupements: pharmacyRefs.data?.groupements ?? EMPTY_REFS.groupements,
      softwares: pharmacyRefs.data?.softwares ?? EMPTY_REFS.softwares,
    }),
    [missionRefs.data, pharmacyRefs.data],
  )

  const refsLoading =
    (queries.mission && missionRefs.isLoading) || (queries.pharmacy && pharmacyRefs.isLoading)

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
    refsLoading,
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
