'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { useCreateJobTitleMutation } from '@/lib/hooks/use-create-job-title-mutation'

export function useMissionDetailMutations() {
  const router = useRouter()
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Mission enregistrée',
  })

  return {
    update: trpc.mission.update.useMutation(mutation),
    createJobTitle: useCreateJobTitleMutation(),
    onPharmacyChange: () => router.refresh(),
  }
}
