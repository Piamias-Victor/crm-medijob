import type { Prisma } from '@prisma/client'

export const candidateMatchingSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  city: true,
  postalCode: true,
  mobilityRadiusKm: true,
  availableFrom: true,
  salaryExpectations: true,
  salaryMin: true,
  salaryMax: true,
  jobTitleId: true,
  jobTitle: { select: { name: true } },
  contractPreferences: { select: { contractType: true } },
} satisfies Prisma.CandidateSelect

export type CandidateMatchingRow = Prisma.CandidateGetPayload<{ select: typeof candidateMatchingSelect }>
