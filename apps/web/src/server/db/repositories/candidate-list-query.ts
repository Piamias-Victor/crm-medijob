import type { Prisma, PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { NOT_DELETED } from './soft-delete'
import { buildCandidateListWhere } from './candidate-list-where'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

export function buildCandidateListQuery<S extends Prisma.CandidateSelect>(
  db: PrismaClient,
  filters: CandidateListFilters,
  select: S,
  limit?: number,
) {
  const filterWhere = buildCandidateListWhere(filters)
  const where: Prisma.CandidateWhereInput =
    Object.keys(filterWhere).length === 0 ? NOT_DELETED : { AND: [NOT_DELETED, filterWhere] }

  return db.candidate.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    ...(limit !== undefined ? { take: limit } : {}),
    select,
  })
}

export const DEFAULT_CANDIDATE_LIST_LIMIT = DEFAULT_LIST_LIMIT
