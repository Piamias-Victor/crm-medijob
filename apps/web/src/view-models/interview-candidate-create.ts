import { resolveConsentFields } from '@/server/gdpr/consent-fields'
import { CREATE_DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import type { CandidateProfileUpdate } from '@/view-models/candidate-profile-update'
import type { StartInterviewDeps } from '@/server/interview/start'

type CandidateCreateInput = Parameters<StartInterviewDeps['createCandidate']>[0]

export function toInterviewCandidateCreate(data: CandidateCreateInput): CandidateProfileUpdate {
  const consent = resolveConsentFields({ consentGiven: true, source: 'MANUAL' })
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    jobTitleId: data.jobTitleId,
    status: 'NOUVEAU',
    mobilityRadiusKm: CREATE_DEFAULT_MOBILITY_RADIUS_KM,
    softwareIds: [],
    contractTypes: [],
    referentId: data.referentId,
    consentGivenAt: consent.consentGivenAt,
    consentSource: consent.consentSource,
  }
}
