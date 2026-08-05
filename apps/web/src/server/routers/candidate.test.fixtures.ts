import { vi } from 'vitest'
import { mockProvider } from '@/server/ai/mock-provider'
import { candidateExportFixture } from '@/server/routers/candidate-export.fixture'
import { profileFixture } from '@/server/routers/candidate-profile.fixture'
import type { CandidateDeps } from '@/server/routers/candidate'

export { profileFixture }
export const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }
export const directionSession = {
  user: { id: 'u1', role: 'DIRECTION' as const },
  expires: '2999-01-01',
}

export function makeCandidateDeps(overrides: Partial<CandidateDeps> = {}): CandidateDeps {
  return {
    listForKanban: vi.fn().mockResolvedValue([
      {
        id: 'c1',
        firstName: 'Camille',
        lastName: 'Durand',
        city: 'Lyon',
        postalCode: '69003',
        latitude: null,
        longitude: null,
        availableFrom: null,
        status: 'NOUVEAU',
        createdAt: new Date('2026-01-15'),
        jobTitle: { name: 'Pharmacien' },
        referent: { name: 'Recruteur' },
        missions: [],
      },
    ]),
    findQuickViewById: vi.fn().mockResolvedValue(null),
    listMapPins: vi.fn().mockResolvedValue([
      { id: 'c1', label: 'Camille Durand', latitude: 45.7, longitude: 4.8 },
    ]),
    listForExport: vi.fn().mockResolvedValue([candidateExportFixture]),
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
    findIdentityByEmail: vi.fn().mockResolvedValue(null),
    findIdentityByEmailAny: vi.fn().mockResolvedValue(null),
    findIdentityByPhoneAny: vi.fn().mockResolvedValue(null),
    findIdentityByNamePhone: vi.fn().mockResolvedValue(null),
    mergeCandidates: vi.fn().mockResolvedValue({ id: 'c1' }),
    findDocumentsProfile: vi.fn().mockResolvedValue(null),
    findPharmacyForContext: vi.fn().mockResolvedValue(null),
    findContactById: vi.fn().mockResolvedValue(null),
    findCandidateGeo: vi.fn().mockResolvedValue(null),
    listPharmaciesForRadius: vi.fn().mockResolvedValue([]),
    lookupPostal: vi.fn().mockResolvedValue(null),
    lookupQuery: vi.fn().mockResolvedValue(null),
    updateDerivedFields: vi.fn(),
    provider: mockProvider,
    logLifecycle: vi.fn().mockResolvedValue(undefined),
    gdprErase: {
      findCandidateForErase: vi.fn().mockResolvedValue(null),
      listDocumentUrls: vi.fn().mockResolvedValue([]),
      listApplicationCvUrls: vi.fn().mockResolvedValue([]),
      deleteBlobs: vi.fn().mockResolvedValue(undefined),
      hardDeleteCandidateCascade: vi.fn().mockResolvedValue(undefined),
      createAudit: vi.fn().mockResolvedValue(undefined),
    },
    ...overrides,
  }
}
