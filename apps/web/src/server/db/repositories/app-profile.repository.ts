import type { AppProfileStatus, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import {
  appProfileJobTitleInclude,
  type AppProfileIntakeUpdate,
  type AppProfileUpsertInput,
  type ListIntakeFollowUpOpts,
} from './app-profile.repository.types'
import { intakeFollowUpWhere } from './app-profile-intake-where'
import { upsertPendingAppProfile } from './app-profile-upsert-pending'

export type { AppProfileUpsertInput, AppProfileIntakeUpdate, ListIntakeFollowUpOpts }

export function makeAppProfileRepository(db: PrismaClient = defaultDb) {
  return {
    listPending: (limit?: number) =>
      db.appProfile.findMany({
        where: { status: 'EN_ATTENTE' },
        orderBy: { syncedAt: 'desc' },
        ...(limit != null ? { take: limit } : {}),
        include: appProfileJobTitleInclude,
      }),
    listIntakeFollowUp: (opts: ListIntakeFollowUpOpts = {}) =>
      db.appProfile.findMany({
        where: intakeFollowUpWhere(opts),
        orderBy: [{ relanceAt: 'asc' }, { createdAt: 'desc' }],
        ...(opts.limit != null ? { take: opts.limit } : {}),
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
    upsertPending: (data: AppProfileUpsertInput) => upsertPendingAppProfile(db, data),
    muteOutbound: (id: string) =>
      db.appProfile.update({
        where: { id },
        data: {
          inviteEmailSentAt: new Date(),
          calendarSmsSentAt: new Date(),
          inviteLastError: 'syncro_import_muted',
        },
      }),
    updateIntake: (id: string, data: AppProfileIntakeUpdate) => {
      const { intakeStatus, ...rest } = data
      return db.appProfile.update({
        where: { id },
        data: { ...rest, intakeStatusId: intakeStatus },
        include: appProfileJobTitleInclude,
      })
    },
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
