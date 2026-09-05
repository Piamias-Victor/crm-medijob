import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

export function listContactIdentitiesByPharmacy(db: PrismaClient, pharmacyId: string) {
  return db.contact.findMany({
    where: { pharmacyId, ...NOT_DELETED },
    select: { id: true, email: true, phone: true },
  })
}
