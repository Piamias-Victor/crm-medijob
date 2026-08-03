import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import { STATUS_LABELS } from '@/lib/pharmacy-options'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

export function buildContactFilterConfig(
  pharmacies: Ref[],
  contactRoles: Ref[],
  recruiters: Ref[] = [],
) {
  return [
    {
      id: 'fonction',
      label: 'Fonction',
      type: 'multi-select',
      unit: 'fonctions',
      options: contactRoles.map((item) => ({ value: item.id, label: item.name })),
    },
    {
      id: 'pharmacie',
      label: 'Pharmacie',
      type: 'multi-select',
      unit: 'pharmacies',
      options: pharmacies.map((item) => ({ value: item.id, label: item.name })),
    },
    { id: 'ville', label: 'Ville', type: 'text', placeholder: 'Ville…' },
    {
      id: 'referent',
      label: 'Référent',
      type: 'multi-select',
      unit: 'référents',
      options: buildReferentFilterOptions(recruiters),
    },
    {
      id: 'departement',
      label: 'Département',
      type: 'multi-select',
      unit: 'dpt',
      options: FRENCH_DEPARTMENT_OPTIONS,
    },
    {
      id: 'statutPharmacie',
      label: 'Statut pharmacie',
      type: 'multi-select',
      unit: 'statuts',
      options: PHARMACY_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
    },
    { id: 'principal', label: 'Contact principal', type: 'boolean' },
  ] as const satisfies readonly FilterConfig[]
}

export type ContactFilterConfig = ReturnType<typeof buildContactFilterConfig>
