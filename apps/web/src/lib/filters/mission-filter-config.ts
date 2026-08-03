import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { contractOptions } from '@/lib/contract-options'
import { MISSION_STATUS_ORDER, STATUS_LABELS } from '@/lib/mission-options'

type Ref = { id: string; name: string }

export function buildMissionFilterConfig(
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
      options: MISSION_STATUS_ORDER.map((status) => ({
        value: status,
        label: STATUS_LABELS[status],
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

export type MissionFilterConfig = ReturnType<typeof buildMissionFilterConfig>
