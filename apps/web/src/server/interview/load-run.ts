import { parseInterviewAnswers } from '@/view-models/interview-draft.schema'
import { INTERVIEW_CHECKLIST_ITEMS } from '@/view-models/interview-checklist'
import { resolveInterviewProfileKey } from '@/view-models/interview-profile-key'
import { parseInterviewSections } from '@/view-models/interview-template'
import { toInterviewListRow, type InterviewRecord } from '@/view-models/interview-list'
import type { InterviewRun } from '@/view-models/interview-run'

export type InterviewTemplateLookup = {
  label: string
  sections: unknown
}

export type LoadInterviewRunDeps = {
  findById: (id: string) => Promise<InterviewRecord | null>
  findCandidateProfileKey: (candidateId: string) => Promise<string | null>
  findTemplate: (
    profileKey: string,
    mode: InterviewRecord['mode'],
  ) => Promise<InterviewTemplateLookup | null>
}

export async function loadInterviewRun(id: string, deps: LoadInterviewRunDeps): Promise<InterviewRun | null> {
  const row = await deps.findById(id)
  if (!row) return null
  const profileKey = resolveInterviewProfileKey(await deps.findCandidateProfileKey(row.candidateId))
  const template = await deps.findTemplate(profileKey, row.mode)
  return {
    ...toInterviewListRow(row),
    candidateId: row.candidateId,
    answers: parseInterviewAnswers(row.answers),
    sections: parseInterviewSections(template?.sections),
    checklistItems: INTERVIEW_CHECKLIST_ITEMS.map((item) => ({ ...item })),
    templateLabel: template?.label ?? '',
  }
}
