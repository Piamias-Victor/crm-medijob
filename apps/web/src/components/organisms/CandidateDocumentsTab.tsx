'use client'

import { useState } from 'react'
import { CandidateDocumentsAiActions } from '@/components/molecules/CandidateDocumentsAiActions'
import { CandidateDocumentsEmptyState } from '@/components/molecules/CandidateMarkdownPreview'
import { AnonymizedDossierModal } from '@/components/organisms/AnonymizedDossierModal'
import { EntityDocumentsTab } from '@/components/molecules/EntityDocumentsTab'
import { ANONYMIZED_LEGACY_HINT } from '@/lib/constants/anonymized-dossier'
import { useAnonymizedDossierModal } from '@/lib/hooks/use-anonymized-dossier-modal'
import { hasStructuredAnonymizedDossier } from '@/view-models/anonymized-dossier'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { DocumentListRow } from '@/view-models/document-list'

type Props = {
  profile: CandidateProfilePayload
  documents: DocumentListRow[]
}

export function CandidateDocumentsTab({ profile, documents }: Props) {
  const [error, setError] = useState<string>()
  const hasStructured = hasStructuredAnonymizedDossier(profile.anonymizedProfile)
  const legacyBlob = Boolean(profile.anonymizedProfile?.trim()) && !hasStructured
  const flow = useAnonymizedDossierModal({
    candidateId: profile.id,
    stored: profile.anonymizedProfile,
  })

  return (
    <div className="flex flex-col gap-8">
      <CandidateDocumentsAiActions
        candidateId={profile.id}
        hasCv={Boolean(profile.cvUrl)}
        hasAnonymized={hasStructured}
        anonymizedPending={flow.generating}
        anonymizedError={error ?? flow.error}
        onGenerateAnonymized={() => {
          setError(undefined)
          flow.openModal()
        }}
      />
      {legacyBlob ? <p className="text-sm text-fg-muted">{ANONYMIZED_LEGACY_HINT}</p> : null}
      {!profile.cvUrl ? (
        <CandidateDocumentsEmptyState label="Aucun CV téléversé pour ce candidat." />
      ) : null}
      <AnonymizedDossierModal flow={flow} />
      <EntityDocumentsTab
        entityType="CANDIDATE"
        entityId={profile.id}
        documents={documents}
        emptyLabel="Aucun document additionnel."
      />
    </div>
  )
}
