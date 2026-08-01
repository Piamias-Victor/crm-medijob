import { clearCandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import { clearCandidateImportQueue } from '@/lib/candidate-import-queue-storage'
import { openNextCandidateImportDuplicate } from '@/lib/candidate-import-navigation'

export function finishCandidateImportReview(
  push: (href: string) => void,
  fallbackId?: string,
) {
  clearCandidateDuplicateDraft()
  const next = openNextCandidateImportDuplicate()
  if (next) {
    push(next)
    return
  }
  push(fallbackId ? `/candidats/${fallbackId}` : '/candidats')
}

export function cancelCandidateImportReview(
  push: (href: string) => void,
  returnPath?: string,
) {
  clearCandidateDuplicateDraft()
  clearCandidateImportQueue()
  push(returnPath ?? '/candidats')
}
