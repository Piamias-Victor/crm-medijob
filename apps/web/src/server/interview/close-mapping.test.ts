import { describe, expect, it } from 'vitest'
import { closeInterview } from '@/server/interview/close'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'

describe('closeInterview mapping edits', () => {
  it('writes the recruiter-edited salary instead of the chip label', async () => {
    const deps = memoryCloseDeps(
      { answers: { questions: { qPay: { choiceLabel: 'Coeff CCN' } }, checklist: {} } },
      {},
      [
        {
          id: 'qPay',
          question:
            'Quelles sont vos attentes salariales détaillées (fixe, variable, coefficient CCN, avantages) ?',
        },
      ],
    )
    await closeInterview(
      {
        id: 'i1',
        scores: { B1: 12 },
        decision: 'ELIGIBLE',
        mappingEdits: { salaryExpectations: '3800 brut' },
        overwriteFields: ['salaryExpectations'],
      },
      'u1',
      deps,
    )
    expect(deps.candidate.salaryExpectations).toBe('3800 brut')
  })
})
