import { describe, expect, it } from 'vitest'
import { linkFinanceLineAmounts } from '@/view-models/finance-line-amounts'

describe('linkFinanceLineAmounts', () => {
  it('computes HT from optional hours and rate', () => {
    const next = linkFinanceLineAmounts(
      { hours: '10', hourlyRate: '40', amountHt: '', htSource: 'TYPED' },
      'hourlyRate',
    )
    expect(next.amountHt).toBe('400')
    expect(next.htSource).toBe('ENGINE')
  })
})
