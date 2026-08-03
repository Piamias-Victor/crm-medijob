// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { makeMissionDeps, missionCaller } from '@/server/routers/mission.test.fixtures'

describe('missionRouter ActivityLog lifecycle', () => {
  it('logs ActivityLog lifecycle on create', async () => {
    const deps = makeMissionDeps()
    await missionCaller(deps).create({
      title: 'CDI',
      jobTitleId: 'jt1',
      contractType: 'CDI',
      pharmacyId: 'p1',
      referentId: 'u1',
      startDate: new Date('2026-04-01'),
    })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'created',
      entityType: 'MISSION',
      entityId: 'm1',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })

  it('logs ActivityLog lifecycle on update', async () => {
    const deps = makeMissionDeps()
    await missionCaller(deps).update({
      id: 'm1',
      data: {
        title: 'Adjoint CDD',
        jobTitleId: 'jt1',
        contractType: 'CDD',
        pharmacyId: 'p1',
        referentId: 'u1',
        startDate: new Date('2026-04-01'),
        tempsPlein: true,
      },
    })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'updated',
      entityType: 'MISSION',
      entityId: 'm1',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })
})
