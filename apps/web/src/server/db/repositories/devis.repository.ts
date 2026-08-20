import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import type { DevisRecord, DevisWriteFields } from '@/view-models/devis'

function toRecord(row: {
  id: string
  missionId: string
  kind: DevisRecord['kind']
  status: DevisRecord['status']
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  htSource: DevisRecord['htSource']
  sentAt: Date | null
  updatedAt: Date
}): DevisRecord {
  return {
    id: row.id,
    missionId: row.missionId,
    kind: row.kind,
    status: row.status,
    hours: row.hours,
    hourlyRate: row.hourlyRate,
    amountHt: row.amountHt,
    amountTtc: row.amountTtc,
    htSource: row.htSource,
    sentAt: row.sentAt,
    updatedAt: row.updatedAt,
  }
}

export function makeDevisRepository(db: PrismaClient = defaultDb) {
  return {
    findDraftByMission: async (missionId: string) => {
      const row = await db.devis.findFirst({
        where: { missionId, status: 'DRAFT', ...NOT_DELETED },
        orderBy: { updatedAt: 'desc' },
      })
      return row ? toRecord(row) : null
    },
    createDraft: async (data: DevisWriteFields & { missionId: string }) => {
      const row = await db.devis.create({ data: { ...data, status: 'DRAFT' } })
      return toRecord(row)
    },
    updateDraft: async (id: string, data: DevisWriteFields) => {
      const row = await db.devis.update({ where: { id }, data })
      return toRecord(row)
    },
    markSent: async (id: string) => {
      const row = await db.devis.update({
        where: { id },
        data: { status: 'SENT', sentAt: new Date() },
      })
      return toRecord(row)
    },
    listByMission: async (missionId: string) => {
      const rows = await db.devis.findMany({
        where: { missionId, ...NOT_DELETED },
        orderBy: { updatedAt: 'desc' },
      })
      return rows.map(toRecord)
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
      return toRecord(row)
    },
  }
}

export const devisRepository = makeDevisRepository()
