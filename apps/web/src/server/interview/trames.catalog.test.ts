import { describe, expect, it } from 'vitest'
import templates from '../../../prisma/data/interview-templates.json'
import {
  INTERVIEW_PROFILE_KEYS,
  JOB_TITLE_PROFILE_KEYS,
  JOB_TITLES,
} from '../../../prisma/seed-data'

describe('Interview JobTitle labels', () => {
  it('uses the five interview profile labels plus Autre', () => {
    expect(JOB_TITLES).toEqual([
      'Pharmacien',
      'Préparateur',
      'Étudiant en pharmacie',
      'Conseiller parapharmacie',
      'Rayonniste',
      'Autre',
    ])
  })

  it('maps profileKey on JobTitle except Autre', () => {
    expect(JOB_TITLE_PROFILE_KEYS.Autre).toBeNull()
    for (const key of INTERVIEW_PROFILE_KEYS) {
      expect(Object.values(JOB_TITLE_PROFILE_KEYS)).toContain(key)
    }
  })
})

describe('Interview scored trames catalog', () => {
  it('seeds ten scored templates (five profiles × two modes)', () => {
    expect(templates).toHaveLength(10)
    for (const key of INTERVIEW_PROFILE_KEYS) {
      expect(templates.some((row) => row.profileKey === key && row.mode === 'INTERIM')).toBe(true)
      expect(templates.some((row) => row.profileKey === key && row.mode === 'CDD_CDI')).toBe(true)
    }
  })

  it('gives every template scored questions', () => {
    for (const trame of templates) {
      const questions = trame.sections.flatMap((section) => section.questions)
      expect(questions.length).toBeGreaterThan(0)
      expect(questions.every((question) => question.suggestedAnswers.length > 0)).toBe(true)
    }
  })
})
