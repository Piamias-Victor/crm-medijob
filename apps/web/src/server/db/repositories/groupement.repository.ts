import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeGroupementRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.GroupementCreateInput) =>
      db.groupement.create({ data }),
    findById: (id: string) => db.groupement.findUnique({ where: { id } }),
    list: () => db.groupement.findMany({ orderBy: { name: 'asc' } }),
    update: (id: string, data: Prisma.GroupementUpdateInput) =>
      db.groupement.update({ where: { id }, data }),
    remove: (id: string) => db.groupement.delete({ where: { id } }),
  }
}

export const groupementRepository = makeGroupementRepository()
