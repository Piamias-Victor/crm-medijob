import type { PrismaClient } from '@prisma/client'
import type { ContractSignEmailDueRow } from '@/server/pharmacy-contract-email/send-due.types'
import { NOT_DELETED } from './soft-delete'

type Pending = { id: string; enterpriseId: string | null }

type EnterpriseRow = {
  badakanId: string
  pharmacyId: string | null
  principalEmail: string | null
  principalFirstName: string | null
}

export async function attachContractSignEmailRecipients(
  db: PrismaClient,
  pending: Pending[],
): Promise<ContractSignEmailDueRow[]> {
  const enterpriseIds = [
    ...new Set(pending.flatMap((row) => (row.enterpriseId ? [row.enterpriseId] : []))),
  ]
  const enterprises = await db.badakanEnterprise.findMany({
    where: { badakanId: { in: enterpriseIds } },
    select: {
      badakanId: true,
      pharmacyId: true,
      principalEmail: true,
      principalFirstName: true,
    },
  })
  const byEnterprise = new Map(enterprises.map((row) => [row.badakanId, row]))
  const pharmacyIds = [
    ...new Set(enterprises.flatMap((row) => (row.pharmacyId ? [row.pharmacyId] : []))),
  ]
  const [pharmacies, contacts] = await Promise.all([
    db.pharmacy.findMany({
      where: { id: { in: pharmacyIds }, ...NOT_DELETED },
      select: { id: true, email: true },
    }),
    db.contact.findMany({
      where: { pharmacyId: { in: pharmacyIds }, ...NOT_DELETED, isPrimary: true },
      select: { pharmacyId: true, email: true, firstName: true },
    }),
  ])
  const pharmacyById = new Map(pharmacies.map((row) => [row.id, row]))
  const contactByPharmacy = new Map(contacts.map((row) => [row.pharmacyId, row]))
  return pending.map((row) => toDueRow(row, byEnterprise, pharmacyById, contactByPharmacy))
}

function toDueRow(
  row: Pending,
  byEnterprise: Map<string, EnterpriseRow>,
  pharmacyById: Map<string, { id: string; email: string | null }>,
  contactByPharmacy: Map<string, { email: string | null; firstName: string }>,
): ContractSignEmailDueRow {
  const enterprise = row.enterpriseId ? byEnterprise.get(row.enterpriseId) : undefined
  const pharmacy = enterprise?.pharmacyId ? pharmacyById.get(enterprise.pharmacyId) : undefined
  const contact = enterprise?.pharmacyId ? contactByPharmacy.get(enterprise.pharmacyId) : undefined
  return {
    contractId: row.id,
    pharmacyEmail: pharmacy?.email ?? enterprise?.principalEmail ?? null,
    primaryEmail: contact?.email ?? enterprise?.principalEmail ?? null,
    primaryFirstName: contact?.firstName ?? enterprise?.principalFirstName ?? null,
  }
}
