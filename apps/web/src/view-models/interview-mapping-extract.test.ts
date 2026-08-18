import { describe, expect, it } from 'vitest'
import {
  extractAvailableFrom,
  extractMobilityRadiusKm,
  extractSalaryExpectations,
  extractSoftwareNames,
} from '@/view-models/interview-mapping-extract'
import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'

const answers: InterviewDraftAnswers = {
  questions: {
    q1: { choiceLabel: '2026-09-01' },
    q2: { choiceLabel: 'Winpharma, Pharmagest' },
    q3: { choiceLabel: '30 km' },
    q4: { note: '35€/h' },
  },
  checklist: {},
}

describe('interview mapping extract', () => {
  it('reads availability from explicit mapping even if wording changed', () => {
    const date = extractAvailableFrom(answers, [
      { id: 'q1', question: 'Date de démarrage ?', mapping: 'availability' },
    ])
    expect(date).toEqual(new Date('2026-09-01T00:00:00.000Z'))
  })

  it('falls back to wording when mapping is absent', () => {
    const date = extractAvailableFrom(answers, [
      {
        id: 'q1',
        question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
      },
    ])
    expect(date).toEqual(new Date('2026-09-01T00:00:00.000Z'))
  })

  it('reads software, mobility and salary from explicit mapping', () => {
    const questions = [
      { id: 'q2', question: 'Outils ?', mapping: 'software' as const },
      { id: 'q3', question: 'Rayon ?', mapping: 'mobility' as const },
      { id: 'q4', question: 'Prétentions ?', mapping: 'salary' as const },
    ]
    expect(extractSoftwareNames(answers, questions)).toEqual(['Winpharma', 'Pharmagest'])
    expect(extractMobilityRadiusKm(answers, questions)).toBe(30)
    expect(extractSalaryExpectations(answers, questions)).toBe('35€/h')
  })
})
