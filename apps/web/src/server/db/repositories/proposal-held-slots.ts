import type { PrismaClient, WeeklyAvailabilityPeriod } from '@prisma/client'
import { addDaysYmd, mondayOf } from '@/lib/paris-week'
import { parseBadakanMissionPeriods } from '@/view-models/badakan-mission-periods'
import { missionDateRange } from '@/view-models/badakan-matching-dates'
import { ymdToUtcDate, utcDateToYmd } from './ymd-date'

async function missionRange(db: PrismaClient, missionId: string) {
  const mission = await db.badakanMission.findUnique({
    where: { id: missionId },
    select: { periods: true },
  })
  if (!mission) return null
  return missionDateRange(parseBadakanMissionPeriods(mission.periods))
}

async function upsertSlot(
  db: PrismaClient,
  candidateId: string,
  date: Date,
  period: WeeklyAvailabilityPeriod,
) {
  const ymd = utcDateToYmd(date)
  const weekStart = ymdToUtcDate(mondayOf(ymd))
  const week = await db.weeklyAvailabilityWeek.upsert({
    where: { candidateId_weekStart: { candidateId, weekStart } },
    create: { candidateId, weekStart },
    update: {},
  })
  await db.weeklyAvailabilitySlot.upsert({
    where: { weekId_date_period: { weekId: week.id, date, period } },
    create: { weekId: week.id, date, period },
    update: {},
  })
}

export async function holdCandidateSlotsOnMission(
  db: PrismaClient,
  candidateId: string,
  missionId: string,
): Promise<void> {
  const range = await missionRange(db, missionId)
  if (!range) return
  const slots = await db.weeklyAvailabilitySlot.findMany({
    where: {
      week: { candidateId },
      date: { gte: ymdToUtcDate(range.from), lte: ymdToUtcDate(range.to) },
    },
    select: { date: true, period: true },
  })
  if (slots.length === 0) return
  await db.badakanProposalHeldSlot.createMany({
    data: slots.map((slot) => ({
      badakanMissionId: missionId,
      candidateId,
      date: slot.date,
      period: slot.period,
    })),
    skipDuplicates: true,
  })
  await db.weeklyAvailabilitySlot.deleteMany({
    where: {
      week: { candidateId },
      date: { gte: ymdToUtcDate(range.from), lte: ymdToUtcDate(range.to) },
    },
  })
}

export async function restoreCandidateSlotsOnMission(
  db: PrismaClient,
  candidateId: string,
  missionId: string,
): Promise<void> {
  const held = await db.badakanProposalHeldSlot.findMany({
    where: { badakanMissionId: missionId, candidateId },
  })
  if (held.length > 0) {
    for (const slot of held) {
      await upsertSlot(db, candidateId, slot.date, slot.period)
    }
    await db.badakanProposalHeldSlot.deleteMany({
      where: { badakanMissionId: missionId, candidateId },
    })
    return
  }

  const range = await missionRange(db, missionId)
  if (!range) return
  for (let ymd = range.from; ymd <= range.to; ymd = addDaysYmd(ymd, 1)) {
    const date = ymdToUtcDate(ymd)
    await upsertSlot(db, candidateId, date, 'AM')
    await upsertSlot(db, candidateId, date, 'PM')
  }
}
