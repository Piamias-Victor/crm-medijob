import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export function makeJobOfferRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.JobOfferCreateInput) => db.jobOffer.create({ data }),
    findById: (id: string) =>
      db.jobOffer.findFirst({ where: { id, ...NOT_DELETED } }),
    list: () =>
      db.jobOffer.findMany({ where: NOT_DELETED, orderBy: { createdAt: 'desc' } }),
    listForTable: () =>
      db.jobOffer.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          publishedAt: true,
          mission: { select: { id: true, title: true } },
          _count: { select: { applications: true } },
        },
      }),
    softDelete: (id: string) =>
      db.jobOffer.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const jobOfferRepository = makeJobOfferRepository()
