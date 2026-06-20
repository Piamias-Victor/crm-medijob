import type { Prisma } from '@prisma/client'

export const candidateMatchingSelect = {
  id: true,
  firstName: true,
  lastName: true,
  city: true,
  postalCode: true,
  mobilityRadiusKm: true,
  availableFrom: true,
  jobTitleId: true,
  jobTitle: { select: { name: true } },
  contractPreferences: { select: { contractType: true } },
} satisfies Prisma.CandidateSelect

export type CandidateMatchingRow = Prisma.CandidateGetPayload<{ select: typeof candidateMatchingSelect }>
