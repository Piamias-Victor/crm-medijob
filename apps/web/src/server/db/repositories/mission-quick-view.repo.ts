import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { toMissionQuickViewEntity } from '@/view-models/mission-quick-view-entity'

const quickViewSelect = {
  id: true,
  title: true,
  status: true,
  contractType: true,
  jobTitle: { select: { name: true } },
  referent: { select: { name: true } },
  pharmacy: {
    select: {
      name: true,
      address: true,
      postalCode: true,
      city: true,
      phone: true,
    },
  },
  activities: {
    where: { entityType: 'MISSION' as const },
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

export async function findMissionQuickViewById(id: string, db: PrismaClient = defaultDb) {
  const row = await db.mission.findFirst({
    where: { id, ...NOT_DELETED },
    select: quickViewSelect,
  })
  return row ? toMissionQuickViewEntity(row) : null
}
