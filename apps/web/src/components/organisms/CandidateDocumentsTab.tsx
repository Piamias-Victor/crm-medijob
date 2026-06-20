'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { CandidateDocumentsAiActions } from '@/components/molecules/CandidateDocumentsAiActions'
import {
  CandidateDocumentsEmptyState,
  CandidateMarkdownPreview,
} from '@/components/molecules/CandidateMarkdownPreview'
import { EntityDocumentsTab } from '@/components/molecules/EntityDocumentsTab'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { DocumentListRow } from '@/view-models/document-list'

type Props = {
  profile: CandidateProfilePayload
  documents: DocumentListRow[]
}

export function CandidateDocumentsTab({ profile, documents }: Props) {
  const router = useRouter()
  const [anonymizedError, setAnonymizedError] = useState<string>()
  const anonymizedMutation = useEntityMutation({
    successMessage: 'Dossier anonymisé enregistré',
    onSuccess: () => router.refresh(),
    onError: (error) => setAnonymizedError(error.message),
  })
  const generateAnonymized = trpc.candidate.generateAnonymized.useMutation(anonymizedMutation)

  return (
    <div className="flex flex-col gap-8">
      <CandidateDocumentsAiActions
        candidateId={profile.id}
        hasCv={Boolean(profile.cvUrl)}
        hasSummary={Boolean(profile.cvSummary?.trim())}
        hasAnonymized={Boolean(profile.anonymizedProfile?.trim())}
        anonymizedPending={generateAnonymized.isPending}
        anonymizedError={anonymizedError}
        onGenerateAnonymized={() => {
          setAnonymizedError(undefined)
          generateAnonymized.mutate({ id: profile.id })
        }}
      />
      {!profile.cvUrl ? (
        <CandidateDocumentsEmptyState label="Aucun CV téléversé pour ce candidat." />
      ) : null}
      <CandidateMarkdownPreview
        title="Dossier anonymisé"
        content={profile.anonymizedProfile}
        emptyLabel="Aucun dossier anonymisé généré."
      />
      <EntityDocumentsTab
        entityType="CANDIDATE"
        entityId={profile.id}
        documents={documents}
        emptyLabel="Aucun document additionnel."
      />
    </div>
  )
}
