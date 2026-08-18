import { describe, expect, it } from 'vitest'
import { loadInterviewPdfSnapshot } from '@/server/interview/load-interview-pdf'
import type { InterviewPdfLoadRow } from '@/server/interview/load-interview-pdf'
import type { InterviewPdfIdentity } from '@/view-models/interview-pdf-snapshot'

const closed: InterviewPdfLoadRow = {
  id: 'i1',
  candidateId: 'c1',
  referentId: null,
  status: 'CLOSED',
  mode: 'INTERIM',
  decision: 'ELIGIBLE',
  createdAt: new Date('2026-08-17T10:00:00Z'),
  answers: {},
  scores: {},
  templateId: 'tpl-v1',
}

const identity: Omit<InterviewPdfIdentity, 'referentName'> = {
  firstName: 'Camille',
  lastName: 'Durand',
  city: null,
  jobTitleName: 'Pharmacien',
  availableFrom: null,
  mobilityRadiusKm: null,
  salaryExpectations: null,
  notes: null,
  softwareNames: [],
  contractTypes: [],
}

const pinnedSections = [
  {
    id: 's1',
    title: 'Ancienne grille',
    questions: [{ id: 'old_q', question: 'Question v1 ?', suggestedAnswers: [{ label: 'Oui', text: 'Oui' }] }],
  },
]

const latestSections = [
  {
    id: 's1',
    title: 'Nouvelle grille',
    questions: [{ id: 'new_q', question: 'Question v2 ?', suggestedAnswers: [{ label: 'Oui', text: 'Oui' }] }],
  },
]

describe('loadInterviewPdfSnapshot pin', () => {
  it('uses pinned trame sections when a newer version exists', async () => {
    const snapshot = await loadInterviewPdfSnapshot('i1', {
      findInterview: async () => closed,
      findIdentity: async () => identity,
      findReferentName: async () => null,
      findTemplateSections: async (row) =>
        row.templateId === 'tpl-v1' ? pinnedSections : latestSections,
    })
    expect(snapshot?.input?.sections[0]?.questions[0]?.id).toBe('old_q')
  })
})
