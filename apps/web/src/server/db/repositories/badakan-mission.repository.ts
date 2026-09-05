import type { Prisma, PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import type { BadakanMissionToPersist } from '@/server/badakan-mission/sync'
import { isOpenNeed } from '@/view-models/badakan-need'

const includeApplied = { searchApplied: true } as const
const includeReferentials = {
  jobTitle: { select: { name: true } },
  software: { select: { name: true } },
} as const

function persistFields(data: BadakanMissionToPersist) {
  return {
    badakanId: data.badakanId,
    identifier: data.identifier,
    pharmacyName: data.pharmacyName,
    enterpriseId: data.enterpriseId,
    step: data.step,
    periods: data.periods as Prisma.InputJsonValue,
    activityId: data.activityId,
    activityLabel: data.activityLabel,
    jobTitleId: data.jobTitleId,
    softwareId: data.softwareId,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    latitude: data.latitude,
    longitude: data.longitude,
    softwareLabel: data.softwareLabel,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    hourlyRate: data.hourlyRate,
    reasonLabel: data.reasonLabel,
    expectedRecipients: data.expectedRecipients,
    staffedRecipients: data.staffedRecipients,
    syncedAt: new Date(),
  }
}

export function makeBadakanMissionRepository(db: PrismaClient = defaultDb) {
  return {
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.badakanMission.findMany({
        orderBy: { syncedAt: 'desc' },
        take: limit,
        include: includeApplied,
      }),
    listOpenNeeds: async (limit = DEFAULT_LIST_LIMIT) => {
      const rows = await db.badakanMission.findMany({
        orderBy: { syncedAt: 'desc' },
        include: {
          ...includeReferentials,
          proposals: { select: { status: true } },
        },
      })
      return rows.filter(isOpenNeed).slice(0, limit)
    },
    listForSuivi: async (limit = DEFAULT_LIST_LIMIT) =>
      db.badakanMission.findMany({
        orderBy: { syncedAt: 'desc' },
        take: limit,
        include: {
          ...includeReferentials,
          proposals: { select: { status: true } },
        },
      }),
    findById: (id: string) =>
      db.badakanMission.findUnique({
        where: { id },
        include: {
          ...includeApplied,
          ...includeReferentials,
        },
      }),
    listEnterpriseIds: async () => {
      const rows = await db.badakanMission.findMany({
        where: { enterpriseId: { not: null } },
        select: { enterpriseId: true },
        distinct: ['enterpriseId'],
      })
      return rows.flatMap((row) => (row.enterpriseId ? [row.enterpriseId] : []))
    },
    upsertFromRead: (data: BadakanMissionToPersist) =>
      db.badakanMission.upsert({
        where: { badakanId: data.badakanId },
        create: {
          ...persistFields(data),
          searchApplied: { create: data.searchApplied },
        },
        update: {
          ...persistFields(data),
          searchApplied: { deleteMany: {}, create: data.searchApplied },
        },
      }),
  }
}

export const badakanMissionRepository = makeBadakanMissionRepository()
