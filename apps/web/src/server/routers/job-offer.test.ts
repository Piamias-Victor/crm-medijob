// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeJobOfferRouter, type JobOfferDeps } from '@/server/routers/job-offer'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function caller(deps: JobOfferDeps) {
  return createCallerFactory(makeJobOfferRouter(deps))({ session })
}

describe('jobOfferRouter', () => {
  it('returns mapped list rows', async () => {
    const deps: JobOfferDeps = {
      list: vi.fn().mockResolvedValue([
        {
          id: 'o1',
          title: 'Pharmacien',
          status: 'BROUILLON',
          publishedAt: null,
          mission: { id: 'm1', title: 'Mission CDI' },
          _count: { applications: 2 },
        },
      ]),
      getById: vi.fn(),
    }
    const rows = await caller(deps).list()
    expect(rows[0]?.missionTitle).toBe('Mission CDI')
    expect(rows[0]?.applicationCount).toBe(2)
  })
})
