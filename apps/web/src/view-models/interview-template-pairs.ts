import type { InterviewMode } from '@prisma/client'

export type InterviewTemplatePairStatus = {
  profileKey: string
  mode: InterviewMode
  archived: boolean
}

export function mergeInterviewTemplatePairs(
  published: { profileKey: string; mode: InterviewMode }[],
  copies: { profileKey: string; mode: InterviewMode; archivedAt: Date | null }[],
): InterviewTemplatePairStatus[] {
  const pairs = new Map<string, InterviewTemplatePairStatus>()
  for (const row of published) {
    pairs.set(`${row.profileKey}:${row.mode}`, {
      profileKey: row.profileKey,
      mode: row.mode,
      archived: false,
    })
  }
  for (const row of copies) {
    pairs.set(`${row.profileKey}:${row.mode}`, {
      profileKey: row.profileKey,
      mode: row.mode,
      archived: row.archivedAt != null,
    })
  }
  return [...pairs.values()]
}
