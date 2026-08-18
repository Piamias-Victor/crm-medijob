import { describe, expect, it } from 'vitest'
import { closeInterview } from '@/server/interview/close'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'

describe('closeInterview cvSummary', () => {
  it('persists cvSummary on close without calling AI', async () => {
    const deps = memoryCloseDeps({}, { cvSummary: 'Ancien résumé' })
    await closeInterview(
      {
        id: 'i1',
        scores: { B1: 12 },
        decision: 'ELIGIBLE',
        cvSummary: '## Pharmacien\n\nSynthèse entretien.',
      },
      'u1',
      deps,
    )
    expect(deps.candidate.cvSummary).toBe('## Pharmacien\n\nSynthèse entretien.')
  })

  it('leaves cvSummary unchanged when close omits it', async () => {
    const deps = memoryCloseDeps({}, { cvSummary: 'Ancien résumé' })
    await closeInterview({ id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE' }, 'u1', deps)
    expect(deps.candidate.cvSummary).toBe('Ancien résumé')
  })
})
