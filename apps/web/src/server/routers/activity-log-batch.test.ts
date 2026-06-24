// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  activityLogCaller,
  makeActivityLogDeps,
} from '@/server/routers/activity-log.test.fixtures'

describe('activityLogRouter.createBatch', () => {
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
})
