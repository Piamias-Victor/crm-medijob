import type { Prisma } from '@prisma/client'
import type { MissionListFilters } from '@/view-models/mission-list-filters.schema'
import { buildReferentIdWhere } from '@/server/db/repositories/referent-id-where'
import { NOT_DELETED } from './soft-delete'

function dayStartUtc(isoDate: string) {
  return new Date(`${isoDate}T00:00:00.000Z`)
}

function dayEndUtc(isoDate: string) {
  return new Date(`${isoDate}T23:59:59.999Z`)
}

function buildCreatedAtWhere(filters: MissionListFilters): Prisma.DateTimeFilter | null {
  if (!filters.createdFrom && !filters.createdTo) return null
  return {
    ...(filters.createdFrom ? { gte: dayStartUtc(filters.createdFrom) } : {}),
    ...(filters.createdTo ? { lte: dayEndUtc(filters.createdTo) } : {}),
  }
}

export function buildMissionListWhere(filters: MissionListFilters = {}): Prisma.MissionWhereInput {
  const clauses: Prisma.MissionWhereInput[] = []
  const pharmacyClauses: Prisma.PharmacyWhereInput[] = []

  if (filters.contractTypes?.length) {
    clauses.push({ contractType: { in: filters.contractTypes } })
  }
  if (filters.statuses?.length) clauses.push({ status: { in: filters.statuses } })
  if (filters.jobTitleIds?.length) clauses.push({ jobTitleId: { in: filters.jobTitleIds } })
  if (filters.pharmacyIds?.length) clauses.push({ pharmacyId: { in: filters.pharmacyIds } })
  if (filters.referentIds?.length) clauses.push(buildReferentIdWhere(filters.referentIds))
  if (filters.departments?.length) {
    pharmacyClauses.push({
      OR: filters.departments.map((department) => ({ postalCode: { startsWith: department } })),
    })
  }
  if (filters.city) {
    pharmacyClauses.push({ city: { contains: filters.city, mode: 'insensitive' } })
  }
  if (pharmacyClauses.length > 0) {
    clauses.push({
      pharmacy: pharmacyClauses.length === 1 ? pharmacyClauses[0]! : { AND: pharmacyClauses },
    })
  }
  const createdAt = buildCreatedAtWhere(filters)
  if (createdAt) clauses.push({ createdAt })

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]!
  return { AND: clauses }
}

export function buildMissionListQueryWhere(filters?: MissionListFilters): Prisma.MissionWhereInput {
  const filterWhere = buildMissionListWhere(filters)
  return Object.keys(filterWhere).length === 0
    ? NOT_DELETED
    : { AND: [NOT_DELETED, filterWhere] }
}
