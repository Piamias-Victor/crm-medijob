import { buildCandidateCreateDefaults } from '@/view-models/candidate-create-defaults'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'

export function buildInboxAcceptDefaults(input: {
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  city?: string | null
  postalCode?: string | null
  address?: string | null
  jobTitleId: string | null
  referentId: string
  fallbackJobTitleId: string
}): CandidateCreateInput {
  return {
    ...buildCandidateCreateDefaults(input.referentId, input.jobTitleId || input.fallbackJobTitleId),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email ?? undefined,
    phone: input.phone ?? undefined,
    city: input.city ?? undefined,
    postalCode: input.postalCode ?? undefined,
    address: input.address ?? undefined,
    consentGiven: true,
  }
}
