import type { FilterConfig } from '@/lib/filters/filter-types'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { contractOptions } from '@/lib/contract-options'
import { COMMERCIAL_STATUSES } from '@/lib/finance/derive-commercial-status'
import { COMMERCIAL_STATUS_LABELS } from '@/view-models/commercial-status'

type Ref = { id: string; name: string }

export function buildFacturationFilterConfig(pharmacies: Ref[], recruiters: Ref[]) {
  return [
    {
      id: 'contrat',
      label: 'Type de contrat',
      type: 'multi-select',
      unit: 'contrats',
      options: contractOptions,
    },
    {
      id: 'etat',
      label: 'État commercial',
      type: 'multi-select',
      unit: 'états',
      options: COMMERCIAL_STATUSES.map((status) => ({
        value: status,
        label: COMMERCIAL_STATUS_LABELS[status],
      })),
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
    { id: 'periode', label: 'Date d’envoi', type: 'date-range' },
  ] as const satisfies readonly FilterConfig[]
}

export type FacturationFilterConfig = ReturnType<typeof buildFacturationFilterConfig>
