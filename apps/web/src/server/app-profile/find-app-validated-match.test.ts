import { describe, expect, it, vi } from 'vitest'
import { findAppValidatedMatch } from './find-app-validated-match'

const alice = {
  id: 'c1',
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'a@x.fr',
  phone: '0600000001',
}

describe('findAppValidatedMatch', () => {
  it('uses email and skips phone lookup when email hits', async () => {
    const findIdentityByPhone = vi.fn()
    const hit = await findAppValidatedMatch(
      { firstName: 'Alice', lastName: 'Martin', email: 'a@x.fr', phone: '0600000001' },
      { findIdentityByEmail: async () => alice, findIdentityByPhone },
    )
    expect(hit?.id).toBe('c1')
    expect(findIdentityByPhone).not.toHaveBeenCalled()
  })

  it('falls back to phone when email misses', async () => {
    const hit = await findAppValidatedMatch(
      { firstName: 'Other', lastName: 'Name', email: null, phone: '0600000001' },
      {
        findIdentityByEmail: vi.fn(),
        findIdentityByPhone: async () => alice,
      },
    )
    expect(hit?.id).toBe('c1')
  })
})
