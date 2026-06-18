import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

const listInclude = {
  pharmacy: { select: { name: true } },
} satisfies Prisma.ContactInclude

const detailInclude = {
  pharmacy: { select: { id: true, name: true } },
} satisfies Prisma.ContactInclude

export function makeContactRepository(db: PrismaClient = defaultDb) {
  const unsetPrimary = (pharmacyId: string, exceptId?: string) =>
    db.contact.updateMany({
      where: {
        pharmacyId,
        ...NOT_DELETED,
        isPrimary: true,
        ...(exceptId ? { id: { not: exceptId } } : {}),
      },
      data: { isPrimary: false },
    })

  return {
    create: async (data: Prisma.ContactUncheckedCreateInput) => {
      if (data.isPrimary) await unsetPrimary(data.pharmacyId)
      return db.contact.create({ data })
    },
    findById: (id: string) =>
      db.contact.findFirst({ where: { id, ...NOT_DELETED }, include: detailInclude }),
    list: () =>
      db.contact.findMany({
        where: NOT_DELETED,
        include: listInclude,
        orderBy: { createdAt: 'desc' },
      }),
    listByPharmacy: (pharmacyId: string) =>
      db.contact.findMany({ where: { pharmacyId, ...NOT_DELETED } }),
    update: async (id: string, data: Prisma.ContactUncheckedUpdateInput) => {
      if (data.isPrimary) {
        const current = await db.contact.findFirst({ where: { id, ...NOT_DELETED } })
        if (current) await unsetPrimary(current.pharmacyId, id)
      }
      return db.contact.update({ where: { id }, data })
    },
    setPrimary: async (id: string) => {
      const contact = await db.contact.findFirst({ where: { id, ...NOT_DELETED } })
      if (!contact) return null
      await db.$transaction([
        unsetPrimary(contact.pharmacyId, id),
        db.contact.update({ where: { id }, data: { isPrimary: true } }),
      ])
      return db.contact.findFirst({ where: { id }, include: detailInclude })
    },
    listMissions: (contactId: string) =>
      db.mission.findMany({
        where: { contactId, ...NOT_DELETED },
        select: { id: true, title: true, status: true, pharmacy: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    softDelete: (id: string) =>
      db.contact.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const contactRepository = makeContactRepository()
