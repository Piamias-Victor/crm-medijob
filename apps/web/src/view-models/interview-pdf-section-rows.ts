import { interviewScorePercent, interviewScoreRows } from '@/view-models/interview-score-rows'
import { INTERVIEW_CHECKLIST_TITLE, INTERVIEW_SCORES_TITLE } from '@/view-models/interview-copy'
import {
  formatMappingValue,
  INTERVIEW_MAPPING_FIELD_LABELS,
} from '@/view-models/interview-mapping-labels'
import { isMappingEmpty, type InterviewMappingField } from '@/view-models/interview-mapping-types'
import type { InterviewPdfInput, InterviewPdfSection } from '@/view-models/interview-pdf-model'

export function text(value: string | null | undefined) {
  const next = value?.trim() ?? ''
  return next.length ? next : null
}

export function identityRows(input: InterviewPdfInput) {
  return [
    { label: 'Métier', value: text(input.jobTitle) },
    { label: 'Ville', value: text(input.city) },
    { label: 'Référent', value: text(input.referentName) },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))
}

export function mappingRows(mapping: Record<string, unknown>) {
  return (Object.entries(mapping) as [InterviewMappingField, unknown][])
    .filter(([, value]) => !isMappingEmpty(value))
    .map(([field, value]) => ({
      label: INTERVIEW_MAPPING_FIELD_LABELS[field] ?? field,
      value: formatMappingValue(value),
    }))
    .filter((row) => row.value !== '—')
}

export function scoreSection(scores: Record<string, number>, scoreMax: Record<string, number>): InterviewPdfSection[] {
  const rows = interviewScoreRows(scores, scoreMax).map((row) => ({
    label: row.label,
    earned: row.earned,
    max: row.max,
    percent: interviewScorePercent(row.earned, row.max),
  }))
  return rows.length ? [{ key: 'scores', title: INTERVIEW_SCORES_TITLE, kind: 'scores', rows }] : []
}

export function checklistSection(input: InterviewPdfInput): InterviewPdfSection[] {
  const rows = input.checklistItems.map((item) => ({
    label: item.label,
    checked: input.answers.checklist[item.id] === true,
  }))
  if (!rows.some((row) => row.checked)) return []
  return [{ key: 'checklist', title: INTERVIEW_CHECKLIST_TITLE, kind: 'checklist', rows }]
}

export function trameSections(input: InterviewPdfInput): InterviewPdfSection[] {
  return input.sections.flatMap((section) => {
    const rows = section.questions.flatMap((question) => {
      const choice = text(input.answers.questions[question.id]?.choiceLabel)
      const note = text(input.answers.questions[question.id]?.note)
      if (!choice && !note) return []
      return [{ question: question.question, answer: choice ?? note ?? '', note: choice && note ? note : undefined }]
    })
    return rows.length ? [{ key: section.id, title: section.title, kind: 'answers' as const, rows }] : []
  })
}
