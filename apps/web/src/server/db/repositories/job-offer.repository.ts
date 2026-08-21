import type { JobOfferStatus, PrismaClient, Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

const missionOfferSelect = {
  id: true,
  title: true,
  description: true,
  contractType: true,
  tempsPlein: true,
  startDate: true,
  planning: true,
  salaireMin: true,
  salaireMax: true,
  salaireNotes: true,
  heuresParSemaine: true,
  profilRecherche: true,
  notes: true,
  jobTitle: { select: { name: true } },
  pharmacy: {
    select: {
      name: true,
      city: true,
      postalCode: true,
      address: true,
      latitude: true,
      longitude: true,
      notes: true,
      software: { select: { name: true } },
    },
  },
} as const

export function makeJobOfferRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.JobOfferCreateInput) => db.jobOffer.create({ data }),
    findById: (id: string) => db.jobOffer.findFirst({ where: { id, ...NOT_DELETED } }),
    findByMissionId: (missionId: string) =>
      db.jobOffer.findFirst({ where: { missionId, ...NOT_DELETED } }),
    findMissionForOffer: (missionId: string) =>
      db.mission.findFirst({
        where: { id: missionId, ...NOT_DELETED },
        select: missionOfferSelect,
      }),
    update: (
      id: string,
      data: {
        title?: string
        content?: string
        status?: JobOfferStatus
        publishedAt?: Date | null
        boardListingId?: string | null
      },
    ) => db.jobOffer.update({ where: { id }, data }),
    listForTable: (limit = DEFAULT_LIST_LIMIT) =>
      db.jobOffer.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          publishedAt: true,
          mission: { select: { id: true, title: true } },
          _count: { select: { applications: true } },
        },
      }),
    listBoardListingIds: async () => {
      const rows = await db.jobOffer.findMany({
        where: { boardListingId: { not: null }, ...NOT_DELETED },
        select: { boardListingId: true },
      })
      return rows
        .map((row) => row.boardListingId)
        .filter((id): id is string => Boolean(id))
    },
    softDelete: (id: string) =>
      db.jobOffer.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const jobOfferRepository = makeJobOfferRepository()
