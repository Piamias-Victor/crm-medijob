import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { FRENCH_REGION_OPTIONS } from '@/lib/constants/french-region-departments'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { STATUS_LABELS } from '@/lib/pharmacy-options'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

export const PHARMACY_ADVANCED_FILTER_IDS = ['groupement', 'logiciel'] as const

export function buildPharmacyFilterConfig(refs: {
  groupements: Ref[]
  softwares: Ref[]
  recruiters: Ref[]
}) {
  return [
    {
      id: 'statut',
      label: 'Statut',
      type: 'multi-select',
      unit: 'statuts',
      options: PHARMACY_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
    },
    { id: 'ville', label: 'Ville', type: 'text', placeholder: 'Ville…' },
    {
      id: 'region',
      label: 'Région',
      type: 'multi-select',
      unit: 'régions',
      options: FRENCH_REGION_OPTIONS,
    },
    {
      id: 'departement',
      label: 'Département',
      type: 'multi-select',
      unit: 'dpt',
      options: FRENCH_DEPARTMENT_OPTIONS,
    },
    {
      id: 'referent',
      label: 'Référent',
      type: 'multi-select',
      unit: 'référents',
      options: buildReferentFilterOptions(refs.recruiters),
    },
    { id: 'missionActive', label: 'Missions actives', type: 'boolean' },
    {
      id: 'groupement',
      label: 'Groupement',
      type: 'multi-select',
      unit: 'groupements',
      options: refs.groupements.map((item) => ({ value: item.id, label: item.name })),
    },
    {
      id: 'logiciel',
      label: 'Logiciel LGO',
      type: 'multi-select',
      unit: 'logiciels',
      options: refs.softwares.map((item) => ({ value: item.id, label: item.name })),
    },
  ] as const satisfies readonly FilterConfig[]
}

export type PharmacyFilterConfig = ReturnType<typeof buildPharmacyFilterConfig>
