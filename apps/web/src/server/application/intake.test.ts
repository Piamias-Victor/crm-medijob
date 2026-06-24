import { describe, it, expect, vi } from 'vitest'
import { detectDuplicateCandidate, refuseApplication } from '@/server/application/intake'
import { IntakeError } from '@/server/application/intake-errors'

describe('detectDuplicateCandidate', () => {
  const candidates = [
    { id: 'c1', email: 'a@x.fr', firstName: 'Alice', lastName: 'Martin', phone: '0600000001' },
  ]

  it('matches by normalized name and phone', () => {
    const match = detectDuplicateCandidate(
      { email: 'new@x.fr', firstName: 'Alice', lastName: 'Martin', phone: '06 00 00 00 01' },
      [{ ...candidates[0], phone: '0600000001' }],
    )
    expect(match?.reason).toBe('name_phone')
  })

  it('matches existing Candidate by email', () => {
    const match = detectDuplicateCandidate(
      { email: 'a@x.fr', firstName: 'Bob', lastName: 'X', phone: null },
      candidates,
    )
    expect(match).toEqual({ candidateId: 'c1', reason: 'email' })
  })
})

describe('refuseApplication', () => {
  it('refuses a pending Application', async () => {
    const markRefused = vi.fn().mockResolvedValue({ id: 'a1', status: 'REFUSEE' })
    const result = await refuseApplication('a1', {
      findApplication: vi.fn().mockResolvedValue({ id: 'a1', status: 'EN_ATTENTE' }),
      markRefused,
    })
    expect(result.status).toBe('REFUSEE')
    expect(markRefused).toHaveBeenCalledWith('a1')
  })

  it('rejects missing Application', async () => {
    await expect(
      refuseApplication('a1', {
        findApplication: vi.fn().mockResolvedValue(null),
        markRefused: vi.fn(),
      }),
    ).rejects.toThrow(IntakeError)
  })

  it('rejects Application that is not pending', async () => {
    await expect(
      refuseApplication('a1', {
        findApplication: vi.fn().mockResolvedValue({ id: 'a1', status: 'REFUSEE' }),
        markRefused: vi.fn(),
      }),
    ).rejects.toMatchObject({ code: 'INVALID_STATUS' })
  })
})
