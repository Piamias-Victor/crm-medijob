import type { Prisma } from '@prisma/client'
import { TERMINAL_MISSION_STATUSES } from '@/lib/pipeline-constants'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'

export const ACTIVE_MISSION_STATUS_FILTER: Prisma.MissionWhereInput = {
  status: { notIn: [...TERMINAL_MISSION_STATUSES] },
}

export function buildActiveMissionClause(): Prisma.MissionWhereInput {
  return { ...NOT_DELETED, ...ACTIVE_MISSION_STATUS_FILTER }
}
