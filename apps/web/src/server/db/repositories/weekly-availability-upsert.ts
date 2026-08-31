import type { PrismaClient } from '@prisma/client'
import type { AvailabilitySlot } from '@/server/weekly-availability/types'
import { ymdToUtcDate } from './ymd-date'

export async function upsertWeekSlots(
  db: PrismaClient,
  candidateId: string,
  weekStart: string,
  slots: AvailabilitySlot[],
): Promise<void> {
  const start = ymdToUtcDate(weekStart)
  await db.$transaction(async (tx) => {
    const week = await tx.weeklyAvailabilityWeek.upsert({
      where: { candidateId_weekStart: { candidateId, weekStart: start } },
      create: { candidateId, weekStart: start },
      update: {},
    })
    await tx.weeklyAvailabilitySlot.deleteMany({ where: { weekId: week.id } })
    if (slots.length === 0) return
    await tx.weeklyAvailabilitySlot.createMany({
      data: slots.map((slot) => ({
        weekId: week.id,
        date: ymdToUtcDate(slot.date),
        period: slot.period,
      })),
    })
  })
}
