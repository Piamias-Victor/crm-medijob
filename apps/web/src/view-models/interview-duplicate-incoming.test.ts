import { describe, expect, it } from 'vitest'
import {
  buildInterviewStartFromDuplicateDraft,
  interviewDuplicateProbeEnabled,
  toCandidateCreateInputFromInterviewStart,
} from '@/view-models/interview-duplicate-incoming'

const identity = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: '0601020304',
  jobTitleId: 'jt-pharma',
  mode: 'INTERIM' as const,
}

describe('toCandidateCreateInputFromInterviewStart', () => {
  it('maps interview identity into create incoming for duplicate review', () => {
    const incoming = toCandidateCreateInputFromInterviewStart(identity)
    expect(incoming).toMatchObject({
      firstName: 'Camille',
      lastName: 'Durand',
      email: 'camille@example.com',
      phone: '0601020304',
      jobTitleId: 'jt-pharma',
      status: 'NOUVEAU',
    })
  })
})

describe('buildInterviewStartFromDuplicateDraft', () => {
  it('after merge, start attaches DRAFT to kept candidate', () => {
    const start = buildInterviewStartFromDuplicateDraft(
      {
        incoming: toCandidateCreateInputFromInterviewStart(identity),
        interviewMode: 'CDD_CDI',
      },
      'c-existing',
    )
    expect(start).toMatchObject({
      candidateId: 'c-existing',
      firstName: 'Camille',
      email: 'camille@example.com',
      jobTitleId: 'jt-pharma',
      mode: 'CDD_CDI',
    })
  })

  it('after ignore, start creates a new candidate (no attach id)', () => {
    const start = buildInterviewStartFromDuplicateDraft({
      incoming: toCandidateCreateInputFromInterviewStart(identity),
      interviewMode: 'INTERIM',
    })
    expect(start.candidateId).toBeUndefined()
    expect(start).toMatchObject({
      firstName: 'Camille',
      email: 'camille@example.com',
      mode: 'INTERIM',
    })
  })
})

describe('interviewDuplicateProbeEnabled', () => {
  it('skips duplicate review when starting from an existing fiche', () => {
    expect(interviewDuplicateProbeEnabled('c-existing')).toBe(false)
    expect(interviewDuplicateProbeEnabled(undefined)).toBe(true)
  })
})
