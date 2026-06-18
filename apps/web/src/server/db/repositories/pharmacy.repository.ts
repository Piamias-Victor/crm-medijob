import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

const listInclude = {
  groupement: { select: { name: true } },
  contacts: {
    where: NOT_DELETED,
    select: { firstName: true, lastName: true, isPrimary: true },
  },
  _count: { select: { missions: { where: NOT_DELETED } } },
} satisfies Prisma.PharmacyInclude

export function makePharmacyRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.PharmacyUncheckedCreateInput) =>
      db.pharmacy.create({ data }),
    findById: (id: string) =>
      db.pharmacy.findFirst({ where: { id, ...NOT_DELETED } }),
    update: (id: string, data: Prisma.PharmacyUncheckedUpdateInput) =>
      db.pharmacy.update({ where: { id }, data }),
    list: () =>
      db.pharmacy.findMany({
        where: NOT_DELETED,
        include: listInclude,
        orderBy: { name: 'asc' },
      }),
    softDelete: (id: string) =>
      db.pharmacy.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const pharmacyRepository = makePharmacyRepository()
