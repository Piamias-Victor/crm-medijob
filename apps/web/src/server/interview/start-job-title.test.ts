import { describe, expect, it } from 'vitest'
import { startInterview } from '@/server/interview/start'
import { interviewStartIdentity, memoryStartDeps } from '@/server/interview/start.test.fixtures'

const existing = {
  id: 'c-existing',
  firstName: 'Camille',
  lastName: 'Durand',
  status: 'NOUVEAU',
  referentId: 'u0',
}

describe('startInterview jobTitle', () => {
  it('sets JobTitle from the interview profile when the candidate has none', async () => {
    const deps = memoryStartDeps([{ ...existing, jobTitleId: '' }])
    await startInterview({ ...interviewStartIdentity, candidateId: 'c-existing' }, 'u1', deps)
    expect(deps.candidates[0]?.jobTitleId).toBe('jt-pharma')
  })

  it('does not overwrite an existing JobTitle', async () => {
    const deps = memoryStartDeps([{ ...existing, jobTitleId: 'jt-autre' }])
    await startInterview({ ...interviewStartIdentity, candidateId: 'c-existing' }, 'u1', deps)
    expect(deps.candidates[0]?.jobTitleId).toBe('jt-autre')
  })
})
