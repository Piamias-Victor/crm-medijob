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

function presentCaller(overrides: Partial<ReturnType<typeof makeCandidateDeps>> = {}) {
  const deps = makeCandidateDeps({
    findDocumentsProfile: vi.fn().mockResolvedValue(documentsProfile),
    findPharmacyForContext: vi.fn().mockResolvedValue({
      name: 'Pharmacie du Centre',
      city: 'Lyon',
      status: 'ACTIF',
      notes: null,
    }),
    findContactById: vi.fn().mockResolvedValue({
      id: 'ct1',
      pharmacyId: 'p1',
      email: 'titulaire@example.com',
    }),
    ...overrides,
  })
  return { caller: createCallerFactory(makeCandidateRouter(deps))({ session }), deps }
}

describe('candidate.presentToPharmacy', () => {
  it('returns Zod-valid draft and recipient email', async () => {
    const { caller } = presentCaller()
    const result = await caller.presentToPharmacy({
      candidateId: 'c1',
      pharmacyId: 'p1',
      contactId: 'ct1',
    })
    expect(result.subject.length).toBeGreaterThan(0)
    expect(result.body.length).toBeGreaterThan(0)
    expect(result.to).toBe('titulaire@example.com')
    expect(result.contactId).toBe('ct1')
  })

  it('rejects contact without valid email', async () => {
    const { caller } = presentCaller({
      findContactById: vi.fn().mockResolvedValue({
        id: 'ct1',
        pharmacyId: 'p1',
        email: '',
      }),
    })
    await expect(
      caller.presentToPharmacy({ candidateId: 'c1', pharmacyId: 'p1', contactId: 'ct1' }),
    ).rejects.toMatchObject({ message: 'Le contact sélectionné n’a pas d’email valide.' })
  })

  it('rejects contact from another pharmacy', async () => {
    const { caller } = presentCaller({
      findContactById: vi.fn().mockResolvedValue({
        id: 'ct1',
        pharmacyId: 'p2',
        email: 'titulaire@example.com',
      }),
    })
    await expect(
      caller.presentToPharmacy({ candidateId: 'c1', pharmacyId: 'p1', contactId: 'ct1' }),
    ).rejects.toMatchObject({ message: 'Contact invalide pour cette pharmacie.' })
  })
})
