// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter.quickView', () => {
  it('returns mapped quick-view payload', async () => {
    const deps = makeCandidateDeps({
      findQuickViewById: vi.fn().mockResolvedValue({
        id: 'c1',
        firstName: 'Camille',
        lastName: 'Durand',
        email: null,
        phone: null,
        city: 'Lyon',
        postalCode: '69003',
        status: 'QUALIFIE',
        salaryExpectations: '45k',
        salaryMin: 40000,
        salaryMax: 50000,
        mobilityRadiusKm: 30,
        availableFrom: null,
        jobTitle: { name: 'Pharmacien' },
        referent: { name: 'Alice' },
        missions: [
          {
            mission: { id: 'm1', title: 'Titulaire', status: 'EN_RECHERCHE' },
            stage: { name: 'Contacté' },
          },
        ],
      }),
    })
    await expect(caller(deps).quickView({ id: 'c1' })).resolves.toMatchObject({
      fullName: 'Camille Durand',
      effectiveStatus: 'EN_MISSION',
      salaryExpectations: '45k',
      jobTitle: 'Pharmacien',
    })
  })
})
