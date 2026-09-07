import { resolveJobTitleId, type ReferentialEntry } from '@/server/badakan/resolve-referential'

export function jobTitleIdFromActivity(
  activityLabel: string | null | undefined,
  jobTitles: ReferentialEntry[],
) {
  return resolveJobTitleId(activityLabel, jobTitles)
}

function unknownJobTitleId(jobTitles: ReferentialEntry[]) {
  return (
    jobTitles.find((row) => row.name.localeCompare('Autre', 'fr', { sensitivity: 'accent' }) === 0)
      ?.id ?? null
  )
}

export function jobTitleIdForAppCreate(
  activityLabel: string | null | undefined,
  jobTitles: ReferentialEntry[],
  fromComments?: string | null,
) {
  return (
    jobTitleIdFromActivity(activityLabel, jobTitles) ?? fromComments ?? unknownJobTitleId(jobTitles)
  )
}
