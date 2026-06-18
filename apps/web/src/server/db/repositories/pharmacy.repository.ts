import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export function makePharmacyRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.PharmacyCreateInput) => db.pharmacy.create({ data }),
    findById: (id: string) =>
      db.pharmacy.findFirst({ where: { id, ...NOT_DELETED } }),
    list: () =>
      db.pharmacy.findMany({ where: NOT_DELETED, orderBy: { name: 'asc' } }),
    search: (term: string, limit = 8) =>
      db.pharmacy.findMany({
        where: { ...NOT_DELETED, name: { contains: term, mode: 'insensitive' } },
        orderBy: { name: 'asc' },
        take: limit,
      }),
    softDelete: (id: string) =>
      db.pharmacy.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const pharmacyRepository = makePharmacyRepository()
