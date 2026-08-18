import { describe, expect, it } from 'vitest'
import { interviewCaller, makeInterviewDeps } from '@/server/routers/interview.test.fixtures'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'
import { INTERVIEW_CLOSE_NOT_DRAFT } from '@/view-models/interview-copy'

function callerWith(memory = memoryCloseDeps()) {
  return { memory, caller: interviewCaller({ ...makeInterviewDeps(), ...memory }) }
}

describe('interviewRouter close', () => {
  it('closes a DRAFT without calling AI', async () => {
    const { memory, caller } = callerWith()
    const result = await caller.close({
      id: 'i1',
      scores: { B1: 12 },
      decision: 'ELIGIBLE',
      overwriteFields: [],
      mappingEdits: {},
      applyStatus: false,
      blacklist: false,
    })
    expect(result).toMatchObject({ id: 'i1', candidateId: 'c1' })
    expect(memory.interviews[0]?.status).toBe('CLOSED')
    expect(memory.interviews[0]?.decision).toBe('ELIGIBLE')
  })

  it('rejects closing a CLOSED interview', async () => {
    const { caller } = callerWith(memoryCloseDeps({ status: 'CLOSED' }))
    await expect(
      caller.close({
        id: 'i1',
        scores: { B1: 1 },
        decision: 'REVIEW',
        overwriteFields: [],
        mappingEdits: {},
        applyStatus: false,
        blacklist: false,
      }),
    ).rejects.toMatchObject({ message: INTERVIEW_CLOSE_NOT_DRAFT })
  })
})
