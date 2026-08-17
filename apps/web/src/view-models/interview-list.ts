import {
  INTERVIEW_DECISION_LABELS,
  INTERVIEW_MODE_LABELS,
  INTERVIEW_STATUS_LABELS,
} from '@/view-models/interview-labels'

export type InterviewRecord = {
  id: string
  status: keyof typeof INTERVIEW_STATUS_LABELS
  mode: keyof typeof INTERVIEW_MODE_LABELS
  decision: keyof typeof INTERVIEW_DECISION_LABELS | null
  createdAt: Date
}

export type InterviewListRow = {
  id: string
  status: InterviewRecord['status']
  statusLabel: string
  mode: InterviewRecord['mode']
  modeLabel: string
  decision: InterviewRecord['decision']
  decisionLabel: string | null
  createdAt: Date
  dateLabel: string
}

export function toInterviewListRow(row: InterviewRecord): InterviewListRow {
  return {
    id: row.id,
    status: row.status,
    statusLabel: INTERVIEW_STATUS_LABELS[row.status],
    mode: row.mode,
    modeLabel: INTERVIEW_MODE_LABELS[row.mode],
    decision: row.decision,
    decisionLabel: row.decision ? INTERVIEW_DECISION_LABELS[row.decision] : null,
    createdAt: row.createdAt,
    dateLabel: row.createdAt.toLocaleDateString('fr-FR'),
  }
}
