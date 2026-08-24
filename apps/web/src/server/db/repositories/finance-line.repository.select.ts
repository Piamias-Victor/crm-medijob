import type { Prisma } from '@prisma/client'

export const financeLineSelect = {
  id: true,
  kind: true,
  pharmacyId: true,
  candidateId: true,
  missionId: true,
  devisId: true,
  hours: true,
  hourlyRate: true,
  amountHt: true,
  htSource: true,
  marge: true,
  occurredAt: true,
  cancelled: true,
  invoiced: true,
  paid: true,
  referentId: true,
  placementContractType: true,
  pharmacy: { select: { name: true } },
  candidate: { select: { firstName: true, lastName: true } },
  referent: { select: { name: true } },
  devis: { select: { status: true } },
} satisfies Prisma.FinanceLineSelect

export type FinanceLineQueryRow = Prisma.FinanceLineGetPayload<{
  select: typeof financeLineSelect
}>
