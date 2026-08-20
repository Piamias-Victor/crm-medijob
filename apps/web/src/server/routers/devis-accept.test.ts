// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter.accept', () => {
  it('marks the current SENT devis as ACCEPTED', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    const result = await caller.accept({ missionId: 'm1' })
    expect(result.status).toBe('ACCEPTED')
  })

  it('dates the accept on the current devis', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    await caller.accept({ missionId: 'm1' })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.current?.status).toBe('ACCEPTED')
    expect(loaded.current?.acceptedAt).toEqual(expect.any(Date))
  })

  it('writes an ActivityLog DEVIS on accept', async () => {
    const deps = makeInMemoryDevisDeps()
    const caller = devisCaller(deps)
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    await caller.accept({ missionId: 'm1' })
    expect(deps.activities.filter((row) => row.content === 'Devis accepté')).toEqual([
      expect.objectContaining({
        entityType: 'MISSION',
        entityId: 'm1',
        type: 'DEVIS',
        authorId: 'u1',
      }),
    ])
  })
})
