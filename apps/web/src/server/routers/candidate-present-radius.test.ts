// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

const documentsProfile = {
  id: 'c1',
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  phone: '0612345678',
  address: '12 rue Test',
  city: 'Lyon',
  postalCode: '69001',
  notes: '5 ans en officine',
  cvSummary: 'Profil expérimenté',
  anonymizedProfile: null,
  jobTitle: { name: 'Pharmacien' },
  mobilityRadiusKm: 30,
  mobilityNotes: 'Rhône-Alpes',
  availableFrom: null,
  softwares: [{ software: { name: 'Winpharma' } }],
}

const pharmacies = [
  {
    id: 'p1',
    name: 'Pharmacie A',
    city: 'Lyon',
    postalCode: '69002',
    email: 'officine-a@example.com',
    contacts: [{ id: 'ct1', email: 'titulaire-a@example.com' }],
  },
  {
    id: 'p2',
    name: 'Pharmacie B',
    city: 'Lyon',
    postalCode: '69003',
    email: 'officine-b@example.com',
    contacts: [],
  },
]

function radiusCaller(overrides: Partial<ReturnType<typeof makeCandidateDeps>> = {}) {
  const deps = makeCandidateDeps({
    findDocumentsProfile: vi.fn().mockResolvedValue(documentsProfile),
    findCandidateGeo: vi.fn().mockResolvedValue({
      postalCode: '69001',
      address: '12 rue Test',
      city: 'Lyon',
    }),
    listPharmaciesForRadius: vi.fn().mockResolvedValue(pharmacies),
    lookupPostal: vi.fn().mockResolvedValue({ lat: 45.75, lon: 4.85 }),
    lookupQuery: vi.fn(),
    ...overrides,
  })
  return { caller: createCallerFactory(makeCandidateRouter(deps))({ session }), deps }
}

describe('candidate.presentInRadius', () => {
  it('returns generic draft for the candidate', async () => {
    const { caller } = radiusCaller()
    const result = await caller.presentInRadius({ candidateId: 'c1' })
    expect(result.subject.length).toBeGreaterThan(0)
    expect(result.body.length).toBeGreaterThan(0)
  })
})

describe('candidate.listPharmaciesInRadius', () => {
  it('exposes pharmacies within radius for selection', async () => {
    const { caller } = radiusCaller()
    const result = await caller.listPharmaciesInRadius({ candidateId: 'c1', radiusKm: 15 })
    expect(result.pharmacies.length).toBeGreaterThan(0)
    expect(result.centerLabel).toContain('Lyon')
  })
})
