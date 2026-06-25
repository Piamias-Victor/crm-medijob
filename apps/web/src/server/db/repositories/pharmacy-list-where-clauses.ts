import type { Prisma } from '@prisma/client'
import { buildActiveMissionClause } from '@/server/db/repositories/mission-active-where'

const activeMissionClause = buildActiveMissionClause()

export function buildPharmacyActiveMissionWhere(active: boolean): Prisma.PharmacyWhereInput {
  return active
    ? { missions: { some: activeMissionClause } }
    : { NOT: { missions: { some: activeMissionClause } } }
}
