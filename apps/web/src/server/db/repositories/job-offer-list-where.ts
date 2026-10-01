import type { Prisma } from '@prisma/client'
import type { JobOfferListFilters } from '@/view-models/job-offer-list-filters.schema'
import { buildReferentIdWhere } from '@/server/db/repositories/referent-id-where'
import { NOT_DELETED } from './soft-delete'

function dayStartUtc(isoDate: string) {
  return new Date(`${isoDate}T00:00:00.000Z`)
}

function dayEndUtc(isoDate: string) {
  return new Date(`${isoDate}T23:59:59.999Z`)
}

export function buildJobOfferListWhere(
  filters: JobOfferListFilters = {},
): Prisma.JobOfferWhereInput {
  const clauses: Prisma.JobOfferWhereInput[] = []

  if (filters.statuses?.length) {
    clauses.push({ status: { in: filters.statuses } })
  }
  if (filters.sources?.length === 1) {
    clauses.push(
      filters.sources[0] === 'mission' ? { missionId: { not: null } } : { missionId: null },
    )
  }
  if (filters.contractTypes?.length) {
    clauses.push({
      OR: [
        { missionId: null, contractType: { in: filters.contractTypes } },
        { mission: { contractType: { in: filters.contractTypes } } },
      ],
    })
  }
  if (filters.jobTitleIds?.length) {
    clauses.push({
      OR: [
        { missionId: null, jobTitleId: { in: filters.jobTitleIds } },
        { mission: { jobTitleId: { in: filters.jobTitleIds } } },
      ],
    })
  }
  if (filters.pharmacyIds?.length) {
    clauses.push({ mission: { pharmacyId: { in: filters.pharmacyIds } } })
  }
  if (filters.referentIds?.length) {
    clauses.push({ mission: buildReferentIdWhere(filters.referentIds) })
  }
  if (filters.city) {
    const city = { contains: filters.city, mode: 'insensitive' as const }
    clauses.push({
      OR: [{ city }, { mission: { pharmacy: { city } } }],
    })
  }
  if (filters.departments?.length) {
    const depts = filters.departments.map((d) => ({ postalCode: { startsWith: d } }))
    clauses.push({
      OR: [
        { missionId: null, OR: depts },
        { mission: { pharmacy: { OR: depts } } },
      ],
    })
  }
  if (filters.createdFrom || filters.createdTo) {
    clauses.push({
      createdAt: {
        ...(filters.createdFrom ? { gte: dayStartUtc(filters.createdFrom) } : {}),
        ...(filters.createdTo ? { lte: dayEndUtc(filters.createdTo) } : {}),
      },
    })
  }

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]!
  return { AND: clauses }
}

export function buildJobOfferListQueryWhere(
  filters?: JobOfferListFilters,
): Prisma.JobOfferWhereInput {
  const filterWhere = buildJobOfferListWhere(filters)
  return Object.keys(filterWhere).length === 0
    ? NOT_DELETED
    : { AND: [NOT_DELETED, filterWhere] }
}
