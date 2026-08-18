// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { mockProvider } from '@/server/ai/mock-provider'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'
import { suggestInterviewCvSummary } from '@/server/interview/suggest-cv-summary'

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

describe('suggestInterviewCvSummary', () => {
  it('returns a validated cvSummary from mock using interview answers', async () => {
    const memory = memoryCloseDeps(
      { answers: { questions: { q1: { choiceLabel: '5 ans hopital' } }, checklist: {} } },
      { jobTitleName: 'Pharmacien', softwareNames: ['Winpharma'] },
    )
    const result = await suggestInterviewCvSummary('i1', {
      findById: memory.findById,
      findCandidate: memory.findCandidate,
      findTemplateSections: async () => sections,
      provider: mockProvider,
    })
    expect(result.cvSummary).toContain('5 ans hopital')
    expect(result.cvSummary).toContain('Pharmacien')
    expect(memory.candidate.cvSummary).toBeNull()
  })

  it('rejects an invalid AI payload without writing cvSummary', async () => {
    const memory = memoryCloseDeps()
    await expect(
      suggestInterviewCvSummary('i1', {
        findById: memory.findById,
        findCandidate: memory.findCandidate,
        findTemplateSections: async () => sections,
        provider: { complete: async () => '{"nope":true}' },
      }),
    ).rejects.toThrow()
    expect(memory.candidate.cvSummary).toBeNull()
  })
})
