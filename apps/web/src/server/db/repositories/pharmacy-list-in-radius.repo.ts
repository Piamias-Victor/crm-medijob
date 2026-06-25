import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

const radiusSelect = {
  id: true,
  name: true,
  city: true,
  postalCode: true,
  email: true,
  contacts: {
    where: { ...NOT_DELETED, isPrimary: true },
    take: 1,
    select: { id: true, email: true },
  },
} as const

export function listPharmaciesForRadiusSearch(db: PrismaClient, postalCodePrefix?: string | null) {
  return db.pharmacy.findMany({
    where: {
      ...NOT_DELETED,
      postalCode: {
        not: null,
        ...(postalCodePrefix ? { startsWith: postalCodePrefix } : {}),
      },
      NOT: { postalCode: '' },
    },
    select: radiusSelect,
    orderBy: { name: 'asc' },
  })
}
