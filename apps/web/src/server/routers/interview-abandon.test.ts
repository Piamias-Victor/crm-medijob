import { describe, expect, it } from 'vitest'
import { interviewCaller } from '@/server/routers/interview.test.fixtures'
import { interviewStartIdentity, memoryStartDeps } from '@/server/interview/start.test.fixtures'

describe('interviewRouter abandon', () => {
  it('soft-deletes the DRAFT and keeps the candidate', async () => {
    const memory = memoryStartDeps()
    const caller = interviewCaller(memory)
    const started = await caller.start(interviewStartIdentity)
    const result = await caller.abandon({ id: started.interviewId })
    expect(result.candidateId).toBe(started.candidateId)
    expect(memory.candidates).toHaveLength(1)
    expect(memory.interviews[0]?.deletedAt).toBeInstanceOf(Date)
  })
})
