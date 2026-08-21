// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter.deleteDraft', () => {
  it('soft-deletes a DRAFT', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await caller.deleteDraft({ missionId: 'm1' })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.draft).toBeNull()
    expect(loaded.current).toBeNull()
  })

  it('does not delete a SENT current Devis', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    await expect(caller.deleteDraft({ missionId: 'm1' })).rejects.toThrow()
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.current?.status).toBe('SENT')
  })
})
