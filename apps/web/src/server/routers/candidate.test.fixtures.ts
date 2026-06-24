import { vi } from 'vitest'
import { mockProvider } from '@/server/ai/mock-provider'
import type { CandidateDeps } from '@/server/routers/candidate'

export const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

export const profileFixture = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: null,
  phone: null,
  address: null,
  city: 'Lyon',
  postalCode: null,
  jobTitleId: 'jt1',
  mobilityRadiusKm: null,
  mobilityNotes: null,
  availableFrom: null,
  notes: null,
  referentId: 'u1',
  cvUrl: null,
  cvSummary: null,
  anonymizedProfile: null,
  jobTitle: { id: 'jt1', name: 'Pharmacien' },
  referent: { id: 'u1', name: 'Recruteur' },
  softwares: [],
  contractPreferences: [],
  missions: [],
}

export function makeCandidateDeps(overrides: Partial<CandidateDeps> = {}): CandidateDeps {
  return {
    listForKanban: vi.fn().mockResolvedValue([
      {
        id: 'c1',
        firstName: 'Camille',
        lastName: 'Durand',
        city: 'Lyon',
        jobTitle: { name: 'Pharmacien' },
        referent: { name: 'Recruteur' },
        missions: [],
      },
    ]),
    listStages: vi.fn().mockResolvedValue([{ id: 's1', name: 'Nouveau' }]),
    search: vi.fn().mockResolvedValue([
      {
        id: 'c1',
        firstName: 'Camille',
        lastName: 'Durand',
        city: 'Lyon',
        postalCode: '69003',
        jobTitle: { name: 'Pharmacien' },
      },
    ]),
    findProfileById: vi.fn().mockResolvedValue(profileFixture),
    updateProfile: vi.fn().mockResolvedValue(profileFixture),
    createProfile: vi.fn().mockResolvedValue({ id: 'c-new' }),
    referentials: vi.fn().mockResolvedValue({
      jobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
      softwares: [],
      recruiters: [{ id: 'u1', name: 'Recruteur' }],
      pipelineStages: [{ id: 's1', name: 'Nouveau', position: 0 }],
    }),
    uploadCvBlob: vi.fn(),
    deleteCvBlob: vi.fn(),
    runCvExtraction: vi.fn(),
    listJobTitles: vi.fn(),
    confirmCvExtraction: vi.fn(),
    findDocumentsProfile: vi.fn().mockResolvedValue(null),
    updateDerivedFields: vi.fn(),
    provider: mockProvider,
    ...overrides,
  }
}
