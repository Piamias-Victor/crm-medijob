import type { PrismaClient, Prisma } from '@prisma/client'
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
    softDelete: (id: string) =>
      db.application.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const applicationRepository = makeApplicationRepository()
