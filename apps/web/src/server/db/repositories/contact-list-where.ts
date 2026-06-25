import type { Prisma } from '@prisma/client'
import type { ContactListFilters } from '@/view-models/contact-list-filters.schema'
import { NOT_DELETED } from './soft-delete'

export const contactListInclude = {
  pharmacy: { select: { name: true, city: true, postalCode: true } },
} satisfies Prisma.ContactInclude

export function buildContactListWhere(filters: ContactListFilters = {}): Prisma.ContactWhereInput {
  const clauses: Prisma.ContactWhereInput[] = []
  const pharmacyClauses: Prisma.PharmacyWhereInput[] = []

  if (filters.roles?.length) clauses.push({ role: { in: filters.roles } })
  if (filters.pharmacyIds?.length) clauses.push({ pharmacyId: { in: filters.pharmacyIds } })
  if (filters.isPrimary != null) clauses.push({ isPrimary: filters.isPrimary })
  if (filters.pharmacyStatuses?.length) {
    pharmacyClauses.push({ status: { in: filters.pharmacyStatuses } })
  }
  if (filters.departments?.length) {
    pharmacyClauses.push({
      OR: filters.departments.map((department) => ({ postalCode: { startsWith: department } })),
    })
  }
  if (pharmacyClauses.length > 0) {
    clauses.push({
      pharmacy: pharmacyClauses.length === 1 ? pharmacyClauses[0]! : { AND: pharmacyClauses },
    })
  }

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]!
  return { AND: clauses }
}

export function buildContactListQueryWhere(filters?: ContactListFilters): Prisma.ContactWhereInput {
  const filterWhere = buildContactListWhere(filters)
  const pharmacyWhere = { ...NOT_DELETED }
  return Object.keys(filterWhere).length === 0
    ? { ...NOT_DELETED, pharmacy: pharmacyWhere }
    : { AND: [NOT_DELETED, { pharmacy: pharmacyWhere }, filterWhere] }
}
