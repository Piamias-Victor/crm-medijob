import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { toDevisRecord } from './devis.repository.map'
import type { DevisWriteFields } from '@/view-models/devis'

export function makeDevisRepository(db: PrismaClient = defaultDb) {
  return {
    findById: async (id: string) => {
      const row = await db.devis.findFirst({ where: { id, ...NOT_DELETED } })
      return row ? toDevisRecord(row) : null
    },
    findDraftByMission: async (missionId: string) => {
      const row = await db.devis.findFirst({
        where: { missionId, status: 'DRAFT', ...NOT_DELETED },
        orderBy: { updatedAt: 'desc' },
      })
      return row ? toDevisRecord(row) : null
    },
    createDraft: async (data: DevisWriteFields & { missionId: string | null }) => {
      const row = await db.devis.create({ data: { ...data, status: 'DRAFT' } })
      return toDevisRecord(row)
    },
    updateDraft: async (id: string, data: DevisWriteFields) => {
      const row = await db.devis.update({ where: { id }, data })
      return toDevisRecord(row)
    },
    markSent: async (id: string) => {
      const row = await db.devis.update({
        where: { id },
        data: { status: 'SENT', sentAt: new Date() },
      })
      return toDevisRecord(row)
    },
    markAccepted: async (id: string) => {
      const row = await db.devis.update({
        where: { id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      })
      return toDevisRecord(row)
    },
    markInvoiced: async (id: string, invoicedAt: Date) => {
      const row = await db.devis.update({
        where: { id },
        data: { invoicedAt },
      })
      return toDevisRecord(row)
    },
    listByMission: async (missionId: string) => {
      const rows = await db.devis.findMany({
        where: { missionId, ...NOT_DELETED },
        orderBy: { updatedAt: 'desc' },
      })
      return rows.map(toDevisRecord)
    },
    softDeleteDraft: async (id: string) => {
      const existing = await db.devis.findFirst({
        where: { id, status: 'DRAFT', ...NOT_DELETED },
      })
      if (!existing) return null
      const row = await db.devis.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
      return toDevisRecord(row)
    },
  }
}

export const devisRepository = makeDevisRepository()
