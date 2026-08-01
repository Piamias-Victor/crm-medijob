import type { Prisma } from '@prisma/client'
import { ACTIVE_MISSION_STATUS_FILTER } from '@/server/db/repositories/mission-active-where'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'
import { TERMINAL_STAGE_NAMES } from '@/lib/pipeline-constants'
import type { CandidateStatus } from '@/view-models/candidate-status'

const OVERRIDE_STATUSES = ['INACTIF', 'BLACKLISTE'] as const

const nonTerminalPositioning: Prisma.MissionCandidateWhereInput = {
  mission: { ...NOT_DELETED, ...ACTIVE_MISSION_STATUS_FILTER },
  stage: { name: { notIn: [...TERMINAL_STAGE_NAMES] } },
}

const hasActivePositioning: Prisma.CandidateWhereInput = {
  missions: { some: nonTerminalPositioning },
}

const noActivePositioning: Prisma.CandidateWhereInput = {
  NOT: hasActivePositioning,
}

function clauseForStatus(status: CandidateStatus): Prisma.CandidateWhereInput {
  if (status === 'EN_MISSION') {
    return { AND: [{ status: { notIn: [...OVERRIDE_STATUSES] } }, hasActivePositioning] }
  }
  if (status === 'INACTIF' || status === 'BLACKLISTE') return { status }
  return { AND: [{ status }, noActivePositioning] }
}

export function buildEffectiveStatusWhere(
  statuses: CandidateStatus[],
): Prisma.CandidateWhereInput {
  if (statuses.length === 1) return clauseForStatus(statuses[0]!)
  return { OR: statuses.map(clauseForStatus) }
}
