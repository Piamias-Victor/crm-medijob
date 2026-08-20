// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter.send', () => {
  it('marks the DRAFT as SENT', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    const result = await caller.send({ missionId: 'm1' })
    expect(result.devis.status).toBe('SENT')
  })

  it('makes the SENT devis current and clears the draft', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.current?.status).toBe('SENT')
    expect(loaded.current?.amountHt).toBe(3000)
    expect(loaded.draft).toBeNull()
  })

  it('does not make a later DRAFT current', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    await caller.send({ missionId: 'm1' })
    await caller.save({ ...cddDraft, amountHt: 1500 })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.draft?.amountHt).toBe(1500)
    expect(loaded.current?.amountHt).toBe(3000)
  })

  it('replaces the current Devis on a second send', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    const first = await caller.send({ missionId: 'm1' })
    await caller.save({ ...cddDraft, amountHt: 1500 })
    const second = await caller.send({ missionId: 'm1' })
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(second.devis.id).not.toBe(first.devis.id)
    expect(loaded.current?.id).toBe(second.devis.id)
    expect(loaded.current?.amountHt).toBe(1500)
  })

  it('stores a DEVIS PDF document on the Mission', async () => {
    const caller = devisCaller(makeInMemoryDevisDeps())
    await caller.save(cddDraft)
    const result = await caller.send({ missionId: 'm1' })
    expect(result.document).toMatchObject({
      category: 'DEVIS',
      name: expect.stringMatching(/\.pdf$/),
      mimeType: 'application/pdf',
      url: expect.stringContaining('http'),
    })
  })

  it('fills PDF destinataire from Pharmacy and Contact', async () => {
    const deps = makeInMemoryDevisDeps()
    let rendered: { destinataire: { pharmacyName: string; contactName: string | null } } | undefined
    const renderPdf = deps.renderPdf
    deps.renderPdf = async (model) => {
      rendered = model
      return renderPdf(model)
    }
    await devisCaller(deps).save(cddDraft)
    await devisCaller(deps).send({ missionId: 'm1' })
    expect(rendered?.destinataire).toEqual({
      pharmacyName: 'Pharmacie du Centre',
      contactName: 'Marie Curie',
    })
  })
})
