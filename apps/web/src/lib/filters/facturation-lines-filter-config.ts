import type { FilterConfig } from '@/lib/filters/filter-types'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { facturationMonthFilterOptions } from '@/view-models/facturation-month-options'
import { PLACEMENT_CONTRACT_TYPES } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

const PLACEMENT_CONTRACT_OPTIONS = PLACEMENT_CONTRACT_TYPES.map((value) => ({
  value,
  label: value,
}))

export function buildFacturationLinesFilterConfig(
  pharmacies: Ref[],
  recruiters: Ref[],
  now = new Date(),
) {
  return [
    {
      id: 'recherche',
      label: 'Recherche',
      type: 'text',
      placeholder: 'Pharmacie, candidat, métier',
    },
    {
      id: 'mois',
      label: 'Mois',
      type: 'select',
      options: facturationMonthFilterOptions(now),
      placeholder: 'Tous',
    },
    {
      id: 'contrat',
      label: 'Type de contrat',
      type: 'multi-select',
      unit: 'contrats',
      options: PLACEMENT_CONTRACT_OPTIONS,
    },
    {
      id: 'pharmacie',
      label: 'Pharmacie',
      type: 'multi-select',
      unit: 'pharmacies',
      options: pharmacies.map((item) => ({ value: item.id, label: item.name })),
    },
    {
      id: 'referent',
      label: 'Référent',
      type: 'multi-select',
      unit: 'référents',
      options: buildReferentFilterOptions(recruiters),
    },
    {
      id: 'annulation',
      label: 'Statut',
      type: 'select',
      options: [
        { value: 'ALL', label: 'Tous' },
        { value: 'ACTIVE', label: 'Actifs' },
        { value: 'CANCELLED', label: 'Annulés' },
      ],
    },
  ] as const satisfies readonly FilterConfig[]
}

export type FacturationLinesFilterConfig = ReturnType<typeof buildFacturationLinesFilterConfig>
