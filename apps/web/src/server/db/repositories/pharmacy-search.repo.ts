import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

const contains = (needle: string) => ({ contains: needle, mode: 'insensitive' as const })

export async function searchPharmacies(db: PrismaClient, term: string, limit = 8) {
  const trimmed = term.trim()
  if (!trimmed) return []

  return db.pharmacy.findMany({
    where: {
      AND: [
        NOT_DELETED,
        {
          OR: [
            { name: contains(trimmed) },
            { city: contains(trimmed) },
            { siret: contains(trimmed) },
            { postalCode: contains(trimmed) },
          ],
        },
      ],
    },
    orderBy: { name: 'asc' },
    take: limit,
  })
}
