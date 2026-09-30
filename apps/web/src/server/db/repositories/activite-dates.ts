import type { PrismaClient } from '@prisma/client'
import type { ActivitePeriod } from '@/view-models/activite-period'
import type { ActiviteDateBags } from '@/view-models/activite-series'
import { NOT_DELETED } from './soft-delete'

type Range = { gte: Date; lt: Date }

function pickDates(rows: Record<string, Date | null>[], key: string): Date[] {
  return rows.flatMap((row) => {
    const value = row[key]
    return value ? [value] : []
  })
}

export async function loadActiviteDateBags(
  db: PrismaClient,
  period: ActivitePeriod,
): Promise<ActiviteDateBags> {
  const r: Range = { gte: period.fromInclusive, lt: period.toExclusive }
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
    db.candidate.findMany({ where: { ...soft, origin: 'CRM', createdAt: r }, select: { createdAt: true } }),
    db.candidate.findMany({ where: { ...soft, origin: 'APP', createdAt: r }, select: { createdAt: true } }),
    db.candidate.findMany({ where: { ...soft, badakanValidatedAt: r }, select: { badakanValidatedAt: true } }),
    db.candidate.findMany({ where: { ...soft, qualifiedAt: r }, select: { qualifiedAt: true } }),
    db.application.findMany({ where: { deletedAt: null, createdAt: r }, select: { createdAt: true } }),
    db.mission.findMany({ where: { ...soft, createdAt: r }, select: { createdAt: true } }),
    db.mission.findMany({ where: { ...soft, pourvuAt: r }, select: { pourvuAt: true } }),
    db.badakanMission.findMany({ where: { createdAt: r }, select: { createdAt: true } }),
    db.badakanMission.findMany({ where: { staffedAt: r }, select: { staffedAt: true } }),
  ])
  return {
    candidatesCrm: pickDates(candidatesCrm, 'createdAt'),
    candidatesApp: pickDates(candidatesApp, 'createdAt'),
    appValidated: pickDates(appValidated, 'badakanValidatedAt'),
    qualifies: pickDates(qualifies, 'qualifiedAt'),
    applications: pickDates(applications, 'createdAt'),
    missionsCreated: pickDates(missionsCreated, 'createdAt'),
    missionsFilled: pickDates(missionsFilled, 'pourvuAt'),
    badakanCreated: pickDates(badakanCreated, 'createdAt'),
    badakanStaffed: pickDates(badakanStaffed, 'staffedAt'),
  }
}
