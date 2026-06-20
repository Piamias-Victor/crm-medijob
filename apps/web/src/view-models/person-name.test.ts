import { describe, it, expect } from 'vitest'
import { formatPersonName } from '@/view-models/person-name'

describe('formatPersonName', () => {
  it('joins first and last name', () => {
    expect(formatPersonName('Marie', 'Curie')).toBe('Marie Curie')
  })

  it('trims extra whitespace', () => {
    expect(formatPersonName(' Marie ', ' Curie ')).toBe('Marie Curie')
  })
})
