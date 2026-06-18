// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { detectApplicationDuplicate } from '@/server/application/intake.adapter'

describe('detectApplicationDuplicate', () => {
  it('matches duplicate by email without loading all candidates', async () => {
    const findByEmail = vi.fn().mockResolvedValue({ id: 'c1' })
    const match = await detectApplicationDuplicate('a1', {
      findApplication: vi.fn().mockResolvedValue({
        id: 'a1',
        email: 'a@x.fr',
        firstName: 'Bob',
        lastName: 'X',
        phone: null,
      }),
      findByEmail,
      findByNamePhone: vi.fn(),
    })
    expect(match).toEqual({ candidateId: 'c1', reason: 'email' })
    expect(findByEmail).toHaveBeenCalledWith('a@x.fr')
  })

  it('falls back to name and phone lookup', async () => {
    const findByNamePhone = vi.fn().mockResolvedValue({ id: 'c2' })
    const match = await detectApplicationDuplicate('a1', {
      findApplication: vi.fn().mockResolvedValue({
        id: 'a1',
        email: 'new@x.fr',
        firstName: 'Alice',
        lastName: 'Martin',
        phone: '0600000001',
      }),
      findByEmail: vi.fn().mockResolvedValue(null),
      findByNamePhone,
    })
    expect(match).toEqual({ candidateId: 'c2', reason: 'name_phone' })
    expect(findByNamePhone).toHaveBeenCalledWith('Alice', 'Martin', '0600000001')
  })
})
