import type { PrismaClient } from '@prisma/client'
import type { BadakanMissionToPersist } from '@/server/badakan-mission/sync'
import { decideEventStamp, STAFFED_TARGETS } from '@/view-models/activite-event-stamp'
import { persistFields } from './badakan-mission-persist'

export async function upsertBadakanMissionWithStaffedStamp(
  db: PrismaClient,
  data: BadakanMissionToPersist,
  now: Date = new Date(),
) {
  const existing = await db.badakanMission.findUnique({
    where: { badakanId: data.badakanId },
    select: { step: true, staffedAt: true },
  })
  const staffedAt = decideEventStamp({
    previous: existing?.step ?? null,
    next: data.step,
    targets: STAFFED_TARGETS,
    existing: existing?.staffedAt,
    now,
  })
  const fields = persistFields(data)
  return db.badakanMission.upsert({
    where: { badakanId: data.badakanId },
    create: {
      ...fields,
      staffedAt,
      jobTitleId: data.jobTitleId,
      searchApplied: { create: data.searchApplied },
    },
    update: {
      ...fields,
      staffedAt,
      ...(data.jobTitleId ? { jobTitleId: data.jobTitleId } : {}),
      searchApplied: { deleteMany: {}, create: data.searchApplied },
    },
  })
}
