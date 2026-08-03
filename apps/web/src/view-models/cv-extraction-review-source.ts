import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateFormSource } from '@/view-models/candidate-profile'

export function toCreateFormSource(defaults: CandidateCreateInput): CandidateFormSource {
  return {
    firstName: defaults.firstName,
    lastName: defaults.lastName,
    email: defaults.email ?? null,
    phone: defaults.phone ?? null,
    address: defaults.address ?? null,
    city: defaults.city ?? null,
    postalCode: defaults.postalCode ?? null,
    jobTitleId: defaults.jobTitleId,
    status: defaults.status,
    salaryExpectations: defaults.salaryExpectations ?? null,
    salaryMin: defaults.salaryMin ?? null,
    salaryMax: defaults.salaryMax ?? null,
    mobilityRadiusKm: defaults.mobilityRadiusKm,
    mobilityNotes: defaults.mobilityNotes ?? null,
    availableFrom: defaults.availableFrom ? new Date(defaults.availableFrom) : null,
    notes: defaults.notes ?? null,
    referentId: defaults.referentId ?? null,
    softwareIds: defaults.softwareIds,
    contractTypes: defaults.contractTypes,
  }
}
