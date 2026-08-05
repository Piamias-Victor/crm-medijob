'use client'

import { AnonymizedDossierSectionField } from '@/components/molecules/AnonymizedDossierSectionField'
import {
  ANONYMIZED_DOSSIER_KEYS,
  ANONYMIZED_DOSSIER_LABELS,
} from '@/view-models/anonymized-dossier.labels'
import type { AnonymizedDossier } from '@/view-models/anonymized-dossier'

type Props = {
  draft: AnonymizedDossier
  onChange: (key: keyof AnonymizedDossier, value: string) => void
}

export function AnonymizedDossierModalFields({ draft, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {ANONYMIZED_DOSSIER_KEYS.map((key, index) => (
        <AnonymizedDossierSectionField
          key={key}
          index={index + 1}
          label={ANONYMIZED_DOSSIER_LABELS[key]}
          value={draft[key]}
          onChange={(value) => onChange(key, value)}
        />
      ))}
    </div>
  )
}
