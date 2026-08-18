import { describe, expect, it } from 'vitest'
import { closeInterview } from '@/server/interview/close'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'

const availabilityQuestion = {
  id: 'old_q',
  question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
}

describe('closeInterview pin', () => {
  it('maps answers using the pinned trame questions', async () => {
    const deps = memoryCloseDeps({
      templateId: 'tpl-v1',
      answers: { questions: { old_q: { choiceLabel: '2026-09-01' } }, checklist: {} },
    })
    deps.findTemplateQuestions = async (interview) =>
      interview.templateId === 'tpl-v1' ? [availabilityQuestion] : []
    await closeInterview({ id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE' }, 'u1', deps)
    expect(deps.candidate.availableFrom).toEqual(new Date('2026-09-01'))
  })
})
