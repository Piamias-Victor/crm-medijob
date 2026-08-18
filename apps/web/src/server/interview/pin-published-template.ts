import type { InterviewMode } from '@prisma/client'
import { resolveInterviewProfileKey } from '@/view-models/interview-profile-key'

export type PinPublishedTemplateDeps = {
  findCandidateProfileKey: (candidateId: string) => Promise<string | null>
  findPublishedTemplate: (
    profileKey: string,
    mode: InterviewMode,
  ) => Promise<{ id: string } | null>
}

export async function pinPublishedTemplateId(
  candidateId: string,
  mode: InterviewMode,
  deps: PinPublishedTemplateDeps,
) {
  const profileKey = resolveInterviewProfileKey(await deps.findCandidateProfileKey(candidateId))
  const published = await deps.findPublishedTemplate(profileKey, mode)
  return published?.id ?? null
}
