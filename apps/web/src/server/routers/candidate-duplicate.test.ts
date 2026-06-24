// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

const probe = {
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice@x.fr',
  phone: '0600000001',
}

describe('candidateRouter detectDuplicate', () => {
  it('returns email match via repository identities', async () => {
    const deps = makeCandidateDeps({
      findIdentityByEmail: vi.fn().mockResolvedValue({
        id: 'c1',
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@x.fr',
        phone: '0600000001',
      }),
      findIdentityByNamePhone: vi.fn().mockResolvedValue(null),
    })
    const result = await caller(deps).detectDuplicate(probe)
    expect(result).toEqual([expect.objectContaining({ candidateId: 'c1', reason: 'email' })])
  })

  it('returns both matches when email and name_phone differ', async () => {
    const deps = makeCandidateDeps({
      findIdentityByEmail: vi.fn().mockResolvedValue({
        id: 'c1',
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@x.fr',
        phone: null,
      }),
      findIdentityByNamePhone: vi.fn().mockResolvedValue({
        id: 'c2',
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'other@x.fr',
        phone: '0600000001',
      }),
    })
    const result = await caller(deps).detectDuplicate(probe)
    expect(result.map((m) => m.candidateId).sort()).toEqual(['c1', 'c2'])
  })
})

describe('candidateRouter merge', () => {
  it('delegates merged profile to repository', async () => {
    const deps = makeCandidateDeps({
      findIdentityByEmail: vi.fn().mockResolvedValue({ id: 'c1', firstName: 'Alice', lastName: 'Martin', email: 'alice@x.fr', phone: null }),
      findIdentityByNamePhone: vi.fn().mockResolvedValue(null),
    })
    const result = await caller(deps).merge({
      keptId: 'c1',
      absorbedId: 'c2',
      data: {
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@x.fr',
        jobTitleId: 'jt1',
        referentId: 'u1',
        mobilityRadiusKm: 20,
        softwareIds: [],
        contractTypes: [],
      },
    })
    expect(deps.mergeCandidates).toHaveBeenCalledWith(
      'c1',
      'c2',
      expect.objectContaining({ firstName: 'Alice', mobilityRadiusKm: 20 }),
    )
    expect(result).toEqual({ id: 'c1' })
  })
})
