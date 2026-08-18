import { parseInterviewAnswers } from '@/view-models/interview-draft.schema'
import { INTERVIEW_CHECKLIST_ITEMS } from '@/view-models/interview-checklist'
import { INTERVIEW_DECISION_LABELS, INTERVIEW_MODE_LABELS } from '@/view-models/interview-labels'
import { interviewCriterionMaxes } from '@/view-models/interview-criterion-maxes'
import { parseScoringCatalog } from '@/view-models/interview-scoring-parse'
import { parseInterviewSections } from '@/view-models/interview-template'
import type { InterviewPdfDecision, InterviewPdfInput } from '@/view-models/interview-pdf-model'

export type InterviewPdfRow = {
  status: 'DRAFT' | 'CLOSED'
  mode: 'INTERIM' | 'CDD_CDI'
  decision: InterviewPdfDecision | null
  createdAt: Date
  answers: unknown
  scores: unknown
}

export type InterviewPdfIdentity = {
  firstName: string
  lastName: string
  city: string | null
  jobTitleName: string | null
  referentName: string | null
  availableFrom: Date | null
  mobilityRadiusKm: number | null
  salaryExpectations: string | null
  notes: string | null
  softwareNames: string[]
  contractTypes: string[]
}

export function parseInterviewScores(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(
      (entry): entry is [string, number] => typeof entry[1] === 'number',
    ),
  )
}

export function toInterviewPdfInput(
  row: InterviewPdfRow,
  identity: InterviewPdfIdentity,
  templateSections: unknown,
): InterviewPdfInput | null {
  if (row.status !== 'CLOSED' || !row.decision) return null
  const catalog = parseScoringCatalog(templateSections)
  return {
    candidateName: `${identity.firstName} ${identity.lastName}`.trim(),
    jobTitle: identity.jobTitleName,
    city: identity.city,
    referentName: identity.referentName,
    modeLabel: INTERVIEW_MODE_LABELS[row.mode],
    dateLabel: row.createdAt.toLocaleDateString('fr-FR'),
    decision: row.decision,
    decisionLabel: INTERVIEW_DECISION_LABELS[row.decision],
    scores: parseInterviewScores(row.scores),
    scoreMax: interviewCriterionMaxes(catalog),
    mapping: {
      availableFrom: identity.availableFrom,
      mobilityRadiusKm: identity.mobilityRadiusKm,
      salaryExpectations: identity.salaryExpectations,
      notes: identity.notes,
      softwareNames: identity.softwareNames,
      contractTypes: identity.contractTypes,
    },
    answers: parseInterviewAnswers(row.answers),
    sections: parseInterviewSections(templateSections),
    checklistItems: INTERVIEW_CHECKLIST_ITEMS.map((item) => ({ ...item })),
  }
}
