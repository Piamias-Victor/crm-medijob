import { describe, expect, it } from 'vitest'
import { mockProvider } from '@/server/ai/mock-provider'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'
import { interviewCaller, makeInterviewDeps } from '@/server/routers/interview.test.fixtures'

const sections = [
  {
    questions: [
      {
        id: 'q1',
        question: 'Expérience ?',
        suggestedAnswers: [{ label: '5 ans hopital', points: 10, tone: 'ok' }],
      },
    ],
  },
]

function callerWithSuggest(
  memory = memoryCloseDeps(
    { answers: { questions: { q1: { choiceLabel: '5 ans hopital' } }, checklist: {} } },
    { jobTitleName: 'Pharmacien' },
  ),
  provider = mockProvider,
) {
  return {
    memory,
    caller: interviewCaller({
      ...makeInterviewDeps(),
      ...memory,
      findTemplateSections: async () => sections,
      provider,
    }),
  }
}

describe('interviewRouter suggestCvSummary', () => {
  it('returns a mock summary without writing the fiche', async () => {
    const { memory, caller } = callerWithSuggest()
    const result = await caller.suggestCvSummary({ id: 'i1' })
    expect(result.cvSummary).toContain('5 ans hopital')
    expect(memory.candidate.cvSummary).toBeNull()
  })

  it('rejects an invalid AI payload', async () => {
    const { caller } = callerWithSuggest(memoryCloseDeps(), {
      complete: async () => '{"nope":true}',
    })
    await expect(caller.suggestCvSummary({ id: 'i1' })).rejects.toMatchObject({
      message: 'Réponse IA non conforme au schéma.',
    })
  })
})
