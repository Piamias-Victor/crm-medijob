import type { CandidateProfileInput, CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateProfileUpdate } from '@/view-models/candidate-profile-update'

export function toCandidateUpdateData(data: CandidateProfileInput): CandidateProfileUpdate {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    jobTitleId: data.jobTitleId,
    mobilityRadiusKm: data.mobilityRadiusKm ?? 30,
    mobilityNotes: data.mobilityNotes,
    availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
    notes: data.notes,
    referentId: data.referentId,
    softwareIds: data.softwareIds ?? [],
    contractTypes: data.contractTypes ?? [],
  }
}

export function toCandidateCreateData(data: CandidateCreateInput): CandidateProfileUpdate {
  return {
    ...toCandidateUpdateData(data),
    ...(data.cvUrl ? { cvUrl: data.cvUrl } : {}),
  }
}
