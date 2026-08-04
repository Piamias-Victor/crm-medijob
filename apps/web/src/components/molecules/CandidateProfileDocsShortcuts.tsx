'use client'

import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'

type Props = { profile: CandidateProfilePayload }

/** Hint only — actions live next to Voir le CV / Présenter. */
export function CandidateProfileDocsShortcuts({ profile }: Props) {
  const hasSummary = Boolean(profile.cvSummary?.trim())
  return (
    <p className="text-sm text-fg-muted">
      {hasSummary
        ? 'Dossier anonymisé : bouton à côté de Voir le CV / Présenter (barre profil).'
        : 'Génère d’abord le résumé IA pour activer le dossier anonymisé.'}{' '}
      Statut Blacklisté = liste déroulante Statut du profil.
    </p>
  )
}
