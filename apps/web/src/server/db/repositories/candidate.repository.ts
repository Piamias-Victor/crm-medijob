import type { PrismaClient, Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { makeCandidateProfileRepository } from './candidate-profile.repo'
import { searchCandidates } from './candidate-search.repo'
import {
  candidateMatchingSelect,
  type CandidateMatchingRow,
} from './candidate-matching.select'
import { candidateCvthequeSelect } from './candidate-cvtheque.select'
import { buildCandidateListWhere } from './candidate-list-where'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

export type { CandidateProfileUpdate } from './candidate-profile.repository'

export function makeCandidateRepository(db: PrismaClient = defaultDb) {
  const profile = makeCandidateProfileRepository(db)

  return {
    create: (data: Prisma.CandidateCreateInput) => db.candidate.create({ data }),
    createProfile: profile.createProfile,
    findById: (id: string) =>
      db.candidate.findFirst({ where: { id, ...NOT_DELETED } }),
    findProfileById: profile.findProfileById,
    findDocumentsProfile: profile.findDocumentsProfile,
    updateDerivedFields: profile.updateDerivedFields,
    updateProfile: profile.updateProfile,
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.candidate.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    findIdentityByEmail: (email: string) =>
      db.candidate.findFirst({
        where: { ...NOT_DELETED, email: { equals: email.trim(), mode: 'insensitive' } },
        select: { id: true, email: true, firstName: true, lastName: true, phone: true },
      }),
    findIdentityByNamePhone: (firstName: string, lastName: string, phone: string) =>
      db.candidate.findFirst({
        where: {
          ...NOT_DELETED,
          phone: phone.trim(),
          firstName: { equals: firstName.trim(), mode: 'insensitive' },
          lastName: { equals: lastName.trim(), mode: 'insensitive' },
        },
        select: { id: true, email: true, firstName: true, lastName: true, phone: true },
      }),
    search: (term: string, limit = 8) => searchCandidates(db, term, limit),
    listForMatching: (limit = DEFAULT_LIST_LIMIT): Promise<CandidateMatchingRow[]> =>
      db.candidate.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: candidateMatchingSelect,
      }),
    listForKanban: (filters: CandidateListFilters = {}, limit = DEFAULT_LIST_LIMIT) => {
      const filterWhere = buildCandidateListWhere(filters)
      const where: Prisma.CandidateWhereInput =
        Object.keys(filterWhere).length === 0
          ? NOT_DELETED
          : { AND: [NOT_DELETED, filterWhere] }
      return db.candidate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: candidateCvthequeSelect,
      })
    },
    findForContext: (id: string) =>
      db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        select: {
          firstName: true,
          lastName: true,
          city: true,
          availableFrom: true,
          mobilityRadiusKm: true,
          cvSummary: true,
          notes: true,
        },
      }),
    softDelete: (id: string) =>
      db.candidate.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const candidateRepository = makeCandidateRepository()
