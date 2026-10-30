import type { Prisma } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import type { PharmacyScrapeListFilters } from '@/view-models/pharmacy-scrape-list-filters'

export function buildPharmacyScrapeListWhere(
  filters: PharmacyScrapeListFilters,
  duplicateEmails: string[] = [],
): Prisma.PharmacyScrapeWhereInput {
  const where: Prisma.PharmacyScrapeWhereInput = { ...NOT_DELETED }

  if (filters.department) where.department = filters.department
  if (filters.provenance) where.provenance = filters.provenance

  if (filters.duplicatesOnly) {
    where.email = { in: duplicateEmails.length > 0 ? duplicateEmails : ['__none__'] }
  }

  const q = filters.q?.trim()
  if (q) {
    where.AND = [
      {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } },
        ],
      },
    ]
  }

  return where
}
