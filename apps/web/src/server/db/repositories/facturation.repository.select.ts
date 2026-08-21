import type { Prisma } from '@prisma/client'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'

export const facturationMissionSelect = {
  id: true,
  pharmacyId: true,
  referentId: true,
  contractType: true,
  status: true,
  marge: true,
  pharmacy: { select: { name: true } },
  referent: { select: { name: true } },
  devis: {
    where: NOT_DELETED,
    select: {
      id: true,
      missionId: true,
      kind: true,
      status: true,
      hours: true,
      hourlyRate: true,
      amountHt: true,
      amountTtc: true,
      htSource: true,
      sentAt: true,
      acceptedAt: true,
      invoicedAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.MissionSelect

export type FacturationMissionQueryRow = Prisma.MissionGetPayload<{
  select: typeof facturationMissionSelect
}>
