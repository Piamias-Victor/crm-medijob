// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { parseOptionalProposalAmount } from './parse-optional-proposal-amount'

describe('parseOptionalProposalAmount', () => {
  it('treats blank as null and parses positive amounts', () => {
    expect(parseOptionalProposalAmount('')).toBeNull()
    expect(parseOptionalProposalAmount('  ')).toBeNull()
    expect(parseOptionalProposalAmount('420')).toBe(420)
    expect(parseOptionalProposalAmount('420,5')).toBe(420.5)
  })

  it('rejects negative or invalid values', () => {
    expect(parseOptionalProposalAmount('-1')).toBeUndefined()
    expect(parseOptionalProposalAmount('abc')).toBeUndefined()
  })
})
