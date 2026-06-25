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
