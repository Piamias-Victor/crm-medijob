import type { CandidateStatus, PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

export type AppLifecyclePatch = {
  status: CandidateStatus
  statusBeforeInactive: CandidateStatus | null
}

export function makeCandidateAppLifecycleRepository(db: PrismaClient) {
  return {
    applyAppLifecycle: (id: string, patch: AppLifecyclePatch) =>
      db.candidate.update({
        where: { id },
        data: {
          status: patch.status,
          statusBeforeInactive: patch.statusBeforeInactive,
        },
        select: { id: true },
      }),
    listAppLinkedBadakanIds: async () => {
      const rows = await db.candidate.findMany({
        where: { origin: 'APP', badakanId: { not: null }, ...NOT_DELETED },
        select: { badakanId: true },
      })
      return rows.flatMap((row) => (row.badakanId ? [row.badakanId] : []))
    },
  }
}
