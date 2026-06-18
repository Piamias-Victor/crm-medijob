import { describe, it, expect } from 'vitest'
import { referentialSchema, reorderSchema } from '@/server/admin/schema'

describe('referentialSchema', () => {
  it('trims surrounding whitespace from the name', () => {
    expect(referentialSchema.parse({ name: '  Pharmacien  ' })).toEqual({
      name: 'Pharmacien',
    })
  })

  it('rejects a blank name', () => {
    expect(referentialSchema.safeParse({ name: '   ' }).success).toBe(false)
  })
})

describe('reorderSchema', () => {
  it('accepts a non-empty list of ids', () => {
    expect(reorderSchema.parse({ orderedIds: ['a', 'b'] })).toEqual({
      orderedIds: ['a', 'b'],
    })
  })

  it('rejects an empty list', () => {
    expect(reorderSchema.safeParse({ orderedIds: [] }).success).toBe(false)
  })
})
