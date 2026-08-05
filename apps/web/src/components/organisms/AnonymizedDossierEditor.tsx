'use client'

import { AnonymizedDossierPreview } from '@/components/molecules/AnonymizedDossierPreview'
import { AnonymizedDossierSectionField } from '@/components/molecules/AnonymizedDossierSectionField'
import { useAnonymizedDossierAutosave } from '@/lib/hooks/use-anonymized-dossier-autosave'
import {
  ANONYMIZED_DOSSIER_KEYS,
  ANONYMIZED_DOSSIER_LABELS,
} from '@/view-models/anonymized-dossier.labels'

type Props = {
  candidateId: string
  stored: string | null | undefined
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
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-fg">Dossier anonymisé</h3>
            <p className="mt-0.5 text-sm text-fg-muted">
              Édition libre — enregistrement automatique.
            </p>
          </div>
          <span className="text-xs text-fg-muted" aria-live="polite">
            {saving ? 'Enregistrement…' : 'À jour'}
          </span>
        </div>
        <div className="flex flex-col gap-7">
          {ANONYMIZED_DOSSIER_KEYS.map((key, index) => (
            <AnonymizedDossierSectionField
              key={key}
              index={index + 1}
              label={ANONYMIZED_DOSSIER_LABELS[key]}
              value={draft[key]}
              onChange={(value) => setSection(key, value)}
              onBlur={flush}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-fg">Aperçu client / PDF</h3>
        <AnonymizedDossierPreview
          dossier={draft}
          emptyLabel="Les sections renseignées apparaîtront ici (et dans le PDF)."
        />
      </div>
    </div>
  )
}
