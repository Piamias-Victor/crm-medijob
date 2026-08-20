import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { NOT_DELETED } from './soft-delete'

export function listContactsByPharmacyWithEmail(
  db: PrismaClient,
  pharmacyId: string,
  limit = DEFAULT_LIST_LIMIT,
) {
  return db.contact.findMany({
    where: {
      pharmacyId,
      ...NOT_DELETED,
      email: { not: null },
      NOT: { email: '' },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isPrimary: true,
    },
    orderBy: [{ isPrimary: 'desc' }, { lastName: 'asc' }],
    take: limit,
  })
}

export function listContactsByPharmacyIds(
  db: PrismaClient,
  pharmacyIds: string[],
  limitPerPharmacy = DEFAULT_LIST_LIMIT,
) {
  if (pharmacyIds.length === 0) return Promise.resolve([])
  return db.contact.findMany({
    where: { pharmacyId: { in: pharmacyIds }, ...NOT_DELETED },
    select: { id: true, firstName: true, lastName: true, pharmacyId: true },
    orderBy: { createdAt: 'desc' },
    take: limitPerPharmacy * pharmacyIds.length,
  })
}
