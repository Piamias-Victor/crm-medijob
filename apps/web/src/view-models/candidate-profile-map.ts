import type { CandidateProfileInput, CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateProfileUpdate } from '@/view-models/candidate-profile-update'
import { resolveConsentFields } from '@/server/gdpr/consent-fields'

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
    status: data.status,
    salaryExpectations: data.salaryExpectations,
    salaryMin: typeof data.salaryMin === 'number' && Number.isFinite(data.salaryMin) ? data.salaryMin : null,
    salaryMax: typeof data.salaryMax === 'number' && Number.isFinite(data.salaryMax) ? data.salaryMax : null,
    mobilityRadiusKm: data.mobilityRadiusKm ?? 30,
    mobilityNotes: data.mobilityNotes,
    availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
    notes: data.notes,
    referentId: data.referentId,
    softwareIds: data.softwareIds ?? [],
    contractTypes: data.contractTypes ?? [],
  }
}

export function toCandidateCreateData(
  data: CandidateCreateInput,
  source: 'SITE' | 'MANUAL' | 'IMPORT' = 'MANUAL',
): CandidateProfileUpdate {
  const consent = resolveConsentFields({
    consentGiven: data.consentGiven === true,
    source,
  })
  return {
    ...toCandidateUpdateData(data),
    ...(data.cvUrl ? { cvUrl: data.cvUrl } : {}),
    consentGivenAt: consent.consentGivenAt,
    consentSource: consent.consentSource,
  }
}
