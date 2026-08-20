import { describe, expect, it } from 'vitest'
import { devisCurrentSummary } from './devis-current'

describe('devisCurrentSummary', () => {
  it('highlights SENT kind and HT', () => {
    expect(
      devisCurrentSummary({
        id: 'd1',
        kind: 'CDD',
        status: 'SENT',
        hours: null,
        hourlyRate: null,
        amountHt: 3000,
        amountTtc: 3600,
        htSource: 'TYPED',
      }),
    ).toBe('Envoyé · CDD · 3 000,00 € HT')
  })
})
