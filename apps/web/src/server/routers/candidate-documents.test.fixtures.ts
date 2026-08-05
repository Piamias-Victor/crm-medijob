import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

export const documentsProfile = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: '0612345678',
  address: '12 rue Test',
  city: 'Lyon',
  postalCode: '69001',
  notes: '5 ans en officine',
  cvSummary: null as string | null,
  anonymizedProfile: null as string | null,
  jobTitle: { name: 'Pharmacien' },
  mobilityRadiusKm: 30,
  mobilityNotes: 'Rhône-Alpes',
  availableFrom: null,
  softwares: [{ software: { name: 'Winpharma' } }],
}

export function documentsCaller(overrides: Partial<ReturnType<typeof makeCandidateDeps>> = {}) {
  const updateDerivedFields = vi.fn().mockImplementation(async (_id, fields) => ({
    ...documentsProfile,
    ...fields,
  }))
  const deps = makeCandidateDeps({
    findDocumentsProfile: vi.fn().mockResolvedValue(documentsProfile),
    updateDerivedFields,
    ...overrides,
  })
  return {
    caller: createCallerFactory(makeCandidateRouter(deps))({ session }),
    updateDerivedFields,
  }
}
