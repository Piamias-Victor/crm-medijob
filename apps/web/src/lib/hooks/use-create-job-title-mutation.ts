'use client'

import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export function useCreateJobTitleMutation(successMessage = 'Métier ajouté') {
  const refMutation = useEntityMutation({ successMessage })
  return trpc.mission.createJobTitle.useMutation(refMutation)
}
