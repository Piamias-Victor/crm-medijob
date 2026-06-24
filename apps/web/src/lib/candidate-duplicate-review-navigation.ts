import type { CandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import { saveCandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

export function buildDuplicateReviewPath(matches: DuplicateMatch[], existingId?: string) {
  const params = new URLSearchParams()
  if (existingId) params.set('existingId', existingId)
  else if (matches.length === 1) params.set('existingId', matches[0].candidateId)
  else params.set('pick', '1')
  return `/candidats/duplicate-review?${params}`
}

export function saveDraftAndBuildDuplicateReviewPath(
  draft: CandidateDuplicateDraft,
  existingId?: string,
) {
  saveCandidateDuplicateDraft(draft)
  return buildDuplicateReviewPath(draft.matches, existingId)
}
