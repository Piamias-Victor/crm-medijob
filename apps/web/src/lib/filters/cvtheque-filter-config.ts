import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'

type Ref = { id: string; name: string }

export const CVTHEQUE_ADVANCED_FILTER_IDS = [
  'logiciel',
  'contrat',
  'incomplet',
  'missionActive',
] as const

export function buildCvthequeFilterConfig(refs: {
  jobTitles: Ref[]
  softwares: Ref[]
  recruiters: Ref[]
}) {
  return [
    {
      id: 'metier',
      label: 'Métier',
      type: 'multi-select',
      unit: 'métiers',
      options: refs.jobTitles.map((item) => ({ value: item.id, label: item.name })),
    },
    { id: 'disponible', label: 'Disponibilité', type: 'boolean' },
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
      options: refs.recruiters.map((item) => ({ value: item.id, label: item.name })),
    },
    {
      id: 'logiciel',
      label: 'Logiciel LGO',
      type: 'multi-select',
      unit: 'logiciels',
      options: refs.softwares.map((item) => ({ value: item.id, label: item.name })),
    },
    {
      id: 'contrat',
      label: 'Contrat préféré',
      type: 'multi-select',
      unit: 'types',
      options: [
        { value: 'CDI', label: 'CDI' },
        { value: 'CDD', label: 'CDD' },
        { value: 'INTERIM', label: 'Intérim' },
      ],
    },
    { id: 'incomplet', label: 'Profil incomplet', type: 'boolean' },
    { id: 'missionActive', label: 'Mission active', type: 'boolean' },
  ] as const satisfies readonly FilterConfig[]
}

export type CvthequeFilterConfig = ReturnType<typeof buildCvthequeFilterConfig>
