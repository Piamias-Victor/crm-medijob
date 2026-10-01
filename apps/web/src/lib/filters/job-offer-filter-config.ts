import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { contractOptions } from '@/lib/contract-options'
import {
  JOB_OFFER_SOURCES,
  JOB_OFFER_STATUSES,
} from '@/view-models/job-offer-list-filters.schema'
import { JOB_OFFER_STATUS_LABELS } from '@/view-models/job-offer-status'

type Ref = { id: string; name: string }

const SOURCE_LABELS: Record<(typeof JOB_OFFER_SOURCES)[number], string> = {
  mission: 'Mission',
  standalone: 'Sans mission',
}

export function buildJobOfferFilterConfig(
  pharmacies: Ref[],
  jobTitles: Ref[],
  recruiters: Ref[],
) {
  return [
    {
      id: 'contrat',
      label: 'Type de contrat',
      type: 'multi-select',
      unit: 'contrats',
      options: contractOptions,
    },
    {
      id: 'statut',
      label: 'Statut',
      type: 'multi-select',
      unit: 'statuts',
      options: JOB_OFFER_STATUSES.map((status) => ({
        value: status,
        label: JOB_OFFER_STATUS_LABELS[status],
      })),
    },
    {
      id: 'source',
      label: 'Source',
      type: 'multi-select',
      unit: 'sources',
      options: JOB_OFFER_SOURCES.map((value) => ({
        value,
        label: SOURCE_LABELS[value],
      })),
    },
    {
      id: 'metier',
      label: 'Métier',
      type: 'multi-select',
      unit: 'métiers',
      options: jobTitles.map((item) => ({ value: item.id, label: item.name })),
    },
    { id: 'ville', label: 'Ville', type: 'text', placeholder: 'Ville…' },
    {
      id: 'departement',
      label: 'Département',
      type: 'multi-select',
      unit: 'dpt',
      options: FRENCH_DEPARTMENT_OPTIONS,
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
    { id: 'periode', label: 'Période', type: 'date-range' },
  ] as const satisfies readonly FilterConfig[]
}

export type JobOfferFilterConfig = ReturnType<typeof buildJobOfferFilterConfig>
