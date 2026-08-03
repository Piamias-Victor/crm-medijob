import { isoWeekRangeParis } from '@/server/ai/week-report-range'

export type WeekReportRangeInput = {
  referentId: string
  from: Date
  to: Date
}

export type WeekReportCountsLoader = {
  countOpenMissions: (input: { referentId: string }) => Promise<number>
  countFilledMissions: (input: WeekReportRangeInput) => Promise<number>
  countCandidatesContacted: (input: WeekReportRangeInput) => Promise<number>
  countApplicationsReceived: (input: WeekReportRangeInput) => Promise<number>
  countOffersPublished: (input: WeekReportRangeInput) => Promise<number>
  countCommercialActions: (input: WeekReportRangeInput) => Promise<number>
}

export type WeekReportStats = WeekReportRangeInput & {
  missionsOpen: number
  missionsFilled: number
  candidatesContacted: number
  applicationsReceived: number
  offersPublished: number
  commercialActions: number
}

export async function assembleWeekReportStats(
  loader: WeekReportCountsLoader,
  input: { referentId: string; now: Date },
): Promise<WeekReportStats> {
  const { from, to } = isoWeekRangeParis(input.now)
  const range: WeekReportRangeInput = { referentId: input.referentId, from, to }

  const [
    missionsOpen,
    missionsFilled,
    candidatesContacted,
    applicationsReceived,
    offersPublished,
    commercialActions,
  ] = await Promise.all([
    loader.countOpenMissions({ referentId: input.referentId }),
    loader.countFilledMissions(range),
    loader.countCandidatesContacted(range),
    loader.countApplicationsReceived(range),
    loader.countOffersPublished(range),
    loader.countCommercialActions(range),
  ])

  return {
    ...range,
    missionsOpen,
    missionsFilled,
    candidatesContacted,
    applicationsReceived,
    offersPublished,
    commercialActions,
  }
}
