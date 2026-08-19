'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

export function useAppProfileActions(initialItems: AppProfileListItem[]) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [items, setItems] = useState(initialItems)
  const syncToast = useEntityMutation({
    successMessage: 'Synchronisation terminée',
    onSuccess: () => router.refresh(),
  })

  const sync = trpc.appProfile.sync.useMutation({
    onSuccess: async () => {
      syncToast.onSuccess()
      setItems(await utils.appProfile.listPending.fetch())
    },
    onError: syncToast.onError,
  })

  return { items, sync }
}
