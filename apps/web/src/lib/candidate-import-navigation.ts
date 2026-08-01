import { saveCandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import {
  saveCandidateImportQueue,
  shiftCandidateImportQueue,
  type CandidateImportQueueItem,
} from '@/lib/candidate-import-queue-storage'

export function candidateDuplicateReviewHref(existingId?: string, pick?: boolean): string {
  const params = new URLSearchParams()
  if (existingId) params.set('existingId', existingId)
  if (pick) params.set('pick', '1')
  const query = params.toString()
  return query ? `/candidats/duplicate-review?${query}` : '/candidats/duplicate-review'
}

export function startCandidateImportDuplicateReviews(
  items: CandidateImportQueueItem[],
): string | null {
  if (items.length === 0) return null
  const [first, ...rest] = items
  saveCandidateImportQueue(rest)
  return openCandidateImportDuplicateItem(first)
}

export function openNextCandidateImportDuplicate(): string | null {
  const next = shiftCandidateImportQueue()
  if (!next) return null
  return openCandidateImportDuplicateItem(next)
}

function openCandidateImportDuplicateItem(item: CandidateImportQueueItem): string {
  saveCandidateDuplicateDraft({
    mode: 'import',
    incoming: item.row,
    returnPath: '/candidats',
    matches: item.matches,
  })
  if (item.matches.length > 1) return candidateDuplicateReviewHref(undefined, true)
  return candidateDuplicateReviewHref(item.matches[0]?.candidateId)
}
