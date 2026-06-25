import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { STATUS_LABELS } from '@/lib/pharmacy-options'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

export const PHARMACY_ADVANCED_FILTER_IDS = ['groupement', 'logiciel'] as const

export function buildPharmacyFilterConfig(refs: { groupements: Ref[]; softwares: Ref[] }) {
  return [
    {
      id: 'statut',
      label: 'Statut',
      type: 'multi-select',
      unit: 'statuts',
      options: PHARMACY_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
    },
    {
      id: 'departement',
      label: 'Département',
      type: 'multi-select',
      unit: 'dpt',
      options: FRENCH_DEPARTMENT_OPTIONS,
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
