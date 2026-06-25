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
import { buildCandidateExportSelect } from './candidate-export-select.builder'
import { buildCandidateListQuery } from './candidate-list-query'
import { makeCandidateDuplicateRepository } from './candidate-duplicate.repo'
import { makeCandidateMergeRepository } from './candidate-merge.repo'
import type { CandidateProfileUpdate } from './candidate-profile.repository'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'
import type { RawCandidateExport } from '@/view-models/candidate-export.types'

export type { CandidateProfileUpdate } from './candidate-profile.repository'

export function makeCandidateRepository(db: PrismaClient = defaultDb) {
  const profile = makeCandidateProfileRepository(db)
  const duplicate = makeCandidateDuplicateRepository(db)
  const merge = makeCandidateMergeRepository(db)

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
    findIdentityByEmail: duplicate.findIdentityByEmail,
    findIdentityByNamePhone: duplicate.findIdentityByNamePhone,
    mergeCandidates: (keptId: string, absorbedId: string | undefined, data: CandidateProfileUpdate) =>
      merge.merge(keptId, absorbedId, data),
    search: (term: string, limit = 8) => searchCandidates(db, term, limit),
    listForMatching: (limit = DEFAULT_LIST_LIMIT): Promise<CandidateMatchingRow[]> =>
      db.candidate.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: candidateMatchingSelect,
      }),
    listForKanban: (filters: CandidateListFilters = {}, limit = DEFAULT_LIST_LIMIT) =>
      buildCandidateListQuery(db, filters, candidateCvthequeSelect, limit),
    listForExport: async (filters: CandidateListFilters = {}, columnIds: CvthequeExportColumnId[]) =>
      (await buildCandidateListQuery(
        db,
        filters,
        buildCandidateExportSelect(columnIds),
      )) as unknown as RawCandidateExport[],
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
