// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeActivityLogRouter } from '@/server/routers/activity-log'
import {
  activityFixture,
  activityLogCaller,
  makeActivityLogDeps,
} from '@/server/routers/activity-log.test.fixtures'

describe('activityLogRouter', () => {
  it('lists candidate activities newest first with labels', async () => {
    const rows = await activityLogCaller(makeActivityLogDeps()).listByEntity({
      entityType: 'CANDIDATE',
      entityId: 'c1',
    })
    expect(rows[0]).toMatchObject({
      id: 'a1',
      type: 'NOTE',
      typeLabel: 'Note',
      authorName: 'Recruteur Demo',
    })
  })

  it('passes ActivityType filter to repository', async () => {
    const deps = makeActivityLogDeps()
    await activityLogCaller(deps).listByEntity({
      entityType: 'CANDIDATE',
      entityId: 'c1',
      type: 'EMAIL',
    })
    expect(deps.listByEntity).toHaveBeenCalledWith({
      entityType: 'CANDIDATE',
      entityId: 'c1',
      type: 'EMAIL',
    })
  })

  it('creates manual log with session user as author', async () => {
    const deps = makeActivityLogDeps()
    const date = new Date('2026-06-12T14:30:00Z')
    await activityLogCaller(deps).create({
      entityType: 'CANDIDATE',
      entityId: 'c1',
      type: 'NOTE',
      content: 'Relance téléphonique',
      date,
    })
    expect(deps.create).toHaveBeenCalledWith({
      entityType: 'CANDIDATE',
      entityId: 'c1',
      type: 'NOTE',
      content: 'Relance téléphonique',
      date,
      authorId: 'u1',
    })
  })

  it('maps created row through view-model', async () => {
    const row = await activityLogCaller(makeActivityLogDeps()).create({
      entityType: 'CANDIDATE',
      entityId: 'c1',
      type: 'NOTE',
      date: new Date('2026-06-12T14:30:00Z'),
    })
    expect(row.typeLabel).toBe('Note')
    expect(row.authorName).toBe(activityFixture.author.name)
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeActivityLogRouter(makeActivityLogDeps()))({ session: null })
    await expect(
      unauth.listByEntity({ entityType: 'CANDIDATE', entityId: 'c1' }),
    ).rejects.toThrow()
  })
})
