import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import type { HireflixInviteResult } from '@/server/app-profile/invite-due.types'

export function makeAppProfileInviteRepository(db: PrismaClient = defaultDb) {
  return {
    listDue: () =>
      db.appProfile.findMany({
        where: { status: 'EN_ATTENTE', inviteEmailSentAt: null },
        orderBy: { createdAt: 'asc' },
      }),
    saveHireflix: (id: string, data: HireflixInviteResult) =>
      db.appProfile.update({
        where: { id },
        data: {
          hireflixInterviewId: data.interviewId,
          hireflixUrl: data.url,
          inviteLastError: null,
        },
      }),
    saveSent: (id: string) =>
      db.appProfile.update({
        where: { id },
        data: { inviteEmailSentAt: new Date(), inviteLastError: null },
      }),
    saveError: (id: string, error: string) =>
      db.appProfile.update({
        where: { id },
        data: { inviteLastError: error },
      }),
  }
}

export const appProfileInviteRepository = makeAppProfileInviteRepository()
