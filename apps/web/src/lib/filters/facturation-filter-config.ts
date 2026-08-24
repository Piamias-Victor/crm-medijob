import type { FilterConfig } from '@/lib/filters/filter-types'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { contractOptions } from '@/lib/contract-options'
import { COMMERCIAL_STATUSES } from '@/lib/finance/derive-commercial-status'
import { COMMERCIAL_STATUS_LABELS } from '@/view-models/commercial-status'

type Ref = { id: string; name: string }

function dimensionFilters(pharmacies: Ref[], recruiters: Ref[]) {
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
    {
      id: 'annulation',
      label: 'Statut',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Actifs' },
        { value: 'CANCELLED', label: 'Annulés' },
      ],
      placeholder: 'Tous',
    },
  ] as const
}

export function buildFacturationFilterConfig(pharmacies: Ref[], recruiters: Ref[]) {
  return [
    ...dimensionFilters(pharmacies, recruiters),
    { id: 'periode', label: 'Date d’envoi', type: 'date-range' },
  ] as const satisfies readonly FilterConfig[]
}

export function buildFacturationOverviewFilterConfig(pharmacies: Ref[], recruiters: Ref[]) {
  return [
    ...dimensionFilters(pharmacies, recruiters),
    { id: 'acceptation', label: 'Date d’acceptation', type: 'date-range' },
  ] as const satisfies readonly FilterConfig[]
}

export type FacturationFilterConfig = ReturnType<typeof buildFacturationFilterConfig>
export type FacturationOverviewFilterConfig = ReturnType<typeof buildFacturationOverviewFilterConfig>

export const FACTURATION_LIST_DATE_QUERY_KEYS = ['periode.from', 'periode.to'] as const
export const FACTURATION_OVERVIEW_DATE_QUERY_KEYS = ['acceptation.from', 'acceptation.to'] as const
