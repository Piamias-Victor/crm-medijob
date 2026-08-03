import type { PrismaClient } from '@prisma/client'
import { ALERT_PREVIEW_LIMIT } from '@/lib/constants/dashboard-alerts'
import { candidatsPageHref } from '@/view-models/candidats-tab'
import type { DashboardAlertItem, DashboardAlerts } from '@/view-models/home-overview'
import { isOverdueFollowUp, overdueFollowUpCutoff } from '@/view-models/dashboard-overdue'
import { NOT_DELETED } from './soft-delete'
import { OPEN_MISSION_STATUSES } from './dashboard-open-status'

const openWhere = {
  ...NOT_DELETED,
  status: { in: [...OPEN_MISSION_STATUSES] },
}

function missionHref(id: string): string {
  return `/missions/${id}`
}

export async function loadDashboardAlerts(
  db: PrismaClient,
  now: Date,
): Promise<DashboardAlerts> {
  const cutoff = overdueFollowUpCutoff(now)
  const [uncoveredCount, uncovered, untreatedCount, untreated, openMissions] =
    await Promise.all([
      db.mission.count({
        where: { ...openWhere, candidates: { none: {} } },
      }),
      db.mission.findMany({
        where: { ...openWhere, candidates: { none: {} } },
        select: { id: true, title: true },
        orderBy: { startDate: 'asc' },
        take: ALERT_PREVIEW_LIMIT,
      }),
      db.application.count({ where: { status: 'EN_ATTENTE', deletedAt: null } }),
      db.application.findMany({
        where: { status: 'EN_ATTENTE', deletedAt: null },
        select: { id: true, firstName: true, lastName: true },
        orderBy: { createdAt: 'asc' },
        take: ALERT_PREVIEW_LIMIT,
      }),
      db.mission.findMany({
        where: openWhere,
        select: {
          id: true,
          title: true,
          createdAt: true,
          activities: {
            orderBy: { date: 'desc' },
            take: 1,
            select: { date: true },
          },
        },
      }),
    ])

  const uncoveredItems: DashboardAlertItem[] = uncovered.map((m) => ({
    id: m.id,
    label: m.title,
    href: missionHref(m.id),
  }))

  const untreatedItems: DashboardAlertItem[] = untreated.map((a) => ({
    id: a.id,
    label: `${a.firstName} ${a.lastName}`.trim(),
    href: candidatsPageHref('inbox'),
  }))

  const overdueAll = openMissions.filter((m) =>
    isOverdueFollowUp(
      { createdAt: m.createdAt, lastActivityAt: m.activities[0]?.date ?? null },
      cutoff,
    ),
  )

  return {
    uncoveredMissions: { count: uncoveredCount, items: uncoveredItems },
    untreatedApplications: { count: untreatedCount, items: untreatedItems },
    overdueFollowUps: {
      count: overdueAll.length,
      items: overdueAll.slice(0, ALERT_PREVIEW_LIMIT).map((m) => ({
        id: m.id,
        label: m.title,
        href: missionHref(m.id),
      })),
    },
  }
}
