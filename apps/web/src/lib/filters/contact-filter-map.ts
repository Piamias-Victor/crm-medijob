import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { ContactFilterConfig } from '@/lib/filters/contact-filter-config'
import type { ContactListFilters } from '@/view-models/contact-list-filters.schema'
import { PHARMACY_STATUSES } from '@/view-models/pharmacy-form.schema'

export type ContactFilterValues = FilterValues<ContactFilterConfig>

export function toContactListFilters(values: ContactFilterValues): ContactListFilters {
  const pharmacyStatuses = values.statutPharmacie.filter(
    (value): value is (typeof PHARMACY_STATUSES)[number] =>
      (PHARMACY_STATUSES as readonly string[]).includes(value),
  )
  const city = values.ville.trim()

  return {
    contactRoleIds: values.fonction.length ? values.fonction : undefined,
    pharmacyIds: values.pharmacie.length ? values.pharmacie : undefined,
    departments: values.departement.length ? values.departement : undefined,
    pharmacyStatuses: pharmacyStatuses.length ? pharmacyStatuses : undefined,
    isPrimary: values.principal ?? undefined,
    referentIds: values.referent.length ? values.referent : undefined,
    city: city.length ? city : undefined,
  }
}

export function buildContactFilterDefaults(config: ContactFilterConfig): ContactFilterValues {
  return buildDefaultFilterValues(config)
}
