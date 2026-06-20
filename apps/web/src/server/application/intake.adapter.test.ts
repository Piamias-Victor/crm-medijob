// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import * as intake from '@/server/application/intake'
import { detectApplicationDuplicate } from '@/server/application/intake.adapter'

describe('detectApplicationDuplicate', () => {
  it('délègue email match à detectDuplicateCandidate après fetch identities', async () => {
    const detectDuplicateCandidate = vi.spyOn(intake, 'detectDuplicateCandidate')
    const findByEmail = vi.fn().mockResolvedValue({
      id: 'c1',
      email: 'a@x.fr',
      firstName: 'Bob',
      lastName: 'X',
      phone: null,
    })
    const match = await detectApplicationDuplicate('a1', {
      findApplication: vi.fn().mockResolvedValue({
        email: 'a@x.fr',
        firstName: 'Bob',
        lastName: 'X',
        phone: null,
      }),
      findByEmail,
      findByNamePhone: vi.fn(),
    })
    expect(findByEmail).toHaveBeenCalledWith('a@x.fr')
    expect(detectDuplicateCandidate).toHaveBeenCalledWith(
      { email: 'a@x.fr', firstName: 'Bob', lastName: 'X', phone: null },
      [
        { id: 'c1', email: 'a@x.fr', firstName: 'Bob', lastName: 'X', phone: null },
      ],
    )
    expect(match).toEqual({ candidateId: 'c1', reason: 'email' })
    detectDuplicateCandidate.mockRestore()
  })

  it('matches duplicate by email without loading all candidates', async () => {
    const findByEmail = vi.fn().mockResolvedValue({ id: 'c1', email: 'a@x.fr', firstName: 'Bob', lastName: 'X', phone: null })
    const match = await detectApplicationDuplicate('a1', {
      findApplication: vi.fn().mockResolvedValue({
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
    const findByNamePhone = vi.fn().mockResolvedValue({
      id: 'c2',
      email: 'old@x.fr',
      firstName: 'Alice',
      lastName: 'Martin',
      phone: '0600000001',
    })
    const match = await detectApplicationDuplicate('a1', {
      findApplication: vi.fn().mockResolvedValue({
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
