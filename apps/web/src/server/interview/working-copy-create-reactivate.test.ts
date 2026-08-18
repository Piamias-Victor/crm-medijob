import { describe, expect, it } from 'vitest'
import { archiveInterviewTemplate } from '@/server/interview/working-copy-archive'
import { createInterviewTemplate } from '@/server/interview/working-copy-create'
import { memoryTemplateAdminDeps } from '@/server/interview/working-copy.test.fixtures'
import { memoryJobTitleKeys } from '@/server/interview/working-copy-create.fixtures'

describe('createInterviewTemplate after archive', () => {
  it('reactivates an archived pair with a new empty working copy', async () => {
    const store = memoryTemplateAdminDeps([
      {
        profileKey: 'pharmacien',
        mode: 'INTERIM',
        version: 1,
        label: 'Pharmacien(ne)',
        sections: [{ id: 's1', title: 'Dispo', questions: [] }],
      },
    ])
    const jobs = memoryJobTitleKeys([{ id: 'jt1', name: 'Pharmacien', profileKey: 'pharmacien' }])
    await archiveInterviewTemplate('pharmacien', 'INTERIM', store)
    const copy = await createInterviewTemplate({ jobTitleId: 'jt1', mode: 'INTERIM' }, store, jobs)
    expect(copy.sections).toEqual([])
    expect((await store.findWorkingCopy('pharmacien', 'INTERIM'))?.archivedAt).toBeNull()
  })
})
