import type { PrismaClient } from '@prisma/client'
import type { ActivitePeriod } from '@/view-models/activite-period'
import type { ActiviteOverview } from '@/view-models/activite-overview'
import { buildActiviteSeries } from '@/view-models/activite-series'
import { loadActiviteDateBags } from './activite-dates'
import { NOT_DELETED } from './soft-delete'

export async function loadActiviteOverview(
  db: PrismaClient,
  period: ActivitePeriod,
): Promise<ActiviteOverview> {
  const r = { gte: period.fromInclusive, lt: period.toExclusive }
  const soft = NOT_DELETED
  const [
    candidatesCrm,
    candidatesApp,
    appValidated,
    qualifies,
    applications,
    missionsCreated,
    missionsFilled,
    badakanCreated,
    badakanStaffed,
  ] = await Promise.all([
    db.candidate.count({ where: { ...soft, origin: 'CRM', createdAt: r } }),
    db.candidate.count({ where: { ...soft, origin: 'APP', createdAt: r } }),
    db.candidate.count({ where: { ...soft, badakanValidatedAt: r } }),
    db.candidate.count({ where: { ...soft, qualifiedAt: r } }),
    db.application.count({ where: { deletedAt: null, createdAt: r } }),
    db.mission.count({ where: { ...soft, createdAt: r } }),
    db.mission.count({ where: { ...soft, pourvuAt: r } }),
    db.badakanMission.count({ where: { createdAt: r } }),
    db.badakanMission.count({ where: { staffedAt: r } }),
  ])
  const bags = await loadActiviteDateBags(db, period)
  const series = buildActiviteSeries(period, bags)
  return {
    fromYmd: period.fromYmd,
    toYmd: period.toYmd,
    counts: {
      candidatesCrm,
      candidatesApp,
      appValidated,
      qualifies,
      applications,
      missionsCreated,
      missionsFilled,
      badakanCreated,
      badakanStaffed,
    },
    ...series,
  }
}
