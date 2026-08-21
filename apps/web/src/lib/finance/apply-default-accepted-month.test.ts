import { describe, expect, it } from 'vitest'
import { applyDefaultAcceptedMonth } from '@/lib/finance/apply-default-accepted-month'

describe('applyDefaultAcceptedMonth', () => {
  it('fills empty accepted range with current month', () => {
    expect(applyDefaultAcceptedMonth({}, new Date(2026, 7, 20))).toEqual({
      acceptedFrom: '2026-08-01',
      acceptedTo: '2026-08-31',
    })
  })

  it('keeps an explicit accepted range', () => {
    expect(
      applyDefaultAcceptedMonth(
        { acceptedFrom: '2026-01-01', acceptedTo: '2026-01-31' },
        new Date(2026, 7, 20),
      ),
    ).toEqual({ acceptedFrom: '2026-01-01', acceptedTo: '2026-01-31' })
  })
})
