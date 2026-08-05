import type { Prisma } from '@prisma/client'

export const candidateContextSelect = {
  firstName: true,
  lastName: true,
  city: true,
  availableFrom: true,
  mobilityRadiusKm: true,
  mobilityNotes: true,
  cvSummary: true,
  notes: true,
  status: true,
  salaryExpectations: true,
  salaryMin: true,
  salaryMax: true,
  jobTitle: { select: { name: true } },
  softwares: { select: { software: { select: { name: true } } } },
  contractPreferences: { select: { contractType: true } },
} satisfies Prisma.CandidateSelect
