'use client'

import { Check, UserPlus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

type Props = {
  missionId: string
  candidateId: string
  score: number
  justification: string
  proposed: boolean
  onProposed: () => void
}

export function MissionMatchingProposeButton({
  missionId,
  candidateId,
  score,
  justification,
  proposed,
  onProposed,
}: Props) {
  const toast = useEntityMutation({
    onSuccess: onProposed,
    successMessage: 'Candidat proposé sur le besoin',
  })
  const propose = trpc.badakanProposal.propose.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })

  if (proposed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
        <Check className="size-3.5" aria-hidden />
        Proposé
      </span>
    )
  }

  return (
    <Button
      type="button"
      variant="accent"
      disabled={propose.isPending}
      onClick={(event) => {
        event.stopPropagation()
        propose.mutate({ missionId, candidateId, score, justification })
      }}
      className="w-full gap-1.5 px-3 py-2 text-xs font-semibold"
    >
      <UserPlus className="size-3.5" aria-hidden />
      {propose.isPending ? 'Ajout…' : 'Proposer'}
    </Button>
  )
}
