import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export function makeContactRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.ContactCreateInput) => db.contact.create({ data }),
    findById: (id: string) =>
      db.contact.findFirst({ where: { id, ...NOT_DELETED } }),
    list: () =>
      db.contact.findMany({ where: NOT_DELETED, orderBy: { createdAt: 'desc' } }),
    listByPharmacy: (pharmacyId: string) =>
      db.contact.findMany({ where: { pharmacyId, ...NOT_DELETED } }),
    softDelete: (id: string) =>
      db.contact.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const contactRepository = makeContactRepository()
