import { INTERVIEW_CHECKLIST_ITEMS } from '@/view-models/interview-checklist'
import type { InterviewRun } from '@/view-models/interview-run'

export const interviewRunFixture: InterviewRun = {
  id: 'i1',
  candidateId: 'c1',
  status: 'DRAFT',
  statusLabel: 'Brouillon',
  mode: 'INTERIM',
  modeLabel: 'Intérim',
  decision: null,
  decisionLabel: null,
  createdAt: new Date('2026-08-17T10:00:00Z'),
  dateLabel: '17/08/2026',
  templateLabel: 'Pharmacien(ne)',
  answers: { questions: {}, checklist: {} },
  checklistItems: INTERVIEW_CHECKLIST_ITEMS.map((item) => ({ ...item })),
  sections: [
    {
      id: 'diplome',
      title: 'Diplôme & profil',
      questions: [
        {
          id: 'pharm_q4',
          question: 'Êtes-vous inscrit(e) à l’Ordre ?',
          eliminatoire: true,
          suggestedAnswers: [
            { label: 'Non inscrit', text: 'Non inscrit à l’Ordre.' },
            { label: 'Section A', text: 'Inscrit section A.' },
          ],
        },
      ],
    },
  ],
}
