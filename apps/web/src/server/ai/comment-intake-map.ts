import { matchJobTitles } from '@/server/ai/job-title-match'

export type RefOption = { id: string; name: string }
export type SoftwareOption = RefOption

export type CommentIntakeRefs = {
  softwares: RefOption[]
  jobTitles: RefOption[]
}

export function matchSoftwareIds(names: string[], options: RefOption[]): string[] {
  const ids: string[] = []
  for (const name of names) {
    const hit = matchJobTitles(name, options, 1)[0]
    if (hit && !ids.includes(hit.id)) ids.push(hit.id)
  }
  return ids
}

export function matchJobTitleId(
  label: string | undefined,
  options: RefOption[],
): string | undefined {
  if (!label) return undefined
  return matchJobTitles(label, options, 1)[0]?.id
}
