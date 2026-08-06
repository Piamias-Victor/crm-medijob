import { CREATE_DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

export function buildAppProfileAcceptDefaults(
  profile: AppProfileListItem,
  referentId: string,
  fallbackJobTitleId: string,
): CandidateCreateInput {
  return {
    firstName: profile.firstName === '—' ? '' : profile.firstName,
    lastName: profile.lastName === '—' ? '' : profile.lastName,
    email: profile.email ?? undefined,
    phone: profile.phone ?? undefined,
    address: profile.address ?? undefined,
    city: profile.city ?? undefined,
    postalCode: profile.postalCode ?? undefined,
    jobTitleId: profile.jobTitleId ?? fallbackJobTitleId,
    referentId,
    status: 'NOUVEAU',
    mobilityRadiusKm: CREATE_DEFAULT_MOBILITY_RADIUS_KM,
    softwareIds: [],
    contractTypes: [],
    consentGiven: true,
  }
}
