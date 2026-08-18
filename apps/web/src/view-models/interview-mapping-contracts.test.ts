import { describe, expect, it } from 'vitest'
import { diffInterviewMapping } from '@/view-models/interview-mapping'

const emptyProfile = {
  availableFrom: null as Date | null,
  mobilityRadiusKm: null as number | null,
  salaryExpectations: null as string | null,
  notes: null as string | null,
  softwareNames: [] as string[],
  contractTypes: [] as string[],
}

const answers = { questions: { q1: { choiceLabel: 'Oui' } }, checklist: {} }

describe('diffInterviewMapping contracts', () => {
  it('writes contract types when a question maps to contracts', () => {
    const diffs = diffInterviewMapping(answers, emptyProfile, {
      mode: 'INTERIM',
      questions: [{ id: 'q1', question: 'Contrats ?', mapping: 'contracts' }],
    })
    expect(diffs).toContainEqual(expect.objectContaining({ field: 'contractTypes', next: ['INTERIM'] }))
  })

  it('skips contract types when explicit mappings omit contracts', () => {
    const diffs = diffInterviewMapping(answers, emptyProfile, {
      mode: 'INTERIM',
      questions: [{ id: 'q1', question: 'Motivation ?', mapping: 'none' }],
    })
    expect(diffs.some((diff) => diff.field === 'contractTypes')).toBe(false)
  })
})
