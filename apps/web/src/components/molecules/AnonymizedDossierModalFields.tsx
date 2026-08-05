'use client'

import { AnonymizedDossierSectionField } from '@/components/molecules/AnonymizedDossierSectionField'
import {
  ANONYMIZED_DOSSIER_KEYS,
  ANONYMIZED_DOSSIER_LABELS,
} from '@/view-models/anonymized-dossier.labels'
import type { AnonymizedDossier } from '@/view-models/anonymized-dossier'

const WIDE_KEYS = new Set<keyof AnonymizedDossier>(['accroche', 'pointsForts'])

type Props = {
  draft: AnonymizedDossier
  onChange: (key: keyof AnonymizedDossier, value: string) => void
}

export function AnonymizedDossierModalFields({ draft, onChange }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {ANONYMIZED_DOSSIER_KEYS.map((key, index) => (
        <div key={key} className={WIDE_KEYS.has(key) ? 'sm:col-span-2' : undefined}>
          <AnonymizedDossierSectionField
            index={index + 1}
            label={ANONYMIZED_DOSSIER_LABELS[key]}
            value={draft[key]}
            onChange={(value) => onChange(key, value)}
          />
        </div>
      ))}
    </div>
  )
}
