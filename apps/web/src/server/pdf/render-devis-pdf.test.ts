import { describe, expect, it } from 'vitest'
import { renderDevisPdf } from '@/server/pdf/render-devis-pdf'
import { buildDevisPdfModel } from '@/view-models/devis-pdf-model'

describe('renderDevisPdf', () => {
  it('renders a PDF buffer with destinataire and amounts', async () => {
    const buffer = await renderDevisPdf(
      buildDevisPdfModel({
        pharmacyName: 'Pharmacie du Centre',
        contactName: 'Marie Curie',
        kind: 'CDD',
        hours: null,
        hourlyRate: null,
        amountHt: 3000,
        amountTtc: 3600,
        missionTitle: 'Remplacement titulaire',
      }),
    )
    expect(buffer.length).toBeGreaterThan(100)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })
})
