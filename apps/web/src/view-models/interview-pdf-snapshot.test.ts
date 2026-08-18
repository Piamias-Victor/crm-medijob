import { describe, expect, it } from 'vitest'
import { toInterviewPdfInput } from '@/view-models/interview-pdf-snapshot'

const identity = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  city: 'Lyon',
  jobTitleName: 'Pharmacien',
  referentName: 'Camille',
  availableFrom: null,
  mobilityRadiusKm: 30,
  salaryExpectations: null,
  notes: null,
  softwareNames: [],
  contractTypes: ['INTERIM'] as string[],
}

describe('toInterviewPdfInput', () => {
  it('builds a compte-rendu snapshot from a CLOSED interview', () => {
    const input = toInterviewPdfInput(
      {
        status: 'CLOSED',
        mode: 'INTERIM',
        decision: 'ELIGIBLE',
        createdAt: new Date('2026-08-18T10:00:00Z'),
        answers: { questions: { q1: { choiceLabel: 'Oui' } }, checklist: {} },
        scores: { B1: 12 },
      },
      identity,
      [{ questions: [{ id: 'q1', question: 'Dispo ?', suggestedAnswers: [] }] }],
    )
    expect(input?.candidateName).toBe('Ada Lovelace')
    expect(input?.decisionLabel).toBe('Éligible')
    expect(input?.scores).toEqual({ B1: 12 })
    expect(input?.mapping.mobilityRadiusKm).toBe(30)
  })

  it('returns null for a DRAFT interview', () => {
    expect(
      toInterviewPdfInput(
        {
          status: 'DRAFT',
          mode: 'INTERIM',
          decision: null,
          createdAt: new Date(),
          answers: {},
          scores: {},
        },
        identity,
        [],
      ),
    ).toBeNull()
  })
})
