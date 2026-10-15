'use client'

import { trpc } from '@/lib/trpc/client'
import { CandidateDocumentsTab } from '@/components/organisms/CandidateDocumentsTab'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'

type Props = { profile: CandidateProfilePayload }

export function CandidateDocumentsTabContainer({ profile }: Props) {
  const docs = trpc.document.listByEntity.useQuery({
    entityType: 'CANDIDATE',
    entityId: profile.id,
  })

  if (docs.isLoading) {
    return <p className="text-sm text-fg-muted">Chargement…</p>
  }

  return <CandidateDocumentsTab profile={profile} documents={docs.data ?? []} />
}
