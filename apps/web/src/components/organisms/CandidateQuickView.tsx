'use client'

import { QuickViewPanel } from '@/components/molecules/quick-view-panel/quick-view-panel'
import { CandidateQuickViewContent } from '@/components/molecules/candidate-quick-view/candidate-quick-view-content'
import { CANDIDATE_QUICK_VIEW_LOADING } from '@/components/molecules/candidate-quick-view/candidate-quick-view-copy'
import { cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import { trpc } from '@/lib/trpc/client'

type Props = {
  candidateId: string | null
  returnPath: string
  onClose: () => void
}

export function CandidateQuickView({ candidateId, returnPath, onClose }: Props) {
  const query = trpc.candidate.quickView.useQuery(
    { id: candidateId ?? '' },
    { enabled: Boolean(candidateId) },
  )
  const view = query.data
  const title = view?.fullName ?? CANDIDATE_QUICK_VIEW_LOADING

  return (
    <QuickViewPanel
      open={Boolean(candidateId)}
      onClose={onClose}
      title={title}
      footerHref={candidateId ? cvthequeCandidateHref(candidateId, returnPath) : '#'}
    >
      {view ? (
        <CandidateQuickViewContent view={view} />
      ) : (
        <p className="text-sm text-muted">{CANDIDATE_QUICK_VIEW_LOADING}</p>
      )}
    </QuickViewPanel>
  )
}
