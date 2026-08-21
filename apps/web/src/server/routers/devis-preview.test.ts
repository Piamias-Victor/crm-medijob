// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { cddDraft, devisCaller, makeInMemoryDevisDeps } from '@/server/routers/devis.test.fixtures'

describe('devisRouter.previewPdf', () => {
  it('returns a PDF without storing a Document', async () => {
    const deps = makeInMemoryDevisDeps()
    let created = 0
    deps.createDocument = async (data) => {
      created += 1
      return { id: 'doc1', url: data.url }
    }
    const caller = devisCaller(deps)
    const result = await caller.previewPdf(cddDraft)
    expect(result.quote.destinataire.pharmacyName).toBe('Pharmacie du Centre')
    expect(result.quote.line.designation).toContain('CDD')
    expect(result.quote.line.totalHt).toBe('3 000,00 €')
    expect(created).toBe(0)
    const loaded = await caller.getByMission({ missionId: 'm1' })
    expect(loaded.draft).toBeNull()
    expect(loaded.current).toBeNull()
  })
})
