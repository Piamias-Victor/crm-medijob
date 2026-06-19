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
    const rows = await activityLogCaller(makeActivityLogDeps()).list({ contactId: 'c1' })
    expect(rows[0]).toMatchObject({
      id: activityEntity.id,
      type: 'NOTE',
      authorName: 'Recruteur Demo',
    })
  })

  it('passes ActivityType filters to repository', async () => {
    const deps = makeActivityLogDeps()
    await activityLogCaller(deps).list({ contactId: 'c1', types: ['NOTE'] })
    expect(deps.repo.list).toHaveBeenCalledWith({ contactId: 'c1', types: ['NOTE'] })
  })

  it('creates manual log with session author on contact', async () => {
    const deps = makeActivityLogDeps()
    await activityLogCaller(deps).create({
      contactId: 'c1',
      type: 'DEVIS',
      content: 'Devis titulaire',
    })
    expect(deps.repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        contactId: 'c1',
        authorId: 'u1',
        type: 'DEVIS',
      }),
    )
  })

  it('scopes pharmacy logs by pharmacyId', async () => {
    const deps = makeActivityLogDeps({
      repo: {
        list: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(activityEntity),
      },
    })
    await activityLogCaller(deps).list({ pharmacyId: 'p1' })
    expect(deps.repo.list).toHaveBeenCalledWith({ pharmacyId: 'p1', types: undefined })
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeActivityLogRouter(makeActivityLogDeps()))({ session: null })
    await expect(unauth.list({ contactId: 'c1' })).rejects.toThrow()
  })
})
