import type { CandidateStatus, PrismaClient } from '@prisma/client'
import { decideEventStamp, QUALIFIE_TARGETS } from '@/view-models/activite-event-stamp'
import { NOT_DELETED } from './soft-delete'

export type AppLifecyclePatch = {
  status: CandidateStatus
  statusBeforeInactive: CandidateStatus | null
}

export function makeCandidateAppLifecycleRepository(db: PrismaClient) {
  return {
    applyAppLifecycle: async (id: string, patch: AppLifecyclePatch, now = new Date()) => {
      const previous = await db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        select: { status: true, qualifiedAt: true },
      })
      const qualifiedAt = decideEventStamp({
        previous: previous?.status,
        next: patch.status,
        targets: QUALIFIE_TARGETS,
        existing: previous?.qualifiedAt,
        now,
      })
      return db.candidate.update({
        where: { id },
        data: {
          status: patch.status,
          statusBeforeInactive: patch.statusBeforeInactive,
          qualifiedAt,
        },
        select: { id: true },
      })
    },
    listAppLinkedBadakanIds: async () => {
      const rows = await db.candidate.findMany({
        where: { origin: 'APP', badakanId: { not: null }, ...NOT_DELETED },
        select: { badakanId: true },
      })
      return rows.flatMap((row) => (row.badakanId ? [row.badakanId] : []))
    },
  }
}
