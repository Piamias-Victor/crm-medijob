import { describe, expect, it } from 'vitest'
import { createInterviewTemplate } from '@/server/interview/working-copy-create'
import { memoryTemplateAdminDeps } from '@/server/interview/working-copy.test.fixtures'
import { memoryJobTitleKeys } from '@/server/interview/working-copy-create.fixtures'

describe('createInterviewTemplate profileKey', () => {
  it('refuses the reserved generique key', async () => {
    const store = memoryTemplateAdminDeps()
    const jobs = memoryJobTitleKeys([{ id: 'jt1', name: 'Autre', profileKey: null }])
    await expect(
      createInterviewTemplate(
        { jobTitleId: 'jt1', mode: 'INTERIM', profileKey: 'generique' },
        store,
        jobs,
      ),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
    expect(jobs.rows[0]?.profileKey).toBeNull()
  })

  it('refuses a profileKey that is not an ascii slug', async () => {
    const store = memoryTemplateAdminDeps()
    const jobs = memoryJobTitleKeys([{ id: 'jt1', name: 'Autre', profileKey: null }])
    await expect(
      createInterviewTemplate(
        { jobTitleId: 'jt1', mode: 'INTERIM', profileKey: 'Préparateur' },
        store,
        jobs,
      ),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('refuses a profileKey already used by another job title', async () => {
    const store = memoryTemplateAdminDeps()
    const jobs = memoryJobTitleKeys([
      { id: 'jt1', name: 'Pharmacien', profileKey: 'pharmacien' },
      { id: 'jt2', name: 'Nouveau métier', profileKey: null },
    ])
    await expect(
      createInterviewTemplate(
        { jobTitleId: 'jt2', mode: 'INTERIM', profileKey: 'pharmacien' },
        store,
        jobs,
      ),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })
})
