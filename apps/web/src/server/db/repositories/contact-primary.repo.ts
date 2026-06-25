import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

export function findPrimaryContactByPharmacy(
  db: PrismaClient,
  pharmacyId: string,
  excludeContactId?: string,
) {
  return db.contact.findFirst({
    where: {
      pharmacyId,
      ...NOT_DELETED,
      isPrimary: true,
      ...(excludeContactId ? { id: { not: excludeContactId } } : {}),
    },
    select: { firstName: true, lastName: true },
  })
}
