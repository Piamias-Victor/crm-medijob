import { describe, expect, it } from 'vitest'
import { abandonInterview } from '@/server/interview/abandon'
import { startInterview } from '@/server/interview/start'
import { interviewStartIdentity, memoryStartDeps } from '@/server/interview/start.test.fixtures'

describe('abandonInterview', () => {
  it('soft-deletes the DRAFT and keeps the Candidate', async () => {
    const deps = memoryStartDeps()
    const started = await startInterview(interviewStartIdentity, 'u1', deps)
    const result = await abandonInterview(started.interviewId, deps)
    expect(result).toMatchObject({ candidateId: started.candidateId })
    expect(deps.interviews[0]?.deletedAt).toBeInstanceOf(Date)
    expect(deps.candidates).toHaveLength(1)
    expect(await deps.findDraftByCandidate(started.candidateId)).toBeNull()
  })

  it('allows a new DRAFT after abandon', async () => {
    const deps = memoryStartDeps()
    const started = await startInterview(interviewStartIdentity, 'u1', deps)
    await abandonInterview(started.interviewId, deps)
    const again = await startInterview(
      { ...interviewStartIdentity, candidateId: started.candidateId },
      'u1',
      deps,
    )
    expect(again.createdCandidate).toBe(false)
    expect(deps.interviews.filter((row) => !row.deletedAt)).toHaveLength(1)
  })

  it('refuses to abandon a CLOSED interview', async () => {
    const deps = memoryStartDeps()
    const started = await startInterview(interviewStartIdentity, 'u1', deps)
    const row = deps.interviews.find((interview) => interview.id === started.interviewId)
    if (row) row.status = 'CLOSED'
    await expect(abandonInterview(started.interviewId, deps)).rejects.toMatchObject({
      message: 'INTERVIEW_NOT_DRAFT',
    })
  })
})
