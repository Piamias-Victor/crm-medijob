'use client'

import type { CandidateStatus } from '@prisma/client'
import { CandidateStatusBadge } from '@/components/molecules/CandidateStatusBadge'
import { SponsorshipSection } from '@/components/molecules/SponsorshipSection'

export function CandidateSponsorshipSection({ candidateId }: { candidateId: string }) {
  return (
    <SponsorshipSection
      kind="candidate"
      entityId={candidateId}
      hrefFor={(id) => `/candidats/${id}`}
      renderBadge={(status) => <CandidateStatusBadge status={status as CandidateStatus} />}
    />
  )
}
