import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeSoftwareRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.SoftwareCreateInput) => db.software.create({ data }),
    findById: (id: string) => db.software.findUnique({ where: { id } }),
    list: () => db.software.findMany({ orderBy: { name: 'asc' } }),
    update: (id: string, data: Prisma.SoftwareUpdateInput) =>
      db.software.update({ where: { id }, data }),
    remove: (id: string) => db.software.delete({ where: { id } }),
  }
}

export const softwareRepository = makeSoftwareRepository()
