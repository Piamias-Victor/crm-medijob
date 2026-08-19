import type { PrismaClient, Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { applicationDetailSelect, applicationInboxSelect } from './application.select'
import type { IngestApplication } from '@/server/application/sync-map'

export function makeApplicationRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.ApplicationCreateInput) => db.application.create({ data }),
    findById: (id: string) => db.application.findFirst({ where: { id, ...NOT_DELETED } }),
    findDetailById: (id: string) =>
      db.application.findFirst({
        where: { id, ...NOT_DELETED },
        select: applicationDetailSelect,
      }),
    /** @deprecated Not exposed via tRPC — use listInbox or domain-specific queries */
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.application.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    listInbox: (limit = DEFAULT_LIST_LIMIT) =>
      db.application.findMany({
        where: { status: 'EN_ATTENTE', ...NOT_DELETED },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: applicationInboxSelect,
      }),
    findByBoardSubmissionIds: async (ids: string[]) => {
      const rows = await db.application.findMany({
        where: { boardSubmissionId: { in: ids } },
        select: { boardSubmissionId: true },
      })
      return rows.filter((row): row is { boardSubmissionId: string } =>
        Boolean(row.boardSubmissionId),
      )
    },
    createFromIngest: async (data: IngestApplication) => {
      const offer = await db.jobOffer.findFirst({
        where: { boardListingId: data.boardListingId, ...NOT_DELETED },
        select: { id: true, mission: { select: { jobTitleId: true } } },
      })
      if (!offer) return null
      return db.application.create({
        data: {
          boardSubmissionId: data.boardSubmissionId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          cvUrl: data.cvUrl,
          message: data.message,
          jobOfferId: offer.id,
          jobTitleId: offer.mission.jobTitleId,
          createdAt: data.submittedAt ?? undefined,
        },
      })
    },
    updateStatus: (id: string, status: 'REFUSEE' | 'ACCEPTEE' | 'EN_ATTENTE') =>
      db.application.update({ where: { id }, data: { status } }),
    markAccepted: (id: string, candidateId: string) =>
      db.application.update({
        where: { id },
        data: { status: 'ACCEPTEE', candidateId },
      }),
    softDelete: (id: string) =>
      db.application.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const applicationRepository = makeApplicationRepository()
