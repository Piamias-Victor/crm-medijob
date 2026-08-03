import type { PrismaClient } from '@prisma/client'
import { DETAIL_MISSIONS_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

const quickViewSelect = {
  id: true,
  name: true,
  address: true,
  postalCode: true,
  city: true,
  phone: true,
  email: true,
  contacts: {
    where: { ...NOT_DELETED, isPrimary: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      isPrimary: true,
    },
  },
  missions: {
    where: NOT_DELETED,
    orderBy: { createdAt: 'desc' as const },
    take: DETAIL_MISSIONS_LIMIT,
    select: {
      id: true,
      title: true,
      status: true,
      jobTitle: { select: { name: true } },
    },
  },
  activities: {
    where: { entityType: 'PHARMACY' as const },
    orderBy: { date: 'desc' as const },
    take: 1,
    select: {
      id: true,
      type: true,
      content: true,
      date: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  },
} as const

export function findPharmacyQuickViewById(id: string, db: PrismaClient = defaultDb) {
  return db.pharmacy.findFirst({
    where: { id, ...NOT_DELETED },
    select: quickViewSelect,
  })
}
