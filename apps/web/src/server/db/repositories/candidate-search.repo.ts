import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { matchesFoldedCandidateSearch } from '@/lib/search-fold'
import { NOT_DELETED } from './soft-delete'

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

  const pool = await db.candidate.findMany({
    where: NOT_DELETED,
    select: searchSelect,
    orderBy: { lastName: 'asc' },
    take: DEFAULT_LIST_LIMIT,
  })

  return pool.filter((row) => matchesFoldedCandidateSearch(row, trimmed)).slice(0, limit)
}
