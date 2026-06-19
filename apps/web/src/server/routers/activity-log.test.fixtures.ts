import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeActivityLogRouter, type ActivityLogDeps } from '@/server/routers/activity-log'
import type { ActivityLogEntity } from '@/view-models/activity-log'

export const activitySession = {
  user: { id: 'u1', role: 'RECRUTEUR' as const },
  expires: '2999-01-01',
}

export const activityFixture: ActivityLogEntity = {
  id: 'a1',
  type: 'NOTE',
  content: 'Premier contact positif',
  date: new Date('2026-06-10T10:00:00Z'),
  createdAt: new Date('2026-06-10T10:00:00Z'),
  author: { name: 'Recruteur Demo' },
}

export function makeActivityLogDeps(overrides: Partial<ActivityLogDeps> = {}): ActivityLogDeps {
  return {
    listByEntity: vi.fn().mockResolvedValue([activityFixture]),
    create: vi.fn().mockResolvedValue(activityFixture),
    ...overrides,
  }
}

export function activityLogCaller(deps: ActivityLogDeps) {
  return createCallerFactory(makeActivityLogRouter(deps))({ session: activitySession })
}
