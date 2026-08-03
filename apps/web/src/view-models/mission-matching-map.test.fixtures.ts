import type { CandidateMatchingRow } from '@/server/db/repositories/candidate-matching.select'

export function matchingRow(id: string): CandidateMatchingRow {
  return {
    id,
    firstName: 'Camille',
    lastName: 'Durand',
    email: 'camille@example.com',
    phone: '0612345678',
    jobTitleId: 'jt1',
    city: 'Lyon',
    postalCode: '69003',
    mobilityRadiusKm: 30,
    availableFrom: null,
    salaryExpectations: '45k',
    salaryMin: 40000,
    salaryMax: 50000,
    jobTitle: { name: 'Pharmacien' },
    contractPreferences: [{ contractType: 'CDI' }],
  }
}

export const matchingCandidateInput = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  jobTitleName: 'Pharmacien',
  city: 'Lyon',
  postalCode: '69003',
  mobilityRadiusKm: 30,
  availableFrom: null,
  preferredContractTypes: ['CDI' as const],
  salaryExpectations: '45k',
  salaryMin: 40000,
  salaryMax: 50000,
}
