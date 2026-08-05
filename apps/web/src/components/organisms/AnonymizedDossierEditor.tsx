'use client'

import { AnonymizedDossierPreview } from '@/components/molecules/AnonymizedDossierPreview'
import { AnonymizedDossierSectionField } from '@/components/molecules/AnonymizedDossierSectionField'
import { useAnonymizedDossierAutosave } from '@/lib/hooks/use-anonymized-dossier-autosave'
import { ANONYMIZED_DOSSIER_LABELS, ANONYMIZED_DOSSIER_KEYS } from '@/view-models/anonymized-dossier.labels'

type Props = {
  candidateId: string
  stored: string
  onError: (message: string) => void
  onSaved: () => void
}

export function AnonymizedDossierEditor({ candidateId, stored, onError, onSaved }: Props) {
  const { draft, setSection, flush, saving } = useAnonymizedDossierAutosave({
    candidateId,
    stored,
    onError,
    onSaved,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-fg">Édition du dossier</h3>
          {saving ? <span className="text-xs text-fg-muted">Enregistrement…</span> : null}
        </div>
        {ANONYMIZED_DOSSIER_KEYS.map((key) => (
          <AnonymizedDossierSectionField
            key={key}
            label={ANONYMIZED_DOSSIER_LABELS[key]}
            value={draft[key]}
            onChange={(value) => setSection(key, value)}
            onBlur={flush}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-fg">Aperçu</h3>
        <AnonymizedDossierPreview
          dossier={draft}
          emptyLabel="Renseignez au moins une section pour l’aperçu."
        />
      </div>
    </div>
  )
}
