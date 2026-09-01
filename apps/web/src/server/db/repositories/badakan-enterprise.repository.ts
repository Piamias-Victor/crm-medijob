import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import type { BadakanEnterprise } from '@/server/badakan/map-enterprise'

function persistFields(data: BadakanEnterprise) {
  return {
    badakanId: data.badakanId,
    name: data.name,
    siret: data.siret,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    principalFirstName: data.principal?.firstName ?? null,
    principalLastName: data.principal?.lastName ?? null,
    principalEmail: data.principal?.email ?? null,
    principalPhone: data.principal?.phone ?? null,
    syncedAt: new Date(),
  }
}

export function makeBadakanEnterpriseRepository(db: PrismaClient = defaultDb) {
  return {
    listPending: (limit = DEFAULT_LIST_LIMIT) =>
      db.badakanEnterprise.findMany({
        where: { verifiedAt: null },
        orderBy: { syncedAt: 'desc' },
        take: limit,
      }),
    findById: (id: string) => db.badakanEnterprise.findUnique({ where: { id } }),
    upsertFromRead: (data: BadakanEnterprise) =>
      db.badakanEnterprise.upsert({
        where: { badakanId: data.badakanId },
        create: persistFields(data),
        update: persistFields(data),
      }),
    markVerified: (id: string, pharmacyId: string) =>
      db.badakanEnterprise.update({
        where: { id },
        data: { pharmacyId, verifiedAt: new Date() },
      }),
  }
}

export const badakanEnterpriseRepository = makeBadakanEnterpriseRepository()
