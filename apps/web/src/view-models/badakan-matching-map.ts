import type { MatchingMissionContext } from '@/server/ai/matching-score'
import type { PeriodLike } from '@/view-models/badakan-mission-periods'

export type BadakanMatchingSource = {
  jobTitleId: string | null
  jobTitleName: string | null
  pharmacyName: string
  city: string | null
  postalCode: string | null
  softwareName: string | null
  activityLabel: string | null
  periods: PeriodLike[]
}

function firstStart(periods: PeriodLike[]): Date | null {
  for (const period of periods) {
    if (!period.start) continue
    const date = new Date(period.start)
    if (!Number.isNaN(date.getTime())) return date
  }
  return null
}

export function toMatchingMissionFromBadakan(
  row: BadakanMatchingSource,
): MatchingMissionContext | null {
  if (!row.jobTitleId) return null
  const startDate = firstStart(row.periods)
  if (!startDate) return null
  const titleBase = row.activityLabel ?? row.jobTitleName ?? 'Mission intérim'
  return {
    jobTitleId: row.jobTitleId,
    contractType: 'INTERIM',
    startDate,
    pharmacyCity: row.city,
    pharmacyPostalCode: row.postalCode,
    title: `${titleBase} — ${row.pharmacyName}`,
    jobTitleName: row.jobTitleName ?? titleBase,
    pharmacyName: row.pharmacyName,
    description: row.softwareName ? `LGO : ${row.softwareName}` : null,
  }
}
