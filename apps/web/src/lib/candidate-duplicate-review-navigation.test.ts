import { beforeEach, describe, expect, it } from 'vitest'
import { saveDraftAndBuildDuplicateReviewPath } from '@/lib/candidate-duplicate-review-navigation'
import { readCandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import { toCandidateCreateInputFromInterviewStart } from '@/view-models/interview-duplicate-incoming'

const identity = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  jobTitleId: 'jt-pharma',
  mode: 'INTERIM' as const,
}

const match = {
  candidateId: 'c-existing',
  reason: 'email' as const,
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: null,
}

describe('interview duplicate review navigation', () => {
  beforeEach(() => sessionStorage.clear())

  it('opens existing duplicate-review instead of creating a silent double', () => {
    const href = saveDraftAndBuildDuplicateReviewPath(
      {
        mode: 'interview',
        incoming: toCandidateCreateInputFromInterviewStart(identity),
        interviewMode: 'INTERIM',
        returnPath: '/candidats/entretiens/new',
        matches: [match],
      },
      'c-existing',
    )
    expect(href).toBe('/candidats/duplicate-review?existingId=c-existing')
    expect(readCandidateDuplicateDraft()?.mode).toBe('interview')
  })
})
