import { beforeEach, describe, expect, it } from 'vitest'
import {
  openNextCandidateImportDuplicate,
  startCandidateImportDuplicateReviews,
} from '@/lib/candidate-import-navigation'
import { readCandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import { clearCandidateImportQueue } from '@/lib/candidate-import-queue-storage'

const row = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'c@x.fr',
  jobTitleId: 'jt1',
  status: 'NOUVEAU' as const,
  mobilityRadiusKm: 20,
  softwareIds: [] as string[],
  contractTypes: [] as [],
}

const match = {
  candidateId: 'exist-1',
  reason: 'email' as const,
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'c@x.fr',
  phone: null,
}

describe('candidate import navigation', () => {
  beforeEach(() => {
    sessionStorage.clear()
    clearCandidateImportQueue()
  })

  it('opens first duplicate review and queues the rest', () => {
    const href = startCandidateImportDuplicateReviews([
      { row, matches: [match] },
      { row: { ...row, email: 'b@x.fr' }, matches: [{ ...match, candidateId: 'exist-2' }] },
    ])
    expect(href).toContain('/candidats/duplicate-review')
    expect(href).toContain('existingId=exist-1')
    const draft = readCandidateDuplicateDraft()
    expect(draft?.mode).toBe('import')
    const next = openNextCandidateImportDuplicate()
    expect(next).toContain('existingId=exist-2')
  })
})
