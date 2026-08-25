import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { financeLineSelect } from './finance-line.repository.select'
import { toFinanceLineRecord } from './finance-line.repository.map'
import type { CreateFinanceLineInput } from '@/view-models/finance-line.schema'

export function makeFinanceLineRepository(db: PrismaClient = defaultDb) {
  return {
    list: async () => {
      const rows = await db.financeLine.findMany({
        where: NOT_DELETED,
        orderBy: { occurredAt: 'desc' },
        select: financeLineSelect,
        take: DEFAULT_LIST_LIMIT,
      })
      return rows.map(toFinanceLineRecord)
    },
    findById: async (id: string) => {
      const row = await db.financeLine.findFirst({
        where: { id, ...NOT_DELETED },
        select: financeLineSelect,
      })
      return row ? toFinanceLineRecord(row) : null
    },
    create: async (input: CreateFinanceLineInput) => {
      const row = await db.financeLine.create({
        data: {
          kind: input.kind,
          pharmacyId: input.pharmacyId,
          candidateId: input.candidateId,
          missionId: input.missionId ?? null,
          hours: input.hours ?? null,
          hourlyRate: input.hourlyRate ?? null,
          amountHt: input.amountHt,
          htSource: input.htSource ?? 'TYPED',
          marge: input.marge ?? null,
          occurredAt: input.occurredAt,
          devisId: input.devisId,
          referentId: input.referentId ?? null,
          placementContractType: input.placementContractType ?? null,
        },
        select: financeLineSelect,
      })
      return toFinanceLineRecord(row)
    },
    setDevisId: async (id: string, devisId: string) => {
      await db.financeLine.update({ where: { id }, data: { devisId } })
    },
    setCancelled: async (id: string, cancelled: boolean) => {
      const row = await db.financeLine.update({
        where: { id },
        data: { cancelled },
        select: financeLineSelect,
      })
      return toFinanceLineRecord(row)
    },
    setInvoiced: async (id: string, invoiced: boolean) => {
      const row = await db.financeLine.update({
        where: { id },
        data: { invoiced },
        select: financeLineSelect,
      })
      return toFinanceLineRecord(row)
    },
    setPaid: async (id: string, paid: boolean) => {
      const row = await db.financeLine.update({
        where: { id },
        data: { paid },
        select: financeLineSelect,
      })
      return toFinanceLineRecord(row)
    },
    listMissionOptions: () =>
      db.mission.findMany({
        where: NOT_DELETED,
        select: { id: true, title: true, pharmacyId: true, contractType: true },
        orderBy: { createdAt: 'desc' },
        take: DEFAULT_LIST_LIMIT,
      }),
  }
}

export const financeLineRepository = makeFinanceLineRepository()
