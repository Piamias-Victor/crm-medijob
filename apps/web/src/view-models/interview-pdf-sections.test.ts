import { describe, expect, it } from 'vitest'
import { buildInterviewPdfModel } from '@/view-models/interview-pdf-sections'
import type { InterviewPdfInput } from '@/view-models/interview-pdf-model'

const base: InterviewPdfInput = {
  candidateName: 'Ada Lovelace',
  jobTitle: 'Pharmacien',
  city: '',
  referentName: '',
  modeLabel: 'Intérim',
  dateLabel: '18/08/2026',
  decision: 'ELIGIBLE',
  decisionLabel: 'Éligible',
  scores: { B1: 12 },
  scoreMax: { B1: 24 },
  mapping: {},
  answers: { questions: { q1: { choiceLabel: 'Oui' }, q2: { choiceLabel: '' } }, checklist: {} },
  sections: [
    { id: 's1', title: 'Accueil', questions: [{ id: 'q1', question: 'Dispo ?' }] },
    { id: 's2', title: 'Vide', questions: [{ id: 'q2', question: 'Skip' }] },
  ],
  checklistItems: [
    { id: 'cv', label: 'CV' },
    { id: 'id_doc', label: 'Pièce d’identité' },
  ],
}

describe('buildInterviewPdfModel', () => {
  it('omits empty identity fields, mapping, checklist and unanswered sections', () => {
    const model = buildInterviewPdfModel(base)
    expect(model.hero.candidateName).toBe('Ada Lovelace')
    expect(model.sections.map((section) => section.key)).toEqual(['identity', 'decision', 'scores', 's1'])
    const identity = model.sections.find((section) => section.key === 'identity')
    expect(identity?.kind === 'kv' ? identity.rows.map((row) => row.label) : []).toEqual(['Métier'])
    const answers = model.sections.find((section) => section.key === 's1')
    expect(answers?.kind === 'answers' ? answers.rows[0]?.answer : null).toBe('Oui')
  })

  it('includes checklist only when at least one item is checked', () => {
    const model = buildInterviewPdfModel({
      ...base,
      answers: { questions: {}, checklist: { cv: true } },
      sections: [],
      scores: {},
    })
    const checklist = model.sections.find((section) => section.kind === 'checklist')
    expect(checklist?.kind === 'checklist' ? checklist.rows.map((row) => row.label) : []).toEqual([
      'CV',
      'Pièce d’identité',
    ])
  })
})
