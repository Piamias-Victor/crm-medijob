import type { InterviewDecision } from '@prisma/client'
import type { CandidateStatus, ManualCandidateStatus } from '@/view-models/candidate-status'

const QUALIFIABLE: ReadonlySet<CandidateStatus> = new Set(['NOUVEAU', 'A_QUALIFIER'])

export function proposeCandidateStatus(
  decision: InterviewDecision,
  current: CandidateStatus,
  blacklist: boolean,
): ManualCandidateStatus | null {
  if (blacklist) return 'BLACKLISTE'
  if (current === 'EN_MISSION' || current === 'BLACKLISTE' || current === 'QUALIFIE') return null
  if (decision === 'ELIGIBLE' && QUALIFIABLE.has(current)) return 'QUALIFIE'
  if (decision === 'REVIEW') return 'A_QUALIFIER'
  if (decision === 'NON_ELIGIBLE') return 'INACTIF'
  return null
}
