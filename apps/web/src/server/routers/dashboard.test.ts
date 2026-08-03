// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeDashboardRouter } from '@/server/routers/dashboard'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const overview = {
  candidates: 10,
  pharmacies: 5,
  missionsActive: 3,
  inboxPending: 2,
  missionsUrgent: 1,
  fillRate: 40,
  alerts: {
    uncoveredMissions: {
      count: 1,
      items: [{ id: 'm1', label: 'Titulaire', href: '/missions/m1' }],
    },
    untreatedApplications: { count: 0, items: [] },
    overdueFollowUps: { count: 0, items: [] },
  },
}

describe('dashboardRouter', () => {
  it('returns overview KPIs and alerts for authenticated users', async () => {
    const getOverview = vi.fn().mockResolvedValue(overview)
    const caller = createCallerFactory(makeDashboardRouter({ getOverview }))({ session })

    await expect(caller.overview()).resolves.toEqual(overview)
    expect(getOverview).toHaveBeenCalledOnce()
  })
})
