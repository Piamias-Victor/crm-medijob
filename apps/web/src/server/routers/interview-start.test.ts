import { describe, expect, it } from 'vitest'
import { interviewCaller } from '@/server/routers/interview.test.fixtures'
import { interviewStartIdentity, memoryStartDeps } from '@/server/interview/start.test.fixtures'
import { INTERVIEW_DRAFT_OPEN } from '@/view-models/interview-copy'

describe('interviewRouter start', () => {
  it('creates a candidate and DRAFT for a recruiter', async () => {
    const memory = memoryStartDeps()
    const result = await interviewCaller(memory).start(interviewStartIdentity)
    expect(result.createdCandidate).toBe(true)
    expect(result.interviewId).toBeTruthy()
    expect(memory.candidates[0]?.referentId).toBe('u1')
  })

  it('rejects a second DRAFT with CONFLICT', async () => {
    const memory = memoryStartDeps([
      {
        id: 'c-existing',
        firstName: 'Camille',
        lastName: 'Durand',
        status: 'NOUVEAU',
        jobTitleId: 'jt-pharma',
        referentId: 'u1',
      },
    ])
    const caller = interviewCaller(memory)
    await caller.start({ ...interviewStartIdentity, candidateId: 'c-existing' })
    await expect(
      caller.start({ ...interviewStartIdentity, candidateId: 'c-existing' }),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: INTERVIEW_DRAFT_OPEN })
  })
})
