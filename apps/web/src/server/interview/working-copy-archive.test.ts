import { describe, expect, it } from 'vitest'
import { archiveInterviewTemplate } from '@/server/interview/working-copy-archive'
import { memoryTemplateAdminDeps } from '@/server/interview/working-copy.test.fixtures'
import { INTERVIEW_GENERIC_PROFILE_KEY } from '@/view-models/interview-profile-key'

describe('archiveInterviewTemplate', () => {
  it('refuses to archive the generic trame', async () => {
    const store = memoryTemplateAdminDeps([
      {
        profileKey: INTERVIEW_GENERIC_PROFILE_KEY,
        mode: 'INTERIM',
        version: 1,
        label: 'Générique',
        sections: [],
      },
    ])
    await expect(archiveInterviewTemplate(INTERVIEW_GENERIC_PROFILE_KEY, 'INTERIM', store)).rejects.toMatchObject(
      { code: 'FORBIDDEN' },
    )
    expect((await store.findPublished(INTERVIEW_GENERIC_PROFILE_KEY, 'INTERIM'))?.version).toBe(1)
  })

  it('archives a dedicated pair without deleting published versions', async () => {
    const store = memoryTemplateAdminDeps([
      {
        profileKey: 'pharmacien',
        mode: 'INTERIM',
        version: 1,
        label: 'Pharmacien(ne)',
        sections: [{ id: 's1', title: 'Dispo', questions: [] }],
      },
    ])
    await archiveInterviewTemplate('pharmacien', 'INTERIM', store)
    expect(await store.findWorkingCopy('pharmacien', 'INTERIM')).toMatchObject({
      archivedAt: expect.any(Date),
    })
    expect(await store.findPublished('pharmacien', 'INTERIM')).toMatchObject({
      version: 1,
      label: 'Pharmacien(ne)',
    })
  })
})
