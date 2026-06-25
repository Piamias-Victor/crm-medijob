import type { Prisma } from '@prisma/client'
import { ACTIVE_MISSION_STATUS_FILTER } from '@/server/db/repositories/mission-active-where'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'

const emptyField = (field: 'city' | 'postalCode'): Prisma.CandidateWhereInput => ({
  OR: [{ [field]: null }, { [field]: '' }],
})

const filledField = (field: 'city' | 'postalCode'): Prisma.CandidateWhereInput => ({
  NOT: emptyField(field),
})

const activeMissionClause: Prisma.MissionCandidateWhereInput = {
  mission: { ...NOT_DELETED, ...ACTIVE_MISSION_STATUS_FILTER },
}

const notOnActiveMission: Prisma.CandidateWhereInput = {
  NOT: { missions: { some: activeMissionClause } },
}

const dateAvailable = (now: Date): Prisma.CandidateWhereInput => ({
  OR: [{ availableFrom: null }, { availableFrom: { lte: now } }],
})

export function buildAvailableWhere(available: boolean, now: Date): Prisma.CandidateWhereInput {
  if (available) {
    return { AND: [dateAvailable(now), notOnActiveMission] }
  }
  return {
    OR: [{ availableFrom: { gt: now } }, { missions: { some: activeMissionClause } }],
  }
}

export function buildProfileIncompleteWhere(incomplete: boolean): Prisma.CandidateWhereInput {
  if (incomplete) {
    return {
      OR: [emptyField('city'), emptyField('postalCode'), { mobilityRadiusKm: null }],
    }
  }
  return {
    AND: [filledField('city'), filledField('postalCode'), { mobilityRadiusKm: { not: null } }],
  }
}

export function buildActiveMissionWhere(active: boolean): Prisma.CandidateWhereInput {
  return active
    ? { missions: { some: activeMissionClause } }
    : { NOT: { missions: { some: activeMissionClause } } }
}
