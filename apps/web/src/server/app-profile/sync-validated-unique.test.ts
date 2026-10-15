import { describe, expect, it } from 'vitest'
import { isBadakanIdUniqueViolation } from './sync-validated-unique'

describe('isBadakanIdUniqueViolation', () => {
  it('detects Prisma P2002', () => {
    expect(isBadakanIdUniqueViolation({ code: 'P2002' })).toBe(true)
  })

  it('ignores other errors', () => {
    expect(isBadakanIdUniqueViolation(new Error('boom'))).toBe(false)
    expect(isBadakanIdUniqueViolation({ code: 'P2025' })).toBe(false)
  })
})
