import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { filterSearchPool } from '@/lib/search-pool'
import { NOT_DELETED } from './soft-delete'

const searchSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  pharmacy: { select: { name: true } },
} as const

export async function searchContacts(db: PrismaClient, term: string, limit = 8) {
  const trimmed = term.trim().toLowerCase()
  if (!trimmed) return []

  const pool = await db.contact.findMany({
    where: NOT_DELETED,
    select: searchSelect,
    orderBy: { lastName: 'asc' },
    take: DEFAULT_LIST_LIMIT,
  })

  return filterSearchPool(
    pool,
    trimmed,
    (row, term) => {
      const haystack = `${row.firstName} ${row.lastName} ${row.email ?? ''} ${row.pharmacy.name}`.toLowerCase()
      return haystack.includes(term.toLowerCase())
    },
    limit,
  )
}
