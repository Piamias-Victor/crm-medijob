import { describe, expect, it } from 'vitest'
import { canGenerateDevisFromRow, canSendDevisFromRow } from '@/view-models/facturation-line-actions'

describe('canGenerateDevisFromRow', () => {
  it('allows generate for a line with no Devis yet, even without Mission', () => {
    expect(
      canGenerateDevisFromRow({
        missionId: null,
        financeLineId: 'l1',
        devisId: null,
        pharmacyId: 'p1',
        pharmacyName: 'Nord',
        referentId: null,
        referentName: null,
        contractType: 'CDD',
        commercialStatus: 'ACCEPTE',
        sentAt: null,
        acceptedAt: null,
        amountHt: 5000,
      }),
    ).toBe(true)
  })

  it('allows send when the Devis is not already sent, even without Mission', () => {
    expect(
      canSendDevisFromRow({
        missionId: null,
        financeLineId: 'l1',
        devisId: 'd1',
        devisStatus: 'DRAFT',
        pharmacyId: 'p1',
        pharmacyName: 'Nord',
        referentId: null,
        referentName: null,
        contractType: 'CDD',
        commercialStatus: 'ACCEPTE',
        sentAt: null,
        acceptedAt: null,
        amountHt: 5000,
      }),
    ).toBe(true)
  })
})
