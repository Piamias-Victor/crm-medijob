import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { makeCandidateProfileRepository } from './candidate-profile.repo'

export type { CandidateProfileUpdate } from './candidate-profile.repository'

export function makeCandidateRepository(db: PrismaClient = defaultDb) {
  const profile = makeCandidateProfileRepository(db)

  return {
    create: (data: Prisma.CandidateCreateInput) => db.candidate.create({ data }),
    findById: (id: string) =>
      db.candidate.findFirst({ where: { id, ...NOT_DELETED } }),
    findProfileById: profile.findProfileById,
    updateProfile: profile.updateProfile,
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
    listForKanban: () =>
      db.candidate.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          city: true,
          jobTitle: { select: { name: true } },
          referent: { select: { name: true } },
          missions: {
            select: {
              stageId: true,
              stage: { select: { id: true, name: true, position: true } },
              mission: { select: { id: true, title: true, status: true } },
            },
          },
        },
      }),
    softDelete: (id: string) =>
      db.candidate.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const candidateRepository = makeCandidateRepository()
