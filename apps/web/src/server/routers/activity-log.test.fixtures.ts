import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeActivityLogRouter, type ActivityLogDeps } from '@/server/routers/activity-log'
import type { ActivityLogEntity } from '@/view-models/activity-log'

export const activityEntity: ActivityLogEntity = {
  id: 'a1',
  type: 'NOTE',
  content: 'Premier échange',
  date: new Date('2026-02-01T10:00:00Z'),
  createdAt: new Date('2026-02-01T10:00:00Z'),
  author: { name: 'Recruteur Demo' },
}

export const devisEntity: ActivityLogEntity = {
  id: 'a2',
  type: 'DEVIS',
  content: 'Devis titulaire',
  date: new Date('2026-02-02T14:00:00Z'),
  createdAt: new Date('2026-02-02T14:00:00Z'),
  author: { name: 'Recruteur Demo' },
}

export const activitySession = {
  user: { id: 'u1', role: 'RECRUTEUR' as const },
  expires: '2999-01-01',
}

export function makeActivityLogDeps(overrides: Partial<ActivityLogDeps> = {}): ActivityLogDeps {
  return {
    listByEntity: vi.fn().mockResolvedValue([activityEntity, devisEntity]),
    create: vi.fn().mockResolvedValue(devisEntity),
    ...overrides,
  }
}

export function activityLogCaller(deps: ActivityLogDeps) {
  return createCallerFactory(makeActivityLogRouter(deps))({ session: activitySession })
}
