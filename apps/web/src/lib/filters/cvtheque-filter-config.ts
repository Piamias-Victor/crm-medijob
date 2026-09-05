import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { CANDIDATE_STATUS_OPTIONS } from '@/lib/candidate-status-options'
import { createContractOptions } from '@/lib/contract-options'
import { candidateOriginOptions } from '@/lib/candidate-origin-options'

type Ref = { id: string; name: string }

export const CVTHEQUE_ADVANCED_FILTER_IDS = [
  'logiciel',
  'contrat',
  'origine',
  'incomplet',
  'missionActive',
  'mobilite',
  'disposDeclarees',
] as const

export function buildCvthequeFilterConfig(refs: {
  jobTitles: Ref[]
  softwares: Ref[]
  recruiters: Ref[]
}) {
  return [
    {
      id: 'q',
      label: 'Recherche',
      type: 'text',
      placeholder: 'Nom, email, tél, ville…',
      wide: true,
    },
    { id: 'statut', label: 'Statut', type: 'multi-select', unit: 'statuts', options: CANDIDATE_STATUS_OPTIONS },
    { id: 'ville', label: 'Ville', type: 'text', placeholder: 'Ville…' },
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
      options: buildReferentFilterOptions(refs.recruiters),
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
      options: createContractOptions,
    },
    {
      id: 'origine',
      label: 'Origine',
      type: 'multi-select',
      unit: 'origines',
      options: candidateOriginOptions,
    },
    { id: 'incomplet', label: 'Profil incomplet', type: 'boolean' },
    { id: 'missionActive', label: 'Mission active', type: 'boolean' },
    {
      id: 'mobilite',
      label: 'Mobilité max (km)',
      type: 'text',
      placeholder: 'Ex. 30',
    },
    { id: 'disposDeclarees', label: 'Dispos déclarées', type: 'boolean' },
  ] as const satisfies readonly FilterConfig[]
}

export type CvthequeFilterConfig = ReturnType<typeof buildCvthequeFilterConfig>
