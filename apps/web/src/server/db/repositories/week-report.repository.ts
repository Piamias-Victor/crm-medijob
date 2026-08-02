import type { PrismaClient } from '@prisma/client'
import { OPEN_MISSION_STATUSES } from '@/server/db/repositories/dashboard-open-status'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'
import { prisma as defaultDb } from '@/server/db/repositories/client'
import type {
  WeekReportCountsLoader,
  WeekReportRangeInput,
} from '@/server/ai/week-report-assemble'

function missionReferent(referentId: string) {
  return { ...NOT_DELETED, referentId }
}

function inRange(from: Date, to: Date) {
  return { gte: from, lt: to }
}

export function makeWeekReportCountsLoader(db: PrismaClient = defaultDb): WeekReportCountsLoader {
  return {
    countOpenMissions: ({ referentId }) =>
      db.mission.count({
        where: { ...missionReferent(referentId), status: { in: [...OPEN_MISSION_STATUSES] } },
      }),
    countFilledMissions: ({ referentId, from, to }) =>
      db.mission.count({
        where: {
          ...missionReferent(referentId),
          status: 'POURVU',
          updatedAt: inRange(from, to),
        },
      }),
    countCandidatesContacted: ({ referentId, from, to }) =>
      db.activityLog.count({
        where: {
          authorId: referentId,
          candidateId: { not: null },
          date: inRange(from, to),
        },
      }),
    countApplicationsReceived: (input) => countApplicationsForReferent(db, input),
    countOffersPublished: (input) => countOffersForReferent(db, input),
    countCommercialActions: ({ referentId, from, to }) =>
      db.activityLog.count({
        where: {
          authorId: referentId,
          type: 'ACTION_COMMERCIALE',
          date: inRange(from, to),
        },
      }),
  }
}

function countApplicationsForReferent(db: PrismaClient, input: WeekReportRangeInput) {
  return db.application.count({
    where: {
      deletedAt: null,
      createdAt: inRange(input.from, input.to),
      jobOffer: { mission: { referentId: input.referentId } },
    },
  })
}

function countOffersForReferent(db: PrismaClient, input: WeekReportRangeInput) {
  return db.jobOffer.count({
    where: {
      ...NOT_DELETED,
      status: 'PUBLIEE',
      publishedAt: inRange(input.from, input.to),
      mission: { referentId: input.referentId },
    },
  })
}

export const weekReportCountsLoader = makeWeekReportCountsLoader()
