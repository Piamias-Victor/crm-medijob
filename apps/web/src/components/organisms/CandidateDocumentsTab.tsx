'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { CandidateDocumentsAiActions } from '@/components/molecules/CandidateDocumentsAiActions'
import { CandidateDocumentsEmptyState } from '@/components/molecules/CandidateMarkdownPreview'
import { AnonymizedDossierEditor } from '@/components/organisms/AnonymizedDossierEditor'
import { EntityDocumentsTab } from '@/components/molecules/EntityDocumentsTab'
import {
  ANONYMIZED_LEGACY_HINT,
  ANONYMIZED_REGENERATE_CONFIRM,
} from '@/lib/constants/anonymized-dossier'
import { hasStructuredAnonymizedDossier } from '@/view-models/anonymized-dossier'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { DocumentListRow } from '@/view-models/document-list'

type Props = {
  profile: CandidateProfilePayload
  documents: DocumentListRow[]
}

export function CandidateDocumentsTab({ profile, documents }: Props) {
  const router = useRouter()
  const [anonymizedError, setAnonymizedError] = useState<string>()
  const hasStructured = hasStructuredAnonymizedDossier(profile.anonymizedProfile)
  const legacyBlob = Boolean(profile.anonymizedProfile?.trim()) && !hasStructured
  const anonymizedMutation = useEntityMutation({
    successMessage: 'Dossier anonymisé enregistré',
    onSuccess: () => router.refresh(),
    onError: (error) => setAnonymizedError(error.message),
  })
  const generateAnonymized = trpc.candidate.generateAnonymized.useMutation(anonymizedMutation)

  const onGenerate = () => {
    if (hasStructured && !window.confirm(ANONYMIZED_REGENERATE_CONFIRM)) return
    setAnonymizedError(undefined)
    generateAnonymized.mutate({ id: profile.id })
  }

  return (
    <div className="flex flex-col gap-8">
      <CandidateDocumentsAiActions
        candidateId={profile.id}
        hasCv={Boolean(profile.cvUrl)}
        hasSummary={Boolean(profile.cvSummary?.trim())}
        hasAnonymized={hasStructured}
        anonymizedPending={generateAnonymized.isPending}
        anonymizedError={anonymizedError}
        onGenerateAnonymized={onGenerate}
      />
      {legacyBlob ? <p className="text-sm text-fg-muted">{ANONYMIZED_LEGACY_HINT}</p> : null}
      {!profile.cvUrl ? (
        <CandidateDocumentsEmptyState label="Aucun CV téléversé pour ce candidat." />
      ) : null}
      {hasStructured && profile.anonymizedProfile ? (
        <AnonymizedDossierEditor
          candidateId={profile.id}
          stored={profile.anonymizedProfile}
          onError={setAnonymizedError}
          onSaved={() => undefined}
        />
      ) : !legacyBlob ? (
        <p className="text-sm text-fg-muted">Aucun dossier anonymisé généré.</p>
      ) : null}
      <EntityDocumentsTab
        entityType="CANDIDATE"
        entityId={profile.id}
        documents={documents}
        emptyLabel="Aucun document additionnel."
      />
    </div>
  )
}
