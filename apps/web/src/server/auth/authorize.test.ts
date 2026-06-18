// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { authorizeCredentials } from './authorize'

const user = {
  id: 'u1',
  email: 'admin@medijob.fr',
  name: 'Admin',
  password: 'hashed',
  role: 'ADMIN' as const,
}

function deps(overrides = {}) {
  return {
    findByEmail: vi.fn().mockResolvedValue(user),
    verify: vi.fn().mockResolvedValue(true),
    ...overrides,
  }
}

describe('authorizeCredentials', () => {
  it('returns a safe user when credentials are valid', async () => {
    const result = await authorizeCredentials(
      { email: 'admin@medijob.fr', password: 'good' },
      deps(),
    )
    expect(result).toEqual({
      id: 'u1',
      email: 'admin@medijob.fr',
      name: 'Admin',
      role: 'ADMIN',
    })
  })

  it('returns null when the password is wrong', async () => {
    const result = await authorizeCredentials(
      { email: 'admin@medijob.fr', password: 'bad' },
      deps({ verify: vi.fn().mockResolvedValue(false) }),
    )
    expect(result).toBeNull()
  })

  it('returns null when the user is unknown or soft-deleted', async () => {
    const result = await authorizeCredentials(
      { email: 'ghost@medijob.fr', password: 'whatever' },
      deps({ findByEmail: vi.fn().mockResolvedValue(null) }),
    )
    expect(result).toBeNull()
  })

  it('never exposes the password hash', async () => {
    const result = await authorizeCredentials(
      { email: 'admin@medijob.fr', password: 'good' },
      deps(),
    )
    expect(result).not.toHaveProperty('password')
  })
})
