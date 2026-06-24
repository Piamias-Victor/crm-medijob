// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeDashboardRouter } from '@/server/routers/dashboard'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

describe('dashboardRouter', () => {
  it('returns overview counts for authenticated users', async () => {
    const overview = {
      candidates: 10,
      pharmacies: 5,
      missionsActive: 3,
      inboxPending: 2,
    }
    const getOverview = vi.fn().mockResolvedValue(overview)
    const caller = createCallerFactory(makeDashboardRouter({ getOverview }))({ session })

    await expect(caller.overview()).resolves.toEqual(overview)
    expect(getOverview).toHaveBeenCalledOnce()
  })
})
