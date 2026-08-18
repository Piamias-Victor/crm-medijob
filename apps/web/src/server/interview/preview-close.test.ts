import { describe, expect, it } from 'vitest'
import { previewInterviewClose } from '@/server/interview/preview-close'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'

const sections = [
  {
    questions: [
      {
        id: 'q1',
        question: 'Expérience ?',
        mainCritere: 'B1',
        suggestedAnswers: [
          { label: 'Fort', points: 10, tone: 'excellent' },
          { label: 'Faible', points: 0, tone: 'weak' },
        ],
      },
    ],
  },
]

describe('previewInterviewClose', () => {
  it('prefills scores and ELIGIBLE from answers', async () => {
    const memory = memoryCloseDeps({
      answers: { questions: { q1: { choiceLabel: 'Fort' } }, checklist: {} },
    })
    const preview = await previewInterviewClose('i1', {
      findById: memory.findById,
      findCandidate: memory.findCandidate,
      findTemplateSections: async () => sections,
    })
    expect(preview?.scores).toEqual({ B1: 10 })
    expect(preview?.scoreMax).toEqual({ B1: 10 })
    expect(preview?.decision).toBe('ELIGIBLE')
    expect(preview?.proposedStatus).toBe('QUALIFIE')
  })

  it('exposes the current fiche cvSummary', async () => {
    const memory = memoryCloseDeps({}, { cvSummary: '## Pharmacien\n\nDéjà en fiche.' })
    const preview = await previewInterviewClose('i1', {
      findById: memory.findById,
      findCandidate: memory.findCandidate,
      findTemplateSections: async () => sections,
    })
    expect(preview?.cvSummary).toBe('## Pharmacien\n\nDéjà en fiche.')
  })
})
