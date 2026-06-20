import type { PrismaClient, Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { searchContacts } from './contact-search.repo'

const listInclude = {
  pharmacy: { select: { name: true } },
} satisfies Prisma.ContactInclude

const detailInclude = {
  pharmacy: { select: { id: true, name: true } },
} satisfies Prisma.ContactInclude

type Tx = Prisma.TransactionClient

function unsetPrimaryTx(tx: Tx, pharmacyId: string, exceptId?: string) {
  return tx.contact.updateMany({
    where: {
      pharmacyId,
      ...NOT_DELETED,
      isPrimary: true,
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    data: { isPrimary: false },
  })
}

export function makeContactRepository(db: PrismaClient = defaultDb) {
  return {
    create: async (data: Prisma.ContactUncheckedCreateInput) => {
      if (!data.isPrimary) return db.contact.create({ data })
      return db.$transaction(async (tx) => {
        await unsetPrimaryTx(tx, data.pharmacyId)
        return tx.contact.create({ data })
      })
    },
    findById: (id: string) =>
      db.contact.findFirst({ where: { id, ...NOT_DELETED }, include: detailInclude }),
    findForContext: (id: string) =>
      db.contact.findFirst({
        where: { id, ...NOT_DELETED },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          isPrimary: true,
          pharmacy: { select: { name: true } },
        },
      }),
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.contact.findMany({
        where: NOT_DELETED,
        include: listInclude,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    listByPharmacy: (pharmacyId: string, limit = DEFAULT_LIST_LIMIT) =>
      db.contact.findMany({ where: { pharmacyId, ...NOT_DELETED }, take: limit }),
    update: async (id: string, data: Prisma.ContactUncheckedUpdateInput) => {
      if (!data.isPrimary) return db.contact.update({ where: { id }, data })
      return db.$transaction(async (tx) => {
        const current = await tx.contact.findFirst({ where: { id, ...NOT_DELETED } })
        if (current) await unsetPrimaryTx(tx, current.pharmacyId, id)
        return tx.contact.update({ where: { id }, data })
      })
    },
    setPrimary: async (id: string) => {
      const contact = await db.contact.findFirst({ where: { id, ...NOT_DELETED } })
      if (!contact) return null
      await db.$transaction(async (tx) => {
        await unsetPrimaryTx(tx, contact.pharmacyId, id)
        await tx.contact.update({ where: { id }, data: { isPrimary: true } })
      })
      return db.contact.findFirst({ where: { id }, include: detailInclude })
    },
    search: (term: string, limit = 8) => searchContacts(db, term, limit),
    softDelete: (id: string) =>
      db.contact.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const contactRepository = makeContactRepository()
