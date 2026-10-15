'use client'

import { trpc } from '@/lib/trpc/client'
import { CandidateInterviewsTab } from '@/components/organisms/CandidateInterviewsTab'

type Props = { candidateId: string }

export function CandidateInterviewsTabContainer({ candidateId }: Props) {
  const interviews = trpc.interview.listByCandidate.useQuery({ candidateId })
  const docs = trpc.document.listByEntity.useQuery({
    entityType: 'CANDIDATE',
    entityId: candidateId,
  })

  if (interviews.isLoading || docs.isLoading) {
    return <p className="text-sm text-fg-muted">Chargement…</p>
  }

  return (
    <CandidateInterviewsTab
      candidateId={candidateId}
      interviews={interviews.data ?? []}
      documents={docs.data ?? []}
    />
  )
}
