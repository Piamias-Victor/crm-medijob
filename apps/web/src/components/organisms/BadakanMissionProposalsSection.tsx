'use client'

import { BadakanProposalRow } from '@/components/molecules/BadakanProposalRow'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

type Props = { missionId: string }

export function BadakanMissionProposalsSection({ missionId }: Props) {
  const utils = trpc.useUtils()
  const list = trpc.badakanProposal.listByMission.useQuery({ missionId })
  const invalidate = () => {
    void utils.badakanProposal.listByMission.invalidate({ missionId })
    void utils.badakanMission.getById.invalidate({ id: missionId })
    void utils.badakanMission.listNeeds.invalidate()
    void utils.badakanMission.suivi.invalidate()
    void utils.weeklyAvailability.search.invalidate()
  }
  const toast = useEntityMutation({
    onSuccess: invalidate,
    successMessage: 'Statut mis à jour',
  })
  const removeToast = useEntityMutation({
    onSuccess: invalidate,
    successMessage: 'Proposition supprimée',
  })
  const setStatus = trpc.badakanProposal.setStatus.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })
  const remove = trpc.badakanProposal.remove.useMutation({
    onSuccess: removeToast.onSuccess,
    onError: removeToast.onError,
  })

  const rows = list.data ?? []
  if (list.isLoading) return <p className="text-sm text-fg-muted">Chargement…</p>
  if (rows.length === 0) {
    return <p className="text-sm text-fg-muted">Aucun candidat proposé pour l’instant.</p>
  }

  const pending = setStatus.isPending || remove.isPending
  return (
    <ul className="divide-y divide-border/60">
      {rows.map((row) => (
        <BadakanProposalRow
          key={row.id}
          row={row}
          pending={pending}
          onStatus={(status) =>
            setStatus.mutate({ missionId, candidateId: row.candidateId, status })
          }
          onRemove={() => remove.mutate({ missionId, candidateId: row.candidateId })}
        />
      ))}
    </ul>
  )
}
