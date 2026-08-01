import type { Prisma } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

export const pharmacyListInclude = {
  groupement: { select: { name: true } },
  software: { select: { name: true } },
  referent: { select: { name: true } },
  contacts: {
    where: { ...NOT_DELETED, isPrimary: true },
    take: 1,
    select: { firstName: true, lastName: true, isPrimary: true },
  },
  _count: { select: { missions: { where: NOT_DELETED } } },
} satisfies Prisma.PharmacyInclude
