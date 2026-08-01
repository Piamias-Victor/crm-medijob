import type { DuplicateField } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'
import {
  pharmacyStatusLabel,
  type PharmacyDuplicateRow,
} from '@/view-models/pharmacy-duplicate-compare'

function field<K extends keyof PharmacyDuplicateRow>(config: {
  key: K
  label: string
  render: (value: PharmacyDuplicateRow[K]) => string
}): DuplicateField<PharmacyDuplicateRow> {
  return config as DuplicateField<PharmacyDuplicateRow>
}

export function buildPharmacyDuplicateFields(): DuplicateField<PharmacyDuplicateRow>[] {
  return [
    field({ key: 'name', label: 'Nom', render: (v) => v || '—' }),
    field({ key: 'siret', label: 'SIRET', render: (v) => v || '—' }),
    field({ key: 'address', label: 'Adresse', render: (v) => v || '—' }),
    field({ key: 'city', label: 'Ville', render: (v) => v || '—' }),
    field({ key: 'postalCode', label: 'Code postal', render: (v) => v || '—' }),
    field({ key: 'phone', label: 'Téléphone', render: (v) => v || '—' }),
    field({ key: 'email', label: 'Email', render: (v) => v || '—' }),
    field({ key: 'status', label: 'Statut', render: (v) => pharmacyStatusLabel(String(v)) }),
    field({ key: 'notes', label: 'Notes', render: (v) => v || '—' }),
  ]
}
