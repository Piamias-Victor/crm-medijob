import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import type { BadakanContract } from '@/server/badakan/map-contract'

function persistFields(data: BadakanContract) {
  return {
    badakanId: data.badakanId,
    status: data.status,
    pdfUrl: data.pdfUrl,
    dpaeUrl: data.dpaeUrl,
    recipientName: data.recipientName,
    pharmacyName: data.pharmacyName,
    syncedAt: new Date(),
  }
}

export function makeBadakanContractRepository(db: PrismaClient = defaultDb) {
  return {
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.badakanContract.findMany({
        orderBy: { syncedAt: 'desc' },
        take: limit,
      }),
    upsertFromRead: (data: BadakanContract) =>
      db.badakanContract.upsert({
        where: { badakanId: data.badakanId },
        create: persistFields(data),
        update: persistFields(data),
      }),
  }
}

export const badakanContractRepository = makeBadakanContractRepository()
