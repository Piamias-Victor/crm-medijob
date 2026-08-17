import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'
import type { InterviewListRow } from '@/view-models/interview-list'
import type { InterviewRunSection } from '@/view-models/interview-template'

export type InterviewRun = InterviewListRow & {
  candidateId: string
  answers: InterviewDraftAnswers
  sections: InterviewRunSection[]
  checklistItems: { id: string; label: string }[]
  templateLabel: string
}

export function toInterviewRunFormValues(run: InterviewRun): InterviewDraftAnswers {
  return {
    questions: run.answers.questions,
    checklist: Object.fromEntries(
      run.checklistItems.map((item) => [item.id, run.answers.checklist[item.id] ?? false]),
    ),
  }
}

export function checklistSelectedIds(checklist: Record<string, boolean>): string[] {
  return Object.entries(checklist)
    .filter(([, checked]) => checked)
    .map(([id]) => id)
}

export function checklistFromSelectedIds(
  items: { id: string }[],
  selected: string[],
): Record<string, boolean> {
  return Object.fromEntries(items.map((item) => [item.id, selected.includes(item.id)]))
}
