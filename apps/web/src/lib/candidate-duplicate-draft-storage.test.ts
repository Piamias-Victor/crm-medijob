import { describe, expect, it } from 'vitest'
import { candidateDuplicateDraftSchema } from '@/lib/candidate-duplicate-draft-storage'
import { toCandidateCreateInputFromInterviewStart } from '@/view-models/interview-duplicate-incoming'

const incoming = toCandidateCreateInputFromInterviewStart({
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  jobTitleId: 'jt-pharma',
  mode: 'INTERIM',
})

describe('candidateDuplicateDraftSchema interview', () => {
  it('accepts interview mode with interviewMode for post-review start', () => {
    const parsed = candidateDuplicateDraftSchema.parse({
      mode: 'interview',
      incoming,
      interviewMode: 'INTERIM',
      returnPath: '/candidats/entretiens/new',
      matches: [
        {
          candidateId: 'c1',
          reason: 'email',
          firstName: 'Camille',
          lastName: 'Durand',
          email: 'camille@example.com',
          phone: null,
        },
      ],
    })
    expect(parsed.mode).toBe('interview')
    if (parsed.mode === 'interview') expect(parsed.interviewMode).toBe('INTERIM')
  })
})
