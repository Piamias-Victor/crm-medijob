'use client'

import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { MissionMatchingPipelineAction } from '@/components/molecules/MissionMatchingPipelineAction'

type Props = {
  missionId: string
  candidateId: string
  positioned: boolean
  disabled?: boolean
  onPositioned: () => void
}

export function MissionMatchingPipelineButton({
  missionId,
  candidateId,
  positioned,
  disabled,
  onPositioned,
}: Props) {
  const toast = useEntityMutation({
    onSuccess: onPositioned,
    successMessage: 'Candidat ajouté au pipeline (Nouveau)',
  })
  const position = trpc.missionCandidate.position.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })

  return (
    <MissionMatchingPipelineAction
      positioned={positioned}
      pending={position.isPending}
      disabled={disabled}
      onAdd={() => position.mutate({ missionId, candidateId })}
    />
  )
}
