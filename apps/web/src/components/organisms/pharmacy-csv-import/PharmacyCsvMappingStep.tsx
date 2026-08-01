'use client'

import { Button } from '@/components/atoms/Button'
import {
  PHARMACY_CSV_FIELD_LABELS,
  PHARMACY_CSV_FIELDS,
  type PharmacyCsvField,
} from '@/view-models/pharmacy-csv-fields'
import type { PharmacyCsvColumnMap } from '@/view-models/pharmacy-csv-import.schema'

type Props = {
  headers: string[]
  columnMap: PharmacyCsvColumnMap
  onChange: (field: keyof PharmacyCsvColumnMap, header: string) => void
  onBack: () => void
  onNext: () => void
}

export function PharmacyCsvMappingStep({ headers, columnMap, onChange, onBack, onNext }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">Associez chaque champ MediJob à une colonne du CSV.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PHARMACY_CSV_FIELDS.map((field: PharmacyCsvField) => (
          <label key={field} className="space-y-1 text-sm">
            <span className="font-medium text-fg">
              {PHARMACY_CSV_FIELD_LABELS[field]}
              {field === 'name' ? ' *' : ''}
            </span>
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2"
              value={columnMap[field] ?? ''}
              onChange={(event) => onChange(field, event.target.value)}
            >
              <option value="">{field === 'name' ? 'Choisir…' : '— Ignorer —'}</option>
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
        <Button type="button" variant="accent" onClick={onNext} disabled={!columnMap.name}>
          Prévisualiser
        </Button>
      </div>
    </div>
  )
}
