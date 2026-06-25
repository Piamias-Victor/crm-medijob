import type { ReactNode } from 'react'
import type { DuplicateField } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'
import {
  labelForId,
  labelList,
} from '@/lib/candidate-duplicate-labels'
import type { CandidateDuplicateRow } from '@/view-models/candidate-duplicate-compare'
import type { RefItem } from '@/view-models/referential'

const arrayEquals = (left: string[], right: string[]) =>
  JSON.stringify([...left].sort()) === JSON.stringify([...right].sort())

function field<K extends keyof CandidateDuplicateRow>(config: {
  key: K
  label: string
  render: (value: CandidateDuplicateRow[K]) => ReactNode
  equals?: (left: CandidateDuplicateRow[K], right: CandidateDuplicateRow[K]) => boolean
}): DuplicateField<CandidateDuplicateRow> {
  return config as DuplicateField<CandidateDuplicateRow>
}

export function buildCandidateDuplicateFields(
  referentials: { jobTitles: RefItem[]; softwares: RefItem[]; recruiters: RefItem[] },
): DuplicateField<CandidateDuplicateRow>[] {
  const { jobTitles, softwares, recruiters } = referentials
  return [
    field({ key: 'firstName', label: 'Prénom', render: (v) => v }),
    field({ key: 'lastName', label: 'Nom', render: (v) => v }),
    field({ key: 'email', label: 'Email', render: (v) => v || '—' }),
    field({ key: 'phone', label: 'Téléphone', render: (v) => v || '—' }),
    field({ key: 'address', label: 'Adresse', render: (v) => v || '—' }),
    field({ key: 'city', label: 'Ville', render: (v) => v || '—' }),
    field({ key: 'postalCode', label: 'Code postal', render: (v) => v || '—' }),
    field({ key: 'jobTitleId', label: 'Métier', render: (id) => labelForId(jobTitles, id) }),
    field({
      key: 'softwareIds',
      label: 'Logiciels',
      render: (ids) => labelList(softwares, ids),
      equals: arrayEquals,
    }),
    field({
      key: 'contractTypes',
      label: 'Contrats',
      render: (types) => (types.length ? types.join(', ') : '—'),
      equals: arrayEquals,
    }),
    field({ key: 'mobilityRadiusKm', label: 'Mobilité (km)', render: (v) => String(v) }),
    field({ key: 'mobilityNotes', label: 'Notes mobilité', render: (v) => v || '—' }),
    field({ key: 'availableFrom', label: 'Dispo. à partir du', render: (v) => v || '—' }),
    field({ key: 'notes', label: 'Notes internes', render: (v) => v || '—' }),
    field({ key: 'referentId', label: 'Référent', render: (id) => labelForId(recruiters, id) }),
    field({ key: 'cvUrl', label: 'CV', render: (v) => (v ? 'Fichier joint' : '—') }),
  ]
}
