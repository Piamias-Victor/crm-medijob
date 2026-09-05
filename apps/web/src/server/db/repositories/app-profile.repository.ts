import type { AppProfileStatus, Prisma, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

export type AppProfileUpsertInput = {
  badakanId: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  postalCode?: string | null
  activityLabel?: string | null
  jobTitleId?: string | null
  hasResume?: boolean
  snapshot?: Prisma.InputJsonValue
}

export function makeAppProfileRepository(db: PrismaClient = defaultDb) {
  return {
    listPending: (limit?: number) =>
      db.appProfile.findMany({
        where: { status: 'EN_ATTENTE' },
        orderBy: { syncedAt: 'desc' },
        ...(limit != null ? { take: limit } : {}),
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
    findByBadakanId: (badakanId: string) =>
      db.appProfile.findUnique({
        where: { badakanId },
        select: { id: true, status: true, candidateId: true },
      }),
    linkCandidate: (id: string, candidateId: string) =>
      db.appProfile.update({ where: { id }, data: { candidateId } }),
    upsertPending: (data: AppProfileUpsertInput) =>
      db.appProfile.upsert({
        where: { badakanId: data.badakanId },
        create: { ...data, status: 'EN_ATTENTE', syncedAt: new Date() },
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          activityLabel: data.activityLabel,
          jobTitleId: data.jobTitleId,
          hasResume: data.hasResume ?? false,
          snapshot: data.snapshot,
          syncedAt: new Date(),
        },
      }),
    markStatus: (
      id: string,
      status: Extract<AppProfileStatus, 'ACCEPTE' | 'IGNORE' | 'APP_VALIDATED'>,
      candidateId?: string | null,
    ) =>
      db.appProfile.update({
        where: { id },
        data: { status, candidateId: candidateId ?? undefined },
      }),
  }
}

export const appProfileRepository = makeAppProfileRepository()
