// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeDevisRouter } from '@/server/routers/devis'
import { devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter', () => {
  it('saves a CDD DRAFT and reloads the same forfait', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save({
      missionId: 'm1',
      kind: 'CDD',
      hours: null,
      hourlyRate: null,
      amountHt: 3000,
      htSource: 'TYPED',
    })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded?.amountHt).toBe(3000)
    expect(loaded?.amountTtc).toBe(3600)
    expect(loaded?.kind).toBe('CDD')
    expect(loaded).not.toHaveProperty('ca')
    expect(loaded).not.toHaveProperty('marge')
  })

  it('persists INTERIM hours × rate HT/TTC', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save({
      missionId: 'm1',
      kind: 'INTERIM',
      hours: 151.67,
      hourlyRate: 28,
      amountHt: 4246.76,
      htSource: 'ENGINE',
    })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded?.hours).toBe(151.67)
    expect(loaded?.hourlyRate).toBe(28)
    expect(loaded?.amountHt).toBe(4246.76)
    expect(loaded?.amountTtc).toBe(5096.11)
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeDevisRouter(makeInMemoryDevisDeps()))({ session: null })
    await expect(unauth.getByMission({ missionId: 'm1' })).rejects.toThrow()
  })
})
