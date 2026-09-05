import type { Prisma } from '@prisma/client'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import {
  buildActiveMissionWhere,
  buildAvailableWhere,
  buildDeclaredAvailabilityWhere,
  buildProfileIncompleteWhere,
} from '@/server/db/repositories/candidate-list-where-clauses'
import { buildEffectiveStatusWhere } from '@/server/db/repositories/candidate-list-status-where'
import { buildReferentIdWhere } from '@/server/db/repositories/referent-id-where'
import { buildPersonSearchWhere } from '@/server/db/repositories/candidate-list-where-search'

export function buildCandidateListWhere(
  filters: CandidateListFilters = {},
  now: Date = new Date(),
): Prisma.CandidateWhereInput {
  const clauses: Prisma.CandidateWhereInput[] = []

  if (filters.jobTitleIds?.length) clauses.push({ jobTitleId: { in: filters.jobTitleIds } })
  if (filters.departments?.length) {
    clauses.push({ OR: filters.departments.map((d) => ({ postalCode: { startsWith: d } })) })
  }
  if (filters.referentIds?.length) clauses.push(buildReferentIdWhere(filters.referentIds))
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
  if (filters.statuses?.length) clauses.push(buildEffectiveStatusWhere(filters.statuses))
  if (filters.origins?.length) clauses.push({ origin: { in: filters.origins } })
  if (filters.q) clauses.push(buildPersonSearchWhere(filters.q))
  if (filters.city) clauses.push({ city: { contains: filters.city, mode: 'insensitive' } })
  if (filters.maxMobilityKm != null) {
    clauses.push({ mobilityRadiusKm: { lte: filters.maxMobilityKm } })
  }
  if (filters.declaredAvailability != null) {
    clauses.push(buildDeclaredAvailabilityWhere(filters.declaredAvailability, now))
  }

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]!
  return { AND: clauses }
}
