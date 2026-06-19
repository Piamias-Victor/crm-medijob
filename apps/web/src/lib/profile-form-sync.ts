import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

export function buildProfileFormSnapshot(values: CandidateProfileInput) {
  return JSON.stringify(values)
}
