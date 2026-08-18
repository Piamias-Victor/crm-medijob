import { resolveInterviewProfileKey } from '@/view-models/interview-profile-key'
import type { InterviewRecord } from '@/view-models/interview-list'

export type InterviewTemplateLookup = {
  label: string
  sections: unknown
}

export type ResolveInterviewTemplateDeps = {
  findTemplateById: (id: string) => Promise<InterviewTemplateLookup | null>
  findCandidateProfileKey: (candidateId: string) => Promise<string | null>
  findTemplate: (
    profileKey: string,
    mode: InterviewRecord['mode'],
  ) => Promise<InterviewTemplateLookup | null>
}

export async function resolveInterviewTemplate(
  row: Pick<InterviewRecord, 'candidateId' | 'mode' | 'templateId'>,
  deps: ResolveInterviewTemplateDeps,
) {
  if (row.templateId) return deps.findTemplateById(row.templateId)
  const profileKey = resolveInterviewProfileKey(await deps.findCandidateProfileKey(row.candidateId))
  return deps.findTemplate(profileKey, row.mode)
}
