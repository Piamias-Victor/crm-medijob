// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import {
  activityEntity,
  activityLogCaller,
  makeActivityLogDeps,
} from '@/server/routers/activity-log.test.fixtures'

describe('activityLogRouter MISSION scope', () => {
  it('scopes mission logs by entity', async () => {
    const deps = makeActivityLogDeps({
      listByEntity: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue(activityEntity),
    })
    await activityLogCaller(deps).listByEntity({ entityType: 'MISSION', entityId: 'm1' })
    expect(deps.listByEntity).toHaveBeenCalledWith({
      entityType: 'MISSION',
      entityId: 'm1',
      types: undefined,
    })
  })

  it('creates manual log on mission with session author', async () => {
    const deps = makeActivityLogDeps()
    await activityLogCaller(deps).create({
      entityType: 'MISSION',
      entityId: 'm1',
      type: 'APPEL',
      content: 'Relance titulaire',
      date: new Date('2026-03-01T09:00:00Z'),
    })
    expect(deps.create).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: 'MISSION',
        entityId: 'm1',
        authorId: 'u1',
        type: 'APPEL',
      }),
    )
  })
})
