import type { Prisma } from '@prisma/client'
import type { PharmacyListFilters } from '@/view-models/pharmacy-list-filters.schema'
import { buildPharmacyActiveMissionWhere } from '@/server/db/repositories/pharmacy-list-where-clauses'
import { buildReferentIdWhere } from '@/server/db/repositories/referent-id-where'

export function buildPharmacyListWhere(filters: PharmacyListFilters = {}): Prisma.PharmacyWhereInput {
  const clauses: Prisma.PharmacyWhereInput[] = []

  if (filters.statuses?.length) clauses.push({ status: { in: filters.statuses } })
  if (filters.groupementIds?.length) clauses.push({ groupementId: { in: filters.groupementIds } })
  if (filters.softwareIds?.length) clauses.push({ softwareId: { in: filters.softwareIds } })
  if (filters.departments?.length) {
    clauses.push({ OR: filters.departments.map((d) => ({ postalCode: { startsWith: d } })) })
  }
  if (filters.activeMission != null) clauses.push(buildPharmacyActiveMissionWhere(filters.activeMission))
  if (filters.referentIds?.length) clauses.push(buildReferentIdWhere(filters.referentIds))

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]!
  return { AND: clauses }
}
