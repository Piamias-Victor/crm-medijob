import { describe, expect, it } from 'vitest'
import { proposeCandidateStatus } from '@/view-models/interview-propose-status'

describe('proposeCandidateStatus', () => {
  it('proposes Qualifié from ELIGIBLE when the candidate is still Nouveau', () => {
    expect(proposeCandidateStatus('ELIGIBLE', 'NOUVEAU', false)).toBe('QUALIFIE')
  })

  it('follows the decision table without touching locked statuses', () => {
    expect(proposeCandidateStatus('REVIEW', 'NOUVEAU', false)).toBe('A_QUALIFIER')
    expect(proposeCandidateStatus('NON_ELIGIBLE', 'A_QUALIFIER', false)).toBe('INACTIF')
    expect(proposeCandidateStatus('ELIGIBLE', 'QUALIFIE', false)).toBeNull()
    expect(proposeCandidateStatus('ELIGIBLE', 'EN_MISSION', false)).toBeNull()
    expect(proposeCandidateStatus('NON_ELIGIBLE', 'NOUVEAU', true)).toBe('BLACKLISTE')
  })
})
