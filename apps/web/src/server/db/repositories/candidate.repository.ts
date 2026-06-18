import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export function makeCandidateRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.CandidateCreateInput) => db.candidate.create({ data }),
    findById: (id: string) =>
      db.candidate.findFirst({ where: { id, ...NOT_DELETED } }),
    list: () =>
      db.candidate.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
      }),
    search: (term: string, limit = 8) =>
      db.candidate.findMany({
        where: {
          ...NOT_DELETED,
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { lastName: { contains: term, mode: 'insensitive' } },
          ],
        },
        orderBy: { lastName: 'asc' },
        take: limit,
      }),
    softDelete: (id: string) =>
      db.candidate.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const candidateRepository = makeCandidateRepository()
