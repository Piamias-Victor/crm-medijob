export const CANDIDATE_STATUSES = [
  'NOUVEAU',
  'A_QUALIFIER',
  'QUALIFIE',
  'EN_MISSION',
  'INACTIF',
  'BLACKLISTE',
] as const

export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number]

export const MANUAL_CANDIDATE_STATUSES = [
  'NOUVEAU',
  'A_QUALIFIER',
  'QUALIFIE',
  'INACTIF',
  'BLACKLISTE',
] as const satisfies readonly CandidateStatus[]

export type ManualCandidateStatus = (typeof MANUAL_CANDIDATE_STATUSES)[number]

const OVERRIDE_STATUSES = new Set<CandidateStatus>(['INACTIF', 'BLACKLISTE'])

export function toEffectiveCandidateStatus(
  stored: CandidateStatus,
  hasActivePositioning: boolean,
): CandidateStatus {
  if (OVERRIDE_STATUSES.has(stored)) return stored
  if (hasActivePositioning) return 'EN_MISSION'
  return stored
}
