import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeCandidateGdprRepository(db: PrismaClient = defaultDb) {
  return {
    findForErase: (id: string) =>
      db.candidate.findUnique({ where: { id }, select: { id: true, cvUrl: true } }),
    listDocumentUrls: async (candidateId: string) => {
      const rows = await db.document.findMany({
        where: { candidateId },
        select: { url: true },
      })
      return rows.map((r) => r.url)
    },
    listApplicationCvUrls: async (candidateId: string) => {
      const rows = await db.application.findMany({
        where: { candidateId, cvUrl: { not: null } },
        select: { cvUrl: true },
      })
      return rows.map((r) => r.cvUrl).filter((u): u is string => !!u)
    },
    hardDeleteCascade: async (id: string) => {
      await db.$transaction([
        db.document.deleteMany({ where: { candidateId: id } }),
        db.activityLog.deleteMany({ where: { candidateId: id } }),
        db.application.deleteMany({ where: { candidateId: id } }),
        db.candidate.delete({ where: { id } }),
      ])
    },
  }
}

export const candidateGdprRepository = makeCandidateGdprRepository()
