import type { PrismaClient } from '@prisma/client'
import { DETAIL_MISSIONS_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

const quickViewSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  city: true,
  postalCode: true,
  status: true,
  salaryExpectations: true,
  salaryMin: true,
  salaryMax: true,
  mobilityRadiusKm: true,
  availableFrom: true,
  jobTitle: { select: { name: true } },
  referent: { select: { name: true } },
  missions: {
    take: DETAIL_MISSIONS_LIMIT,
    select: {
      stage: { select: { name: true } },
      mission: { select: { id: true, title: true, status: true } },
    },
  },
} as const

export function findCandidateQuickViewById(id: string, db: PrismaClient = defaultDb) {
  return db.candidate.findFirst({
    where: { id, ...NOT_DELETED },
    select: quickViewSelect,
  })
}
