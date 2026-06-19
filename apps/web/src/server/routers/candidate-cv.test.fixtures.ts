import { vi } from 'vitest'
import type { CandidateDeps } from '@/server/routers/candidate'
import { makeCandidateDeps, profileFixture } from '@/server/routers/candidate.test.fixtures'

export const mockExtraction = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille.durand@example.com',
  phone: '06 12 34 56 78',
  address: '12 rue de la République',
  city: 'Lyon',
  postalCode: '69001',
  jobTitle: 'Pharmacien',
  softwares: ['Winpharma'],
  preferredContractTypes: ['CDI' as const],
  availableFrom: '2026-07-01T00:00:00.000Z',
  mobilityNotes: 'Mobilité 30 km autour de Lyon',
  profileSummary:
    'Pharmacienne avec 5 ans d’expérience en officine de quartier. Maîtrise Winpharma et accueil patient.',
}

export const pdfBase64 = Buffer.from('%PDF-1.4').toString('base64')

export function makeCvDeps(overrides: Partial<CandidateDeps> = {}): CandidateDeps {
  return makeCandidateDeps({
    uploadCvBlob: vi.fn().mockResolvedValue({ url: 'https://blob.example/cv.pdf' }),
    deleteCvBlob: vi.fn().mockResolvedValue(undefined),
    runCvExtraction: vi.fn().mockResolvedValue(mockExtraction),
    listJobTitles: vi.fn().mockResolvedValue([{ id: 'jt1', name: 'Pharmacien' }]),
    confirmCvExtraction: vi.fn().mockResolvedValue(profileFixture),
    referentials: vi.fn().mockResolvedValue({
      jobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
      softwares: [{ id: 'sw1', name: 'Winpharma' }],
      recruiters: [{ id: 'u1', name: 'Recruteur' }],
      pipelineStages: [{ id: 's1', name: 'Nouveau', position: 0 }],
    }),
    ...overrides,
  })
}
