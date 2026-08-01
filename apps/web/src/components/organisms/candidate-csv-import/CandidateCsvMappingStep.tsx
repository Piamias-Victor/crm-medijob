'use client'

import { Button } from '@/components/atoms/Button'
import {
  CANDIDATE_CSV_FIELD_LABELS,
  CANDIDATE_CSV_FIELDS,
  CANDIDATE_CSV_REQUIRED_FIELDS,
  type CandidateCsvField,
} from '@/view-models/candidate-csv-fields'
import type { CandidateCsvColumnMap } from '@/view-models/candidate-csv-import.schema'

const REQUIRED = new Set<string>(CANDIDATE_CSV_REQUIRED_FIELDS)

type Props = {
  headers: string[]
  columnMap: CandidateCsvColumnMap
  onChange: (field: keyof CandidateCsvColumnMap, header: string) => void
  onBack: () => void
  onNext: () => void
}

export function CandidateCsvMappingStep({ headers, columnMap, onChange, onBack, onNext }: Props) {
  const canNext = Boolean(columnMap.firstName && columnMap.lastName && columnMap.jobTitle)
  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">Associez chaque champ MediJob à une colonne du CSV.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {CANDIDATE_CSV_FIELDS.map((field: CandidateCsvField) => (
          <label key={field} className="space-y-1 text-sm">
            <span className="font-medium text-fg">
              {CANDIDATE_CSV_FIELD_LABELS[field]}
              {REQUIRED.has(field) ? ' *' : ''}
            </span>
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2"
              value={columnMap[field] ?? ''}
              onChange={(event) => onChange(field, event.target.value)}
            >
              <option value="">{REQUIRED.has(field) ? 'Choisir…' : '— Ignorer —'}</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button type="button" variant="accent" onClick={onNext} disabled={!canNext}>
          Prévisualiser
        </Button>
      </div>
    </div>
  )
}
