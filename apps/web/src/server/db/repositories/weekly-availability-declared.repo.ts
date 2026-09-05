import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import { ymdToUtcDate } from './ymd-date'
import type {
  DeclaredAvailabilityPoolRow,
  DeclaredAvailabilityQuery,
  WeeklyAvailabilityDeclaredStore,
} from '@/server/weekly-availability/filter-pool'

function slotDateWhere({ from, dateTo }: DeclaredAvailabilityQuery) {
  return {
    gte: ymdToUtcDate(from),
    ...(dateTo ? { lte: ymdToUtcDate(dateTo) } : {}),
  }
}

function slotWhere(query: DeclaredAvailabilityQuery) {
  return {
    date: slotDateWhere(query),
    ...(query.period ? { period: query.period } : {}),
  }
}

function hasDispoClause(query: DeclaredAvailabilityQuery) {
  const mode = query.hasDispo ?? 'yes'
  const slots = slotWhere(query)
  if (mode === 'all') return {}
  if (mode === 'no') {
    return { weeklyAvailabilityWeeks: { none: { slots: { some: slots } } } }
  }
  return { weeklyAvailabilityWeeks: { some: { slots: { some: slots } } } }
}

export function makeWeeklyAvailabilityDeclaredRepository(
  db: PrismaClient,
): WeeklyAvailabilityDeclaredStore {
  return {
    listDeclared: async (query) => {
      const slots = slotWhere(query)
      const rows = await db.candidate.findMany({
        where: {
          ...NOT_DELETED,
          status: { not: 'INACTIF' },
          ...(query.jobTitleIds?.length ? { jobTitleId: { in: query.jobTitleIds } } : {}),
          ...hasDispoClause(query),
        },
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
          postalCode: true,
          jobTitleId: true,
          jobTitle: { select: { name: true } },
          weeklyAvailabilityWeeks: {
            select: {
              slots: {
                where: { date: slotDateWhere(query) },
                orderBy: [{ date: 'asc' }, { period: 'asc' }],
                select: { date: true, period: true },
              },
            },
          },
        },
      })
      return rows.map(
        (row): DeclaredAvailabilityPoolRow => ({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          phone: row.phone,
          city: row.city,
          postalCode: row.postalCode,
          jobTitleId: row.jobTitleId,
          jobTitleName: row.jobTitle.name,
          slots: row.weeklyAvailabilityWeeks
            .flatMap((week) => week.slots)
            .map((slot) => ({
              date: slot.date.toISOString().slice(0, 10),
              period: slot.period,
            }))
            .sort((a, b) => a.date.localeCompare(b.date) || a.period.localeCompare(b.period)),
        }),
      )
    },
  }
}
