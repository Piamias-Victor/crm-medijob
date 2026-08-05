import type { AppProfileStatus, Prisma, PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'

export type AppProfileUpsertInput = {
  badakanId: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  city?: string | null
  postalCode?: string | null
  activityLabel?: string | null
  jobTitleId?: string | null
  snapshot?: Prisma.InputJsonValue
}

export function makeAppProfileRepository(db: PrismaClient = defaultDb) {
  return {
    listPending: (limit = DEFAULT_LIST_LIMIT) =>
      db.appProfile.findMany({
        where: { status: 'EN_ATTENTE' },
        orderBy: { syncedAt: 'desc' },
        take: limit,
        include: { jobTitle: { select: { id: true, name: true } } },
      }),

    countPending: () => db.appProfile.count({ where: { status: 'EN_ATTENTE' } }),

    findById: (id: string) =>
      db.appProfile.findUnique({
        where: { id },
        include: { jobTitle: { select: { id: true, name: true } } },
      }),

    findByBadakanIds: (ids: string[]) =>
      db.appProfile.findMany({
        where: { badakanId: { in: ids } },
        select: { id: true, badakanId: true, status: true },
      }),

    upsertPending: (data: AppProfileUpsertInput) =>
      db.appProfile.upsert({
        where: { badakanId: data.badakanId },
        create: { ...data, status: 'EN_ATTENTE', syncedAt: new Date() },
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          postalCode: data.postalCode,
          activityLabel: data.activityLabel,
          jobTitleId: data.jobTitleId,
          snapshot: data.snapshot,
          syncedAt: new Date(),
        },
      }),

    markStatus: (
      id: string,
      status: Extract<AppProfileStatus, 'ACCEPTE' | 'IGNORE'>,
      candidateId?: string | null,
    ) =>
      db.appProfile.update({
        where: { id },
        data: { status, candidateId: candidateId ?? undefined },
      }),
  }
}

export const appProfileRepository = makeAppProfileRepository()
