import type { Prisma } from '@prisma/client'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import {
  buildActiveMissionWhere,
  buildAvailableWhere,
  buildProfileIncompleteWhere,
} from '@/server/db/repositories/candidate-list-where-clauses'

export function buildCandidateListWhere(
  filters: CandidateListFilters = {},
  now: Date = new Date(),
): Prisma.CandidateWhereInput {
  const clauses: Prisma.CandidateWhereInput[] = []

  if (filters.jobTitleIds?.length) clauses.push({ jobTitleId: { in: filters.jobTitleIds } })
  if (filters.departments?.length) {
    clauses.push({ OR: filters.departments.map((d) => ({ postalCode: { startsWith: d } })) })
  }
  if (filters.referentIds?.length) clauses.push({ referentId: { in: filters.referentIds } })
  if (filters.softwareIds?.length) {
    clauses.push({ softwares: { some: { softwareId: { in: filters.softwareIds } } } })
  }
  if (filters.contractTypes?.length) {
    clauses.push({ contractPreferences: { some: { contractType: { in: filters.contractTypes } } } })
  }
  if (filters.available != null) clauses.push(buildAvailableWhere(filters.available, now))
  if (filters.profileIncomplete != null) {
    clauses.push(buildProfileIncompleteWhere(filters.profileIncomplete))
  }
  if (filters.activeMission != null) clauses.push(buildActiveMissionWhere(filters.activeMission))

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]!
  return { AND: clauses }
}
