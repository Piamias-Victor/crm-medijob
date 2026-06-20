import { describe, it, expect } from 'vitest'
import { entityNotFound, assertEntityFound } from '@/server/trpc/entity-errors'

describe('entity-errors', () => {
  it('builds a NOT_FOUND TRPCError', () => {
    const error = entityNotFound('Contact')
    expect(error.code).toBe('NOT_FOUND')
    expect(error.message).toBe('Contact introuvable.')
  })

  it('returns entity when present', () => {
    expect(assertEntityFound({ id: '1' }, 'Contact')).toEqual({ id: '1' })
  })

  it('throws when entity missing', () => {
    expect(() => assertEntityFound(null, 'Mission')).toThrow(/Mission introuvable/)
  })
})
