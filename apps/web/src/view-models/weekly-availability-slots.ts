import type { CandidateOriginValue } from '@/lib/candidate-origin-options'

export function canCopyWeeklyAvailabilityLink(origin: CandidateOriginValue): boolean {
  return origin === 'APP'
}
