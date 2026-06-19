import type { PrismaClient, Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export function makeApplicationRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.ApplicationCreateInput) =>
      db.application.create({ data }),
    findById: (id: string) =>
      db.application.findFirst({ where: { id, ...NOT_DELETED } }),
    list: () =>
      db.application.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
      }),
    listInbox: (limit = DEFAULT_LIST_LIMIT) =>
      db.application.findMany({
        where: { status: 'EN_ATTENTE', ...NOT_DELETED },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          city: true,
          createdAt: true,
          jobTitle: { select: { name: true } },
          jobOffer: { select: { title: true } },
        },
      }),
    updateStatus: (id: string, status: 'REFUSEE' | 'ACCEPTEE' | 'EN_ATTENTE') =>
      db.application.update({ where: { id }, data: { status } }),
    softDelete: (id: string) =>
      db.application.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const applicationRepository = makeApplicationRepository()
