import type { Prisma } from '@prisma/client'

export const missionMatchingSelect = {
  id: true,
  title: true,
  description: true,
  contractType: true,
  startDate: true,
  jobTitleId: true,
  jobTitle: { select: { name: true } },
  pharmacy: { select: { name: true, city: true, postalCode: true } },
} satisfies Prisma.MissionSelect

export type MissionMatchingRow = Prisma.MissionGetPayload<{ select: typeof missionMatchingSelect }>
