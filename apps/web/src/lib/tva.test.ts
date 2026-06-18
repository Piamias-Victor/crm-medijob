import { describe, it, expect } from 'vitest'
import { computeNumeroTVA } from '@/lib/tva'

describe('computeNumeroTVA', () => {
  it('builds FR + 2-digit key + SIREN (SPEC_V2 §8)', () => {
    // key = (12 + 3 * (SIREN % 97)) % 97 ; 1 % 97 = 1 → 15
    expect(computeNumeroTVA('000000001')).toBe('FR15000000001')
  })

  it('pads the key to two digits', () => {
    // SIREN 000000000 → key 12
    expect(computeNumeroTVA('000000000')).toBe('FR12000000000')
  })

  it('derives the SIREN from a 14-digit SIRET', () => {
    expect(computeNumeroTVA('00000000100012')).toBe('FR15000000001')
  })

  it('returns null for a non-numeric or wrong-length input', () => {
    expect(computeNumeroTVA('abc')).toBeNull()
    expect(computeNumeroTVA('123')).toBeNull()
  })
})
