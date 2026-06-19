// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { enrichCvExtraction } from '@/server/ai/cv-extraction-enrich'

describe('enrichCvExtraction', () => {
  it('fills missing contact fields from rawText without overwriting AI values', () => {
    const result = enrichCvExtraction({
      firstName: 'Jean',
      lastName: 'Dupont',
      rawText: 'Contact jean.dupont@mail.fr · 06 12 34 56 78 · 83200 Toulon',
    })

    expect(result.email).toBe('jean.dupont@mail.fr')
    expect(result.phone).toBe('06 12 34 56 78')
    expect(result.postalCode).toBe('83200')
    expect(result.city).toBe('Toulon')
    expect(result).not.toHaveProperty('rawText')
  })

  it('replaces placeholder values with regex matches from rawText', () => {
    const result = enrichCvExtraction({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'N/A',
      phone: 'N/A',
      rawText: 'Mail: alice@test.fr Tel: 07 98 76 54 32 CP 69001 Lyon',
    })

    expect(result.email).toBe('alice@test.fr')
    expect(result.phone).toBe('07 98 76 54 32')
    expect(result.postalCode).toBe('69001')
    expect(result.city).toBe('Lyon')
  })
})
