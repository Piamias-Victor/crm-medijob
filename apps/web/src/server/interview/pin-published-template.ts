import type { InterviewMode } from '@prisma/client'
import {
  INTERVIEW_GENERIC_PROFILE_KEY,
  resolveInterviewProfileKey,
} from '@/view-models/interview-profile-key'

export type PinPublishedTemplateDeps = {
  findCandidateProfileKey: (candidateId: string) => Promise<string | null>
  findPublishedTemplate: (
    profileKey: string,
    mode: InterviewMode,
  ) => Promise<{ id: string } | null>
  isPairArchived: (profileKey: string, mode: InterviewMode) => Promise<boolean>
}

export async function pinPublishedTemplateId(
  candidateId: string,
  mode: InterviewMode,
  deps: PinPublishedTemplateDeps,
) {
  const dedicated = await deps.findCandidateProfileKey(candidateId)
  const archived = dedicated ? await deps.isPairArchived(dedicated, mode) : false
  const profileKey =
    !dedicated || archived
      ? INTERVIEW_GENERIC_PROFILE_KEY
      : resolveInterviewProfileKey(dedicated)
  const published = await deps.findPublishedTemplate(profileKey, mode)
  return published?.id ?? null
}
