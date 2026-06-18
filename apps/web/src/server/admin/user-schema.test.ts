// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { normalizeUpdatePassword, updateUserSchema } from '@/server/admin/user-schema'

describe('normalizeUpdatePassword', () => {
  it('returns undefined for blank password', () => {
    expect(normalizeUpdatePassword('')).toBeUndefined()
    expect(normalizeUpdatePassword('   ')).toBeUndefined()
    expect(normalizeUpdatePassword(undefined)).toBeUndefined()
  })

  it('returns trimmed password when provided', () => {
    expect(normalizeUpdatePassword('  secret-pw  ')).toBe('secret-pw')
  })
})

describe('updateUserSchema', () => {
  it('accepts edit without password reset', () => {
    const parsed = updateUserSchema.parse({
      id: 'u1',
      name: 'Jane',
      role: 'RECRUTEUR',
    })
    expect(parsed.password).toBeUndefined()
  })
})
