import {
  INTERVIEW_DECISION_TITLE,
  INTERVIEW_MAPPING_TITLE,
  INTERVIEW_START_SECTION,
} from '@/view-models/interview-copy'
import type { InterviewPdfInput, InterviewPdfModel, InterviewPdfSection } from '@/view-models/interview-pdf-model'
import {
  checklistSection,
  identityRows,
  mappingRows,
  scoreSection,
  trameSections,
} from '@/view-models/interview-pdf-section-rows'

export type { InterviewPdfInput }

function kv(key: string, title: string, rows: { label: string; value: string }[]): InterviewPdfSection[] {
  return rows.length ? [{ key, title, kind: 'kv', rows }] : []
}

export function buildInterviewPdfModel(input: InterviewPdfInput): InterviewPdfModel {
  return {
    hero: {
      candidateName: input.candidateName,
      modeLabel: input.modeLabel,
      dateLabel: input.dateLabel,
      decisionLabel: input.decisionLabel,
      decision: input.decision,
    },
    sections: [
      ...kv('identity', INTERVIEW_START_SECTION, identityRows(input)),
      ...kv('decision', INTERVIEW_DECISION_TITLE, [{ label: INTERVIEW_DECISION_TITLE, value: input.decisionLabel }]),
      ...scoreSection(input.scores, input.scoreMax),
      ...kv('mapping', INTERVIEW_MAPPING_TITLE, mappingRows(input.mapping)),
      ...checklistSection(input),
      ...trameSections(input),
    ],
  }
}
