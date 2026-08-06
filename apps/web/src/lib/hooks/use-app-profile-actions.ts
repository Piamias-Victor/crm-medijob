'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

export function useAppProfileActions(initialItems: AppProfileListItem[]) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [items, setItems] = useState(initialItems)
  const [accepting, setAccepting] = useState<AppProfileListItem | null>(null)
  const [matches, setMatches] = useState<DuplicateMatch[]>([])
  const [pendingData, setPendingData] = useState<CandidateCreateInput | null>(null)

  const syncToast = useEntityMutation({
    successMessage: 'Synchronisation terminée',
    onSuccess: () => router.refresh(),
  })
  const ignoreToast = useEntityMutation({
    successMessage: 'Profil ignoré',
    onSuccess: () => router.refresh(),
  })
  const acceptToast = useEntityMutation({
    successMessage: 'Candidat créé',
    onSuccess: () => router.refresh(),
  })

  const sync = trpc.appProfile.sync.useMutation({
    onSuccess: async (result) => {
      syncToast.onSuccess()
      setItems(await utils.appProfile.listPending.fetch())
      return result
    },
    onError: syncToast.onError,
  })
  const ignore = trpc.appProfile.ignore.useMutation({
    onSuccess: (_data, vars) => {
      ignoreToast.onSuccess()
      setItems((prev) => prev.filter((row) => row.id !== vars.id))
    },
    onError: ignoreToast.onError,
  })
  const accept = trpc.appProfile.accept.useMutation({
    onSuccess: (_data, vars) => {
      acceptToast.onSuccess()
      setItems((prev) => prev.filter((row) => row.id !== vars.id))
      setAccepting(null)
      setPendingData(null)
      setMatches([])
    },
    onError: acceptToast.onError,
  })

  async function submitAccept(data: CandidateCreateInput) {
    if (!accepting) return
    const detected = await utils.candidate.detectDuplicate.fetch({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    })
    if (detected.length > 0) {
      setPendingData(data)
      setMatches(detected)
      return
    }
    accept.mutate({ id: accepting.id, data })
  }

  return {
    items,
    accepting,
    setAccepting,
    matches,
    setMatches,
    pendingData,
    sync,
    ignore,
    accept,
    submitAccept,
  }
}
