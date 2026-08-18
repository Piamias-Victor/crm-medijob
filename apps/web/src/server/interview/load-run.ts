import { parseInterviewAnswers } from '@/view-models/interview-draft.schema'
import { INTERVIEW_CHECKLIST_ITEMS } from '@/view-models/interview-checklist'
import { parseInterviewSections } from '@/view-models/interview-template'
import { toInterviewListRow, type InterviewRecord } from '@/view-models/interview-list'
import type { InterviewRun } from '@/view-models/interview-run'
import {
  resolveInterviewTemplate,
  type ResolveInterviewTemplateDeps,
} from '@/server/interview/resolve-interview-template'

export type { InterviewTemplateLookup } from '@/server/interview/resolve-interview-template'

export type LoadInterviewRunDeps = {
  findById: (id: string) => Promise<InterviewRecord | null>
} & ResolveInterviewTemplateDeps

export async function loadInterviewRun(id: string, deps: LoadInterviewRunDeps): Promise<InterviewRun | null> {
  const row = await deps.findById(id)
  if (!row) return null
  const template = await resolveInterviewTemplate(row, deps)
  return {
    ...toInterviewListRow(row),
    candidateId: row.candidateId,
    answers: parseInterviewAnswers(row.answers),
    sections: parseInterviewSections(template?.sections),
    checklistItems: INTERVIEW_CHECKLIST_ITEMS.map((item) => ({ ...item })),
    templateLabel: template?.label ?? '',
  }
}
