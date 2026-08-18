import { interviewCriterionLabel } from '@/view-models/interview-criteria-labels'

export type InterviewScoreGroup = 'B' | 'C' | 'other'

export type InterviewScoreRowVm = {
  id: string
  label: string
  earned: number
  max: number
  group: InterviewScoreGroup
}

function groupFor(id: string): InterviewScoreGroup {
  if (id.startsWith('C')) return 'C'
  if (id.startsWith('B')) return 'B'
  return 'other'
}

export function interviewScorePercent(earned: number, max: number): number {
  if (max <= 0) return 0
  return Math.round((Math.min(earned, max) / max) * 100)
}

export function interviewScoreRows(
  scores: Record<string, number>,
  maxes: Record<string, number>,
): InterviewScoreRowVm[] {
  return Object.keys(scores)
    .sort()
    .map((id) => ({
      id,
      label: interviewCriterionLabel(id),
      earned: scores[id] ?? 0,
      max: maxes[id] ?? 0,
      group: groupFor(id),
    }))
}
