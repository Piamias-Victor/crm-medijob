import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

export type MatchingProfileFields = {
  city: string | null
  postalCode: string | null
  mobilityRadiusKm: number | null
  availableFrom: Date | null
}

export type CandidateFormSource = MatchingProfileFields & {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  jobTitleId: string
  mobilityNotes: string | null
  notes: string | null
  referentId: string
  softwareIds: string[]
  contractTypes: string[]
}

export const DEFAULT_MOBILITY_RADIUS_KM = 30

export function getMissingMatchingFields(profile: MatchingProfileFields): string[] {
  const missing: string[] = []
  if (!profile.city?.trim()) missing.push('city')
  if (!profile.postalCode?.trim()) missing.push('postalCode')
  if (profile.mobilityRadiusKm == null) missing.push('mobilityRadiusKm')
  return missing
}

export function isProfileIncompleteForMatching(profile: MatchingProfileFields): boolean {
  return getMissingMatchingFields(profile).length > 0
}

export function toCandidateFormValues(c: CandidateFormSource): CandidateProfileInput {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email ?? undefined,
    phone: c.phone ?? undefined,
    address: c.address ?? undefined,
    city: c.city ?? undefined,
    postalCode: c.postalCode ?? undefined,
    jobTitleId: c.jobTitleId,
    softwareIds: c.softwareIds,
    contractTypes: c.contractTypes as CandidateProfileInput['contractTypes'],
    mobilityRadiusKm: c.mobilityRadiusKm ?? DEFAULT_MOBILITY_RADIUS_KM,
    mobilityNotes: c.mobilityNotes ?? undefined,
    availableFrom: c.availableFrom?.toISOString().slice(0, 10) ?? undefined,
    notes: c.notes ?? undefined,
    referentId: c.referentId,
  }
}
