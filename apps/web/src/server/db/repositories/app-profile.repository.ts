import type { AppProfileStatus, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import {
  appProfileJobTitleInclude,
  type AppProfileIntakeUpdate,
  type AppProfileUpsertInput,
} from './app-profile.repository.types'

export type { AppProfileUpsertInput, AppProfileIntakeUpdate }

export function makeAppProfileRepository(db: PrismaClient = defaultDb) {
  return {
    listPending: (limit?: number) =>
      db.appProfile.findMany({
        where: { status: 'EN_ATTENTE' },
        orderBy: { syncedAt: 'desc' },
        ...(limit != null ? { take: limit } : {}),
        include: appProfileJobTitleInclude,
      }),
    listIntakeFollowUp: (limit?: number) =>
      db.appProfile.findMany({
        where: { status: { notIn: ['APP_VALIDATED', 'IGNORE'] } },
        orderBy: { createdAt: 'desc' },
        ...(limit != null ? { take: limit } : {}),
        include: appProfileJobTitleInclude,
      }),
    countPending: () => db.appProfile.count({ where: { status: 'EN_ATTENTE' } }),
    findById: (id: string) =>
      db.appProfile.findUnique({ where: { id }, include: appProfileJobTitleInclude }),
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
    updateIntake: (id: string, data: AppProfileIntakeUpdate) =>
      db.appProfile.update({
        where: { id },
        data,
        include: appProfileJobTitleInclude,
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
    restorePending: (id: string) =>
      db.appProfile.update({
        where: { id },
        data: { status: 'EN_ATTENTE', candidateId: null },
      }),
    listConvertQueue: () =>
      db.appProfile.findMany({
        where: { status: 'EN_ATTENTE' },
        orderBy: { createdAt: 'asc' },
        select: { badakanId: true, createdAt: true },
      }),
  }
}

export const appProfileRepository = makeAppProfileRepository()
