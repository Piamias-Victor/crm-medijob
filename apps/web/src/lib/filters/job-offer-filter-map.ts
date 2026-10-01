import type { FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type { JobOfferFilterConfig } from '@/lib/filters/job-offer-filter-config'
import {
  JOB_OFFER_SOURCES,
  JOB_OFFER_STATUSES,
  type JobOfferListFilters,
} from '@/view-models/job-offer-list-filters.schema'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'

export type JobOfferFilterValues = FilterValues<JobOfferFilterConfig>

export function toJobOfferListFilters(values: JobOfferFilterValues): JobOfferListFilters {
  const contractTypes = values.contrat.filter(
    (value): value is (typeof CONTRACT_TYPES)[number] =>
      (CONTRACT_TYPES as readonly string[]).includes(value),
  )
  const statuses = values.statut.filter(
    (value): value is (typeof JOB_OFFER_STATUSES)[number] =>
      (JOB_OFFER_STATUSES as readonly string[]).includes(value),
  )
  const sources = values.source.filter(
    (value): value is (typeof JOB_OFFER_SOURCES)[number] =>
      (JOB_OFFER_SOURCES as readonly string[]).includes(value),
  )
  const city = values.ville.trim()
  const createdFrom = values.periode.from.trim()
  const createdTo = values.periode.to.trim()

  return {
    contractTypes: contractTypes.length ? contractTypes : undefined,
    statuses: statuses.length ? statuses : undefined,
    sources: sources.length ? sources : undefined,
    jobTitleIds: values.metier.length ? values.metier : undefined,
    pharmacyIds: values.pharmacie.length ? values.pharmacie : undefined,
    departments: values.departement.length ? values.departement : undefined,
    city: city.length ? city : undefined,
    referentIds: values.referent.length ? values.referent : undefined,
    createdFrom: createdFrom.length ? createdFrom : undefined,
    createdTo: createdTo.length ? createdTo : undefined,
  }
}

export function buildJobOfferFilterDefaults(config: JobOfferFilterConfig): JobOfferFilterValues {
  return buildDefaultFilterValues(config)
}
