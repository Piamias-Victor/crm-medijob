import type { CandidateQuickCreateInput } from '@/view-models/candidate-quick-create.schema'

export function toCandidateQuickCreateData(input: CandidateQuickCreateInput) {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email ?? null,
    phone: input.phone ?? null,
    city: input.city ?? null,
    jobTitleId: input.jobTitleId,
    referentId: input.referentId,
    mobilityRadiusKm: 30,
  }
}
