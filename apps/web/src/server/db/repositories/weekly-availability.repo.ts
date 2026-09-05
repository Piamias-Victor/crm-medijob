import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import type { AvailabilitySlot, WeeklyAvailabilityStore } from '@/server/weekly-availability/types'
import { utcDateToYmd, ymdToUtcDate } from './ymd-date'
import { upsertWeekSlots } from './weekly-availability-upsert'

function toSlots(
  rows: { date: Date; period: 'AM' | 'PM' }[],
): AvailabilitySlot[] {
  return rows.map((row) => ({ date: utcDateToYmd(row.date), period: row.period }))
}

export function makeWeeklyAvailabilityRepository(db: PrismaClient): WeeklyAvailabilityStore {
  return {
    findCandidateByToken: async (token) => {
      const row = await db.weeklyAvailabilityToken.findUnique({
        where: { token },
        select: { candidateId: true, candidate: { select: { deletedAt: true } } },
      })
      if (!row || row.candidate.deletedAt) return null
      return { candidateId: row.candidateId }
    },
    findWeek: async (candidateId, weekStart) => {
      const row = await db.weeklyAvailabilityWeek.findUnique({
        where: { candidateId_weekStart: { candidateId, weekStart: ymdToUtcDate(weekStart) } },
        select: { slots: { select: { date: true, period: true } } },
      })
      return row ? { slots: toSlots(row.slots) } : null
    },
    upsertWeek: async (candidateId, weekStart, slots) => {
      await upsertWeekSlots(db, candidateId, weekStart, slots)
    },
    findOrigin: async (candidateId) => {
      const row = await db.candidate.findFirst({
        where: { id: candidateId, ...NOT_DELETED },
        select: { origin: true },
      })
      return row?.origin ?? null
    },
    findTokenByCandidate: async (candidateId) => {
      const row = await db.weeklyAvailabilityToken.findUnique({
        where: { candidateId },
        select: { token: true },
      })
      return row?.token ?? null
    },
    insertToken: async (candidateId, token) => {
      await db.weeklyAvailabilityToken.create({ data: { candidateId, token } })
    },
  }
}
