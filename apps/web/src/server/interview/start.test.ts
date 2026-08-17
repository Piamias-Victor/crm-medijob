import { describe, expect, it } from 'vitest'
import { startInterview } from '@/server/interview/start'
import { interviewStartIdentity, memoryStartDeps } from '@/server/interview/start.test.fixtures'

describe('startInterview', () => {
  it('creates a Nouveau candidate and a DRAFT interview', async () => {
    const deps = memoryStartDeps()
    const result = await startInterview(interviewStartIdentity, 'u1', deps)
    expect(result.createdCandidate).toBe(true)
    expect(deps.candidates[0]).toMatchObject({
      firstName: 'Camille',
      lastName: 'Durand',
      status: 'NOUVEAU',
      jobTitleId: 'jt-pharma',
      referentId: 'u1',
    })
    expect(deps.interviews[0]).toMatchObject({
      candidateId: result.candidateId,
      status: 'DRAFT',
      mode: 'INTERIM',
      referentId: 'u1',
    })
  })

  it('attaches a DRAFT to an existing candidate without creating another', async () => {
    const deps = memoryStartDeps([
      {
        id: 'c-existing',
        firstName: 'Camille',
        lastName: 'Durand',
        status: 'QUALIFIE',
        jobTitleId: 'jt-pharma',
        referentId: 'u0',
      },
    ])
    const result = await startInterview(
      { ...interviewStartIdentity, candidateId: 'c-existing' },
      'u1',
      deps,
    )
    expect(result).toMatchObject({
      createdCandidate: false,
      candidateId: 'c-existing',
    })
    expect(deps.candidates).toHaveLength(1)
    expect(deps.interviews[0]).toMatchObject({
      candidateId: 'c-existing',
      status: 'DRAFT',
      mode: 'INTERIM',
      referentId: 'u1',
    })
  })

  it('rejects a second DRAFT while one is open', async () => {
    const deps = memoryStartDeps([
      {
        id: 'c-existing',
        firstName: 'Camille',
        lastName: 'Durand',
        status: 'NOUVEAU',
        jobTitleId: 'jt-pharma',
        referentId: 'u1',
      },
    ])
    await startInterview({ ...interviewStartIdentity, candidateId: 'c-existing' }, 'u1', deps)
    await expect(
      startInterview({ ...interviewStartIdentity, candidateId: 'c-existing', mode: 'CDD_CDI' }, 'u1', deps),
    ).rejects.toMatchObject({ name: 'InterviewDraftOpenError', draftId: deps.interviews[0]?.id })
    expect(deps.interviews).toHaveLength(1)
  })
})
