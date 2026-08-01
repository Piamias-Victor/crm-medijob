// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'
import { createCallerFactory } from '@/server/trpc'

function caller(deps: ReturnType<typeof makeCandidateDeps>) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

const row = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@x.fr',
  jobTitleId: 'jt1',
  status: 'NOUVEAU' as const,
  mobilityRadiusKm: 20,
  softwareIds: [] as string[],
  contractTypes: [] as [],
}

describe('candidate.commitImport', () => {
  it('creates clean rows and logs lifecycle', async () => {
    const createProfile = vi.fn().mockResolvedValue({ id: 'new-1' })
    const logLifecycle = vi.fn()
    const result = await caller(makeCandidateDeps({ createProfile, logLifecycle })).commitImport([
      row,
    ])
    expect(result.createdIds).toEqual(['new-1'])
    expect(logLifecycle).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'created', entityId: 'new-1', entityType: 'CANDIDATE' }),
    )
  })

  it('queues email duplicates without create', async () => {
    const createProfile = vi.fn()
    const result = await caller(
      makeCandidateDeps({
        createProfile,
        findIdentityByEmailAny: vi.fn().mockResolvedValue({
          id: 'exist-1',
          firstName: 'Camille',
          lastName: 'Durand',
          email: 'camille@x.fr',
          phone: null,
        }),
      }),
    ).commitImport([row])
    expect(result.createdIds).toEqual([])
    expect(result.duplicates[0]?.matches[0]?.candidateId).toBe('exist-1')
    expect(createProfile).not.toHaveBeenCalled()
  })
})
