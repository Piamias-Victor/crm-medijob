import type { PrismaClient } from '@prisma/client'
import {
  MS_PER_HOUR,
  URGENT_WITHIN_HOURS,
} from '@/lib/constants/dashboard-alerts'
import { computeFillRate } from '@/view-models/dashboard-fill-rate'
import { NOT_DELETED } from './soft-delete'
import { OPEN_MISSION_STATUSES } from './dashboard-open-status'

export type DashboardKpiCounts = {
  candidates: number
  pharmacies: number
  missionsActive: number
  inboxPending: number
  missionsUrgent: number
  fillRate: number
}

export async function loadDashboardKpis(
  db: PrismaClient,
  now: Date,
): Promise<DashboardKpiCounts> {
  const urgentUntil = new Date(now.getTime() + URGENT_WITHIN_HOURS * MS_PER_HOUR)

  const [
    candidates,
    pharmacies,
    missionsActive,
    inboxPending,
    missionsUrgent,
    pourvu,
    eligible,
  ] = await Promise.all([
    db.candidate.count({ where: NOT_DELETED }),
    db.pharmacy.count({ where: NOT_DELETED }),
    db.mission.count({ where: { ...NOT_DELETED, status: 'A_POURVOIR' } }),
    db.application.count({ where: { status: 'EN_ATTENTE', deletedAt: null } }),
    db.mission.count({
      where: {
        ...NOT_DELETED,
        status: { in: [...OPEN_MISSION_STATUSES] },
        startDate: { lte: urgentUntil },
      },
    }),
    db.mission.count({ where: { ...NOT_DELETED, status: 'POURVU' } }),
    db.mission.count({
      where: { ...NOT_DELETED, status: { not: 'ANNULEE' } },
    }),
  ])

  return {
    candidates,
    pharmacies,
    missionsActive,
    inboxPending,
    missionsUrgent,
    fillRate: computeFillRate(pourvu, eligible),
  }
}
