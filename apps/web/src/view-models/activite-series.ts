import { addDaysYmd, mondayOf, parisYmd } from '@/lib/paris-week'
import type { ActivitePeriod } from '@/view-models/activite-period'
import type { ActiviteSeriesPoint } from '@/view-models/activite-overview'

const Z = 0
const EMPTY: Omit<ActiviteSeriesPoint, 'label'> = {
  candidatesCrm: Z, candidatesApp: Z, appValidated: Z, qualifies: Z, applications: Z,
  missionsCreated: Z, missionsFilled: Z, badakanCreated: Z, badakanStaffed: Z,
}

export type ActiviteDateBags = {
  candidatesCrm: Date[]; candidatesApp: Date[]; appValidated: Date[]; qualifies: Date[]
  applications: Date[]; missionsCreated: Date[]; missionsFilled: Date[]
  badakanCreated: Date[]; badakanStaffed: Date[]
}

function daySpan(fromYmd: string, toYmd: string): number {
  let n = 0
  for (let y = fromYmd; y <= toYmd; y = addDaysYmd(y, 1)) n += 1
  return n
}

function bucketLabels(period: ActivitePeriod): string[] {
  const useWeek = daySpan(period.fromYmd, period.toYmd) > 90
  if (!useWeek) {
    const labels: string[] = []
    for (let y = period.fromYmd; y <= period.toYmd; y = addDaysYmd(y, 1)) labels.push(y)
    return labels
  }
  const labels: string[] = []
  for (let c = mondayOf(period.fromYmd); c <= mondayOf(period.toYmd); c = addDaysYmd(c, 7)) {
    labels.push(c)
  }
  return labels
}

export function buildActiviteSeries(period: ActivitePeriod, bags: ActiviteDateBags) {
  const useWeek = daySpan(period.fromYmd, period.toYmd) > 90
  const labels = bucketLabels(period)
  const map = new Map(labels.map((label) => [label, { label, ...EMPTY }]))
  for (const key of Object.keys(bags) as (keyof ActiviteDateBags)[]) {
    for (const date of bags[key]) {
      const row = map.get(useWeek ? mondayOf(parisYmd(date)) : parisYmd(date))
      if (row) row[key] += 1
    }
  }
  const points = labels.map((label) => map.get(label)!)
  return {
    entrants: points.map((p) => ({
      ...EMPTY, label: p.label, candidatesCrm: p.candidatesCrm, candidatesApp: p.candidatesApp,
      appValidated: p.appValidated, qualifies: p.qualifies, applications: p.applications,
    })),
    missions: points.map((p) => ({
      ...EMPTY, label: p.label, missionsCreated: p.missionsCreated, missionsFilled: p.missionsFilled,
      badakanCreated: p.badakanCreated, badakanStaffed: p.badakanStaffed,
    })),
  }
}
