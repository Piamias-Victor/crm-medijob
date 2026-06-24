// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeActivityLogRouter } from '@/server/routers/activity-log'
import {
  activityEntity,
  activityLogCaller,
  makeActivityLogDeps,
} from '@/server/routers/activity-log.test.fixtures'

describe('activityLogRouter', () => {
  it('lists contact logs mapped to timeline rows', async () => {
    const rows = await activityLogCaller(makeActivityLogDeps()).listByEntity({
      entityType: 'CONTACT',
      entityId: 'c1',
    })
    expect(rows[0]).toMatchObject({
      id: activityEntity.id,
      type: 'NOTE',
      authorName: 'Recruteur Demo',
    })
  })

  it('passes ActivityType filters to repository', async () => {
    const deps = makeActivityLogDeps()
    await activityLogCaller(deps).listByEntity({
      entityType: 'CONTACT',
      entityId: 'c1',
      types: ['NOTE'],
    })
    expect(deps.listByEntity).toHaveBeenCalledWith({
      entityType: 'CONTACT',
      entityId: 'c1',
      types: ['NOTE'],
    })
  })

  it('creates manual log with session author on contact', async () => {
    const deps = makeActivityLogDeps()
    await activityLogCaller(deps).create({
      entityType: 'CONTACT',
      entityId: 'c1',
      type: 'DEVIS',
      content: 'Devis titulaire',
      date: new Date('2026-02-02T14:00:00Z'),
    })
    expect(deps.create).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: 'CONTACT',
        entityId: 'c1',
        authorId: 'u1',
        type: 'DEVIS',
      }),
    )
  })

  it('scopes pharmacy logs by entity', async () => {
    const deps = makeActivityLogDeps({
      listByEntity: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue(activityEntity),
    })
    await activityLogCaller(deps).listByEntity({ entityType: 'PHARMACY', entityId: 'p1' })
    expect(deps.listByEntity).toHaveBeenCalledWith({
      entityType: 'PHARMACY',
      entityId: 'p1',
      types: undefined,
    })
  })

  it('creates email logs atomically for multiple entities', async () => {
    const deps = makeActivityLogDeps()
    await activityLogCaller(deps).createBatch({
      entries: [
        {
          entityType: 'CANDIDATE',
          entityId: 'c1',
          type: 'EMAIL',
          content: 'Présentation',
          date: new Date('2026-02-02T14:00:00Z'),
        },
        {
          entityType: 'MISSION',
          entityId: 'm1',
          type: 'EMAIL',
          content: 'Présentation',
          date: new Date('2026-02-02T14:00:00Z'),
        },
      ],
    })
    expect(deps.createBatch).toHaveBeenCalledWith([
      expect.objectContaining({ entityType: 'CANDIDATE', entityId: 'c1', authorId: 'u1', type: 'EMAIL' }),
      expect.objectContaining({ entityType: 'MISSION', entityId: 'm1', authorId: 'u1', type: 'EMAIL' }),
    ])
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeActivityLogRouter(makeActivityLogDeps()))({ session: null })
    await expect(
      unauth.listByEntity({ entityType: 'CONTACT', entityId: 'c1' }),
    ).rejects.toThrow()
  })
})
