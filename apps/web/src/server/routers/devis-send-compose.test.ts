// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter.send compose', () => {
  it('returns a Gmail compose URL to the Mission Contact', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    const result = await caller.send({ missionId: 'm1' })
    expect(result.composeUrl).toContain('https://mail.google.com/mail/?')
    expect(result.composeUrl).toContain('to=marie%40pharma.fr')
  })

  it('opens Gmail without to when no Contact email exists', async () => {
    const deps = makeInMemoryDevisDeps()
    deps.findMission = async () => ({
      id: 'm1',
      title: 'Remplacement titulaire',
      pharmacyId: 'p1',
      pharmacyName: 'Pharmacie du Centre',
      contact: null,
    })
    const caller = devisCaller(deps)
    await caller.save(cddDraft)
    const result = await caller.send({ missionId: 'm1' })
    expect(result.composeUrl).toContain('https://mail.google.com/mail/?')
    expect(result.composeUrl).not.toContain('to=marie')
  })

  it('writes an ActivityLog DEVIS on the Mission', async () => {
    const deps = makeInMemoryDevisDeps()
    const caller = devisCaller(deps)
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    expect(deps.activities).toEqual([
      expect.objectContaining({
        entityType: 'MISSION',
        entityId: 'm1',
        type: 'DEVIS',
        authorId: 'u1',
      }),
    ])
  })
})
