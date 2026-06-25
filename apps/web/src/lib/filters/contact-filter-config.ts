import type { FilterConfig } from '@/lib/filters/filter-types'
import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { ROLE_LABELS } from '@/lib/contact-options'
import { STATUS_LABELS } from '@/lib/pharmacy-options'
import { CONTACT_ROLES } from '@/view-models/contact-form.schema'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

export function buildContactFilterConfig(pharmacies: Ref[]) {
  return [
    {
      id: 'role',
      label: 'Rôle',
      type: 'multi-select',
      unit: 'rôles',
      options: CONTACT_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
    },
    {
      id: 'pharmacie',
      label: 'Pharmacie',
      type: 'multi-select',
      unit: 'pharmacies',
      options: pharmacies.map((item) => ({ value: item.id, label: item.name })),
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
