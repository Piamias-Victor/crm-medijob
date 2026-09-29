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

describe('intakeStatusAdminSchema', () => {
  it('accepts name + hex color', async () => {
    const { intakeStatusAdminSchema } = await import('@/server/admin/schema')
    expect(intakeStatusAdminSchema.parse({ name: '  Nouveau  ', color: '#FEF3C7' })).toEqual({
      name: 'Nouveau',
      color: '#FEF3C7',
    })
  })

  it('normalizes lowercase hex and rejects invalid', async () => {
    const { intakeStatusAdminSchema } = await import('@/server/admin/schema')
    expect(intakeStatusAdminSchema.parse({ name: 'X', color: '#abc' }).color).toBe('#AABBCC')
    expect(intakeStatusAdminSchema.safeParse({ name: 'X', color: 'red' }).success).toBe(false)
    expect(intakeStatusAdminSchema.safeParse({ name: 'X', color: '#GGG' }).success).toBe(false)
  })
})
