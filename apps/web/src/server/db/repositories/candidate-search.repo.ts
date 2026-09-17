import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import { buildPersonSearchWhere } from './candidate-list-where-search'

const searchSelect = {
  id: true,
  firstName: true,
  lastName: true,
  city: true,
  postalCode: true,
  jobTitle: { select: { name: true } },
} as const

export async function searchCandidates(db: PrismaClient, term: string, limit = 8) {
  const trimmed = term.trim()
  if (!trimmed) return []

  return db.candidate.findMany({
    where: { AND: [NOT_DELETED, buildPersonSearchWhere(trimmed)] },
    select: searchSelect,
    orderBy: { lastName: 'asc' },
    take: limit,
  })
}
