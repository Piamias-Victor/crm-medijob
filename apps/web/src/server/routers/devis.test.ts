// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeDevisRouter } from '@/server/routers/devis'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter', () => {
  it('saves a CDD DRAFT and reloads the same forfait', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded?.draft?.amountHt).toBe(3000)
    expect(loaded?.draft?.amountTtc).toBe(3600)
    expect(loaded?.draft?.kind).toBe('CDD')
    expect(loaded?.current?.id).toBe(loaded?.draft?.id)
    expect(loaded?.current?.status).toBe('DRAFT')
    expect(loaded?.draft).not.toHaveProperty('ca')
    expect(loaded?.draft).not.toHaveProperty('marge')
  })

  it('accepts a lone DRAFT as current', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await expect(caller.accept({ missionId: 'm1' })).resolves.toMatchObject({ status: 'ACCEPTED' })
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
    expect(loaded?.draft?.hours).toBe(151.67)
    expect(loaded?.draft?.hourlyRate).toBe(28)
    expect(loaded?.draft?.amountHt).toBe(4246.76)
    expect(loaded?.draft?.amountTtc).toBe(5096.11)
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeDevisRouter(makeInMemoryDevisDeps()))({ session: null })
    await expect(unauth.getByMission({ missionId: 'm1' })).rejects.toThrow()
  })
})
