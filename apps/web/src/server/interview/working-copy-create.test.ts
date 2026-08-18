import { describe, expect, it } from 'vitest'
import { createInterviewTemplate } from '@/server/interview/working-copy-create'
import { memoryTemplateAdminDeps } from '@/server/interview/working-copy.test.fixtures'
import { memoryJobTitleKeys } from '@/server/interview/working-copy-create.fixtures'

describe('createInterviewTemplate', () => {
  it('creates an empty working copy and assigns profileKey when missing', async () => {
    const store = memoryTemplateAdminDeps()
    const jobs = memoryJobTitleKeys([
      { id: 'jt1', name: 'Préparateur adjoint', profileKey: null },
    ])
    const copy = await createInterviewTemplate(
      { jobTitleId: 'jt1', mode: 'INTERIM', profileKey: 'preparateur_adjoint' },
      store,
      jobs,
    )
    expect(copy).toMatchObject({
      profileKey: 'preparateur_adjoint',
      mode: 'INTERIM',
      label: 'Préparateur adjoint',
      sections: [],
    })
    expect(jobs.rows[0]?.profileKey).toBe('preparateur_adjoint')
    expect(await store.findWorkingCopy('preparateur_adjoint', 'INTERIM')).toMatchObject({
      profileKey: 'preparateur_adjoint',
      label: 'Préparateur adjoint',
    })
  })

  it('copies a published trame with new section and question ids', async () => {
    const store = memoryTemplateAdminDeps([
      {
        profileKey: 'pharmacien',
        mode: 'INTERIM',
        version: 1,
        label: 'Pharmacien(ne)',
        sections: [
          {
            id: 'sec-src',
            title: 'Dispo',
            questions: [
              {
                id: 'q-src',
                question: 'Disponible quand ?',
                suggestedAnswers: [{ label: 'Oui', text: 'Oui.', points: 1, tone: 'ok' }],
              },
            ],
          },
        ],
      },
    ])
    const jobs = memoryJobTitleKeys([{ id: 'jt2', name: 'Rayonniste nuit', profileKey: null }])
    const copy = await createInterviewTemplate(
      {
        jobTitleId: 'jt2',
        mode: 'CDD_CDI',
        profileKey: 'rayonniste_nuit',
        source: { profileKey: 'pharmacien', mode: 'INTERIM' },
      },
      store,
      jobs,
    )
    expect(copy.sections[0]?.title).toBe('Dispo')
    expect(copy.sections[0]?.questions[0]?.question).toBe('Disponible quand ?')
    expect(copy.sections[0]?.id).not.toBe('sec-src')
    expect(copy.sections[0]?.questions[0]?.id).not.toBe('q-src')
  })

  it('refuses a second INTERIM trame for the same job title', async () => {
    const store = memoryTemplateAdminDeps([
      {
        profileKey: 'pharmacien',
        mode: 'INTERIM',
        version: 1,
        label: 'Pharmacien(ne)',
        sections: [],
      },
    ])
    const jobs = memoryJobTitleKeys([{ id: 'jt1', name: 'Pharmacien', profileKey: 'pharmacien' }])
    await expect(
      createInterviewTemplate({ jobTitleId: 'jt1', mode: 'INTERIM' }, store, jobs),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })
})
