import { describe, expect, it } from 'vitest'
import { getInterviewWorkingCopy, saveInterviewWorkingCopy } from '@/server/interview/working-copy'
import { memoryTemplateAdminDeps } from '@/server/interview/working-copy.test.fixtures'

const availabilityQuestion = {
  id: 'q1',
  question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
  suggestedAnswers: [{ label: 'Immédiate', text: 'Dispo.', points: 12, tone: 'excellent' }],
}

describe('getInterviewWorkingCopy', () => {
  it('clones the published trame and stamps inferred mappings', async () => {
    const deps = memoryTemplateAdminDeps([
      {
        profileKey: 'pharmacien',
        mode: 'INTERIM',
        version: 1,
        label: 'Pharmacien(ne)',
        sections: [{ id: 'dispo', title: 'Dispo', questions: [availabilityQuestion] }],
      },
    ])
    const copy = await getInterviewWorkingCopy('pharmacien', 'INTERIM', deps)
    expect(copy.label).toBe('Pharmacien(ne)')
    expect(copy.sections[0]?.questions[0]?.mapping).toBe('availability')
    expect(deps.published[0]?.sections[0]?.questions[0]).not.toHaveProperty('mapping')
  })

  it('saves the working copy without changing the published trame', async () => {
    const deps = memoryTemplateAdminDeps([
      {
        profileKey: 'pharmacien',
        mode: 'INTERIM',
        version: 1,
        label: 'Pharmacien(ne)',
        sections: [{ id: 'dispo', title: 'Dispo', questions: [availabilityQuestion] }],
      },
    ])
    const copy = await getInterviewWorkingCopy('pharmacien', 'INTERIM', deps)
    copy.sections[0]!.questions[0]!.question = 'Quand partez-vous en mission ?'
    await saveInterviewWorkingCopy(copy, deps)
    expect(deps.copies[0]?.sections[0]?.questions[0]?.question).toBe(
      'Quand partez-vous en mission ?',
    )
    expect(deps.published[0]?.version).toBe(1)
    expect(deps.published[0]?.sections[0]?.questions[0]?.question).toContain('disponible')
  })
})
