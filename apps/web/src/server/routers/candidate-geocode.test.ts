// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'
import { profileFixture } from '@/server/routers/candidate-profile.fixture'

function caller(deps: ReturnType<typeof makeCandidateDeps>) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

const baseInput = {
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  status: 'NOUVEAU' as const,
  mobilityRadiusKm: 30,
  softwareIds: [] as string[],
  contractTypes: [] as [],
  address: '1 rue A',
  city: 'Lyon',
  postalCode: '69001',
}

describe('candidateRouter geocode on write', () => {
  it('persists lat/lng on create when address present', async () => {
    const createProfile = vi.fn().mockResolvedValue({ id: 'c-new' })
    const lookupQuery = vi.fn().mockResolvedValue({ lat: 45.75, lon: 4.85 })
    await caller(makeCandidateDeps({ createProfile, lookupQuery })).create(baseInput)
    expect(createProfile).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 45.75, longitude: 4.85 }),
    )
  })

  it('keeps existing coords when address unchanged', async () => {
    const updateProfile = vi.fn().mockResolvedValue(profileFixture)
    const lookupQuery = vi.fn()
    const findProfileById = vi.fn().mockResolvedValue({
      ...profileFixture,
      address: '1 rue A',
      city: 'Lyon',
      postalCode: '69001',
      latitude: 45.1,
      longitude: 4.1,
    })
    await caller(makeCandidateDeps({ updateProfile, lookupQuery, findProfileById })).update({
      id: 'c1',
      data: baseInput,
    })
    expect(lookupQuery).not.toHaveBeenCalled()
    expect(updateProfile).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({ latitude: 45.1, longitude: 4.1 }),
    )
  })
})
