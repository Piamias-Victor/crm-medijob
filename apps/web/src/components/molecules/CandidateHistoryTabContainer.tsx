'use client'

import { trpc } from '@/lib/trpc/client'
import { CandidateHistoryTab } from '@/components/molecules/CandidateHistoryTab'
import type { CandidateHistoryPositioning } from '@/view-models/candidate-history.types'

type Props = {
  candidateId: string
  positionings: CandidateHistoryPositioning[]
}

export function CandidateHistoryTabContainer({ candidateId, positionings }: Props) {
  const logs = trpc.activityLog.listByEntity.useQuery({
    entityType: 'CANDIDATE',
    entityId: candidateId,
  })
  const comments = trpc.candidate.listComments.useQuery({ id: candidateId })

  if (logs.isLoading || comments.isLoading) {
    return <p className="text-sm text-fg-muted">Chargement…</p>
  }

  return (
    <CandidateHistoryTab
      scope={{ entityType: 'CANDIDATE', entityId: candidateId }}
      initialLogs={logs.data ?? []}
      positionings={positionings}
      comments={comments.data ?? []}
    />
  )
}
