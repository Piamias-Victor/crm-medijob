// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

const profileData = {
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
      status: 'NOUVEAU' as const,
  referentId: 'u1',
  mobilityRadiusKm: 30,
  softwareIds: [] as string[],
  contractTypes: [] as ('CDI' | 'CDD' | 'INTERIM' | 'VACATION')[],
}

describe('candidateRouter ActivityLog lifecycle', () => {
  it('logs ActivityLog lifecycle on create', async () => {
    const deps = makeCandidateDeps()
    await caller(deps).create({
      firstName: 'Alice',
      lastName: 'Martin',
      jobTitleId: 'jt1',
      status: 'NOUVEAU' as const,
      referentId: 'u1',
      mobilityRadiusKm: 20,
      softwareIds: ['sw1'],
      contractTypes: ['CDI'],
    })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'created',
      entityType: 'CANDIDATE',
      entityId: 'c-new',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })

  it('logs ActivityLog lifecycle on update', async () => {
    const deps = makeCandidateDeps()
    await caller(deps).update({ id: 'c1', data: profileData })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'updated',
      entityType: 'CANDIDATE',
      entityId: 'c1',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })
})
