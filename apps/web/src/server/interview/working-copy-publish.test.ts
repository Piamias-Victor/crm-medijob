import { describe, expect, it } from 'vitest'
import { getInterviewWorkingCopy, saveInterviewWorkingCopy } from '@/server/interview/working-copy'
import { publishInterviewWorkingCopy } from '@/server/interview/working-copy-publish'
import { memoryTemplateAdminDeps } from '@/server/interview/working-copy.test.fixtures'
import { INTERVIEW_TEMPLATE_DUPLICATE_MAPPING } from '@/view-models/interview-template-admin-copy'

const availabilityQuestion = {
  id: 'q1',
  question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
  suggestedAnswers: [{ label: 'Immédiate', text: 'Dispo.', points: 12, tone: 'excellent' }],
}

function seed(questions = [availabilityQuestion]) {
  return memoryTemplateAdminDeps([
    {
      profileKey: 'pharmacien',
      mode: 'INTERIM',
      version: 1,
      label: 'Pharmacien(ne)',
      sections: [{ id: 'dispo', title: 'Dispo', questions }],
    },
  ])
}

describe('publishInterviewWorkingCopy', () => {
  it('creates version N+1 and leaves the pinned published row unchanged', async () => {
    const deps = seed()
    const copy = await getInterviewWorkingCopy('pharmacien', 'INTERIM', deps)
    copy.sections[0]!.questions[0]!.question = 'Date de disponibilité ?'
    await saveInterviewWorkingCopy(copy, deps)
    const published = await publishInterviewWorkingCopy('pharmacien', 'INTERIM', deps)
    expect(published.version).toBe(2)
    expect(deps.published[0]?.version).toBe(1)
    expect(deps.published[0]?.sections[0]?.questions[0]?.question).toContain('disponible')
    expect(deps.published[1]?.sections[0]?.questions[0]?.question).toBe('Date de disponibilité ?')
  })

  it('rejects publish when two questions share the same unique mapping', async () => {
    const deps = seed([
      availabilityQuestion,
      { ...availabilityQuestion, id: 'q2', question: 'Seconde question.' },
    ])
    const copy = await getInterviewWorkingCopy('pharmacien', 'INTERIM', deps)
    copy.sections[0]!.questions[0]!.mapping = 'availability'
    copy.sections[0]!.questions[1]!.mapping = 'availability'
    await saveInterviewWorkingCopy(copy, deps)
    await expect(publishInterviewWorkingCopy('pharmacien', 'INTERIM', deps)).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: INTERVIEW_TEMPLATE_DUPLICATE_MAPPING,
    })
    expect(deps.published).toHaveLength(1)
  })

  it('allows several questions mapped to none', async () => {
    const deps = seed([
      { ...availabilityQuestion, id: 'q1', question: 'A ?' },
      { ...availabilityQuestion, id: 'q2', question: 'B ?' },
    ])
    const copy = await getInterviewWorkingCopy('pharmacien', 'INTERIM', deps)
    copy.sections[0]!.questions[0]!.mapping = 'none'
    copy.sections[0]!.questions[1]!.mapping = 'none'
    await saveInterviewWorkingCopy(copy, deps)
    await expect(publishInterviewWorkingCopy('pharmacien', 'INTERIM', deps)).resolves.toMatchObject({
      version: 2,
    })
  })
})
