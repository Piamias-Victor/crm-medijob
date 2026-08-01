import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

const quickViewSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isPrimary: true,
  contactRole: { select: { name: true } },
  pharmacy: { select: { id: true, name: true, city: true } },
} as const

export function findContactQuickViewById(id: string, db: PrismaClient = defaultDb) {
  return db.contact.findFirst({
    where: { id, ...NOT_DELETED },
    select: quickViewSelect,
  })
}
