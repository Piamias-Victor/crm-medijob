import { describe, expect, it } from 'vitest'
import { startInterview } from '@/server/interview/start'
import { interviewStartIdentity, memoryStartDeps } from '@/server/interview/start.test.fixtures'

describe('startInterview pin', () => {
  it('stores the published InterviewTemplate id on the new DRAFT', async () => {
    const deps = memoryStartDeps()
    deps.findPublishedTemplate = async () => ({ id: 'tpl-v1' })
    await startInterview(interviewStartIdentity, 'u1', deps)
    expect(deps.interviews[0]).toMatchObject({ templateId: 'tpl-v1' })
  })

  it('pins the published InterviewTemplate on an existing candidate DRAFT', async () => {
    const deps = memoryStartDeps([
      {
        id: 'c-existing',
        firstName: 'Camille',
        lastName: 'Durand',
        status: 'NOUVEAU',
        jobTitleId: 'jt-pharma',
        referentId: 'u0',
      },
    ])
    deps.findPublishedTemplate = async () => ({ id: 'tpl-v1' })
    await startInterview({ ...interviewStartIdentity, candidateId: 'c-existing' }, 'u1', deps)
    expect(deps.interviews[0]).toMatchObject({ templateId: 'tpl-v1' })
  })

  it('keeps an existing DRAFT pin after the dedicated pair is archived', async () => {
    let archived = false
    const deps = memoryStartDeps()
    deps.findPublishedTemplate = async (key) => ({
      id: key === 'generique' ? 'tpl-g' : 'tpl-p',
    })
    deps.isPairArchived = async () => archived
    await startInterview(interviewStartIdentity, 'u1', deps)
    expect(deps.interviews[0]?.templateId).toBe('tpl-p')
    archived = true
    const next = await startInterview(
      { ...interviewStartIdentity, email: 'other@example.com' },
      'u1',
      deps,
    )
    expect(deps.interviews[0]?.templateId).toBe('tpl-p')
    expect(deps.interviews.find((row) => row.id === next.interviewId)?.templateId).toBe('tpl-g')
  })
})
