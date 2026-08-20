// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter.markInvoiced', () => {
  it('sets invoicedAt without moving the accept date', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    await caller.accept({ missionId: 'm1' })
    const accepted = await caller.getByMission({ missionId: 'm1' })
    const invoicedAt = new Date('2026-09-01T00:00:00Z')
    await caller.markInvoiced({ missionId: 'm1', invoicedAt })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.current?.invoicedAt).toEqual(invoicedAt)
    expect(loaded.current?.acceptedAt).toEqual(accepted.current?.acceptedAt)
  })
})
