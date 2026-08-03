'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { CandidateDocumentsAiActions } from '@/components/molecules/CandidateDocumentsAiActions'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'

type Props = { profile: CandidateProfilePayload }

export function CandidateProfileDocsShortcuts({ profile }: Props) {
  const router = useRouter()
  const [anonymizedError, setAnonymizedError] = useState<string>()
  const toast = useEntityMutation({
    successMessage: 'Dossier anonymisé enregistré',
    onSuccess: () => router.refresh(),
    onError: (error) => setAnonymizedError(error.message),
  })
  const generateAnonymized = trpc.candidate.generateAnonymized.useMutation(toast)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-fg-muted">
        CV / anonymisation aussi dans l’onglet Documents. Statut Blacklisté = liste déroulante Statut du
        profil.
      </p>
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
    </div>
  )
}
