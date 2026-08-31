import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import { ymdToUtcDate } from './ymd-date'
import type {
  AvailabilityFilterPoolRow,
  WeeklyAvailabilityFilterStore,
} from '@/server/weekly-availability/filter-pool'

export function makeWeeklyAvailabilityFilterRepository(
  db: PrismaClient,
): WeeklyAvailabilityFilterStore {
  return {
    listBySlot: async ({ date, period, jobTitleId }) => {
      const rows = await db.candidate.findMany({
        where: {
          ...NOT_DELETED,
          origin: 'APP',
          status: { not: 'INACTIF' },
          jobTitleId,
          weeklyAvailabilityWeeks: {
            some: {
              slots: { some: { date: ymdToUtcDate(date), period } },
            },
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
          postalCode: true,
          jobTitle: { select: { name: true } },
        },
      })
      return rows.map(
        (row): AvailabilityFilterPoolRow => ({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          phone: row.phone,
          city: row.city,
          postalCode: row.postalCode,
          jobTitleName: row.jobTitle.name,
        }),
      )
    },
  }
}
