// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from './password'

describe('password', () => {
  it('verifies a matching password against its hash', async () => {
    const hash = await hashPassword('s3cret-medijob')
    expect(await verifyPassword(hash, 's3cret-medijob')).toBe(true)
  })

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('s3cret-medijob')
    expect(await verifyPassword(hash, 'wrong')).toBe(false)
  })

  it('produces an argon2id hash', async () => {
    const hash = await hashPassword('s3cret-medijob')
    expect(hash.startsWith('$argon2id$')).toBe(true)
  })
})
