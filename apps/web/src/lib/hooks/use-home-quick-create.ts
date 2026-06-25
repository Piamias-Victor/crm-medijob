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
  const [open, setOpen] = useState<HomeQuickCreateKind | null>(null)
  const queries = referentialQueriesFor(open)
  const missionRefs = trpc.mission.referentials.useQuery(undefined, { enabled: queries.mission })

  const refs = useMemo<HomeReferentials>(
    () => ({
      jobTitles: missionRefs.data?.jobTitles ?? EMPTY_REFS.jobTitles,
      recruiters: missionRefs.data?.recruiters ?? EMPTY_REFS.recruiters,
      pharmacies: missionRefs.data?.pharmacies ?? EMPTY_REFS.pharmacies,
      groupements: EMPTY_REFS.groupements,
      softwares: EMPTY_REFS.softwares,
    }),
    [missionRefs.data],
  )

  const refsLoading = queries.mission && missionRefs.isLoading

  const refresh = useCallback(() => {
    setOpen(null)
    router.refresh()
  }, [router])

  const missionMutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Mission créée' })
  const refMutation = useEntityMutation()

  const createMission = trpc.mission.create.useMutation(missionMutation)
  const newJobTitle = trpc.mission.createJobTitle.useMutation(refMutation)

  return {
    open,
    setOpen,
    refs,
    refsLoading,
    createMission,
    newJobTitle,
  }
}

export type HomeQuickCreateState = ReturnType<typeof useHomeQuickCreate>
