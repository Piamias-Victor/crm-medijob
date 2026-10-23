import type { PharmacyStatus, CandidateStatus, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { buildPersonSearchWhere } from './candidate-list-where-search'

export type SponsorshipPeer = {
  id: string
  name: string
  status: PharmacyStatus | CandidateStatus
}

export type SponsorshipView = {
  sponsor: SponsorshipPeer | null
  filleules: SponsorshipPeer[]
}

export function makeSponsorshipReadRepository(db: PrismaClient = defaultDb) {
  return {
    pharmacyView: async (id: string): Promise<SponsorshipView | null> => {
      const row = await db.pharmacy.findFirst({
        where: { id, ...NOT_DELETED },
        select: {
          sponsor: { select: { id: true, name: true, status: true, deletedAt: true } },
          filleules: {
            where: NOT_DELETED,
            select: { id: true, name: true, status: true },
            orderBy: { name: 'asc' },
          },
        },
      })
      if (!row) return null
      const sponsor =
        row.sponsor && !row.sponsor.deletedAt
          ? { id: row.sponsor.id, name: row.sponsor.name, status: row.sponsor.status }
          : null
      return { sponsor, filleules: row.filleules }
    },
    searchCandidates: async (term: string, excludeId: string, limit = 12) => {
      const trimmed = term.trim()
      if (!trimmed) return []
      const rows = await db.candidate.findMany({
        where: { AND: [NOT_DELETED, buildPersonSearchWhere(trimmed)] },
        select: { id: true, firstName: true, lastName: true, status: true },
        orderBy: { lastName: 'asc' },
        take: limit,
      })
      return rows.filter((r) => r.id !== excludeId)
    },
    candidateView: async (id: string): Promise<SponsorshipView | null> => {
      const row = await db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        select: {
          sponsor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              status: true,
              deletedAt: true,
            },
          },
          filleules: {
            where: NOT_DELETED,
            select: { id: true, firstName: true, lastName: true, status: true },
            orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
          },
        },
      })
      if (!row) return null
      const toPeer = (c: {
        id: string
        firstName: string
        lastName: string
        status: CandidateStatus
      }): SponsorshipPeer => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`.trim(),
        status: c.status,
      })
      const sponsor =
        row.sponsor && !row.sponsor.deletedAt ? toPeer(row.sponsor) : null
      return { sponsor, filleules: row.filleules.map(toPeer) }
    },
  }
}

export const sponsorshipReadRepository = makeSponsorshipReadRepository()
