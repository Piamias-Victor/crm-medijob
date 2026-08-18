import type { InterviewPdfInput } from '@/view-models/interview-pdf-model'

export const interviewPdfInputFixture: InterviewPdfInput = {
  candidateName: 'Ada Lovelace',
  jobTitle: 'Pharmacien',
  city: 'Lyon',
  referentName: 'Camille Recrute',
  modeLabel: 'Intérim',
  dateLabel: '18/08/2026',
  decision: 'ELIGIBLE',
  decisionLabel: 'Éligible',
  scores: { B1: 12, C1: 8 },
  scoreMax: { B1: 24, C1: 10 },
  mapping: { salaryExpectations: '3800 brut', contractTypes: ['INTERIM'] },
  answers: {
    questions: { q1: { choiceLabel: 'Oui', note: 'Dispo lundi' }, q2: { choiceLabel: '' } },
    checklist: { cv: true },
  },
  sections: [
    { id: 's1', title: 'Accueil', questions: [{ id: 'q1', question: 'Disponible ?' }] },
    { id: 's2', title: 'Vide', questions: [{ id: 'q2', question: 'Skip' }] },
  ],
  checklistItems: [
    { id: 'cv', label: 'CV' },
    { id: 'id_doc', label: 'Pièce d’identité' },
  ],
}
