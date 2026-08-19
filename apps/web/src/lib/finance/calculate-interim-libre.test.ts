import { describe, expect, it } from 'vitest'
import { calculateInterimLibre } from './calculate-interim-libre'

describe('calculateInterimLibre', () => {
  it('fills HT and TTC from hours × rate', () => {
    const result = calculateInterimLibre({ hours: 151.67, hourlyRate: 28 })
    expect(result.amountHt).toBe(4246.76)
    expect(result.amountTtc).toBe(5096.11)
  })
})
