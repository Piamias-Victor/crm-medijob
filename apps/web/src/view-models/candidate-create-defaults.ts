import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import { CREATE_DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'

export function buildCandidateCreateDefaults(
  referentId: string,
  jobTitleId: string,
): CandidateCreateInput {
  return {
    firstName: '',
    lastName: '',
    jobTitleId,
    referentId,
    mobilityRadiusKm: CREATE_DEFAULT_MOBILITY_RADIUS_KM,
    softwareIds: [],
    contractTypes: [],
  }
}
