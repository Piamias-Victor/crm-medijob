import { describe, expect, it } from 'vitest'
import { toBadakanContractListItem } from './badakan-contract-list'

describe('toBadakanContractListItem', () => {
  it('shows status, PDF and DPAE — not a Ligne de suivi', () => {
    const item = toBadakanContractListItem({
      id: 'row1',
      recipientName: 'Lucie Robert',
      pharmacyName: 'Pharmacie Hermes',
      status: 'VALIDATED',
      pdfUrl: 'https://files.badakan.test/c-lucie.pdf',
      dpaeUrl: 'https://files.badakan.test/c-lucie-dpae.pdf',
    })
    expect(item).toMatchObject({
      recipientName: 'Lucie Robert',
      pharmacyName: 'Pharmacie Hermes',
      statusLabel: 'Validé',
      pdfHref: 'https://files.badakan.test/c-lucie.pdf',
      dpaeHref: 'https://files.badakan.test/c-lucie-dpae.pdf',
    })
    expect(item).not.toHaveProperty('financeLineId')
  })
})
