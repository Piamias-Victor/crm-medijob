import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

const searchSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  pharmacy: { select: { name: true } },
} as const

const contains = (needle: string) => ({ contains: needle, mode: 'insensitive' as const })

export async function searchContacts(db: PrismaClient, term: string, limit = 8) {
  const trimmed = term.trim()
  if (!trimmed) return []

  return db.contact.findMany({
    where: {
      AND: [
        NOT_DELETED,
        {
          OR: [
            { firstName: contains(trimmed) },
            { lastName: contains(trimmed) },
            { email: contains(trimmed) },
            { pharmacy: { name: contains(trimmed) } },
          ],
        },
      ],
    },
    select: searchSelect,
    orderBy: { lastName: 'asc' },
    take: limit,
  })
}
