import type { PrismaClient, Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
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
    findForContext: (id: string) =>
      db.pharmacy.findFirst({
        where: { id, ...NOT_DELETED },
        select: { name: true, city: true, type: true, status: true, notes: true },
      }),
    update: (id: string, data: Prisma.PharmacyUncheckedUpdateInput) =>
      db.pharmacy.update({ where: { id }, data }),
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.pharmacy.findMany({
        where: NOT_DELETED,
        include: listInclude,
        orderBy: { name: 'asc' },
        take: limit,
      }),
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
