// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeObjectifRouter, type ObjectifDeps } from '@/server/routers/admin/objectif'
import type { UserRole } from '@/server/auth/permissions'
import { adminSession, recruteurSession } from '@/server/routers/admin/user.test.fixtures'

type Sess = { user: { id: string; role: UserRole }; expires: string }

const seeded = {
  monthlyCaPlacement: 20_000,
  monthlyMargePlacement: 20_000,
  monthlyCaInterim: 30_000,
  monthlyMargeInterim: 10_000,
  monthlyRentabilityThreshold: 15_000,
}

function makeDeps(overrides: Partial<ObjectifDeps> = {}): ObjectifDeps {
  return {
    get: vi.fn().mockResolvedValue(seeded),
    save: vi.fn().mockImplementation((input) => Promise.resolve(input)),
    ...overrides,
  }
}

function caller(deps: ObjectifDeps, session: Sess = adminSession) {
  return createCallerFactory(makeObjectifRouter(deps))({ session })
}

describe('objectifRouter', () => {
  it('returns monthly Objectif amounts', async () => {
    const row = await caller(makeDeps()).get()
    expect(row.monthlyCaPlacement).toBe(20_000)
    expect(row.monthlyMargePlacement).toBe(20_000)
    expect(row.monthlyCaInterim).toBe(30_000)
    expect(row.monthlyMargeInterim).toBe(10_000)
    expect(row.monthlyRentabilityThreshold).toBe(15_000)
  })

  it('saves monthly Objectif amounts', async () => {
    const next = { ...seeded, monthlyCaPlacement: 25_000 }
    const deps = makeDeps()
    const saved = await caller(deps).save(next)
    expect(saved.monthlyCaPlacement).toBe(25_000)
    expect(deps.save).toHaveBeenCalledWith(next)
  })

  it('rejects Recruteur get', async () => {
    await expect(caller(makeDeps(), recruteurSession).get()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })

  it('rejects Recruteur save', async () => {
    await expect(caller(makeDeps(), recruteurSession).save(seeded)).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })
})
