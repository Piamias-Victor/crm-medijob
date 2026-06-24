// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { assertMergeDuplicateAllowed } from '@/server/candidate/assert-merge-duplicate-allowed'

const match = {
  candidateId: 'kept',
  reason: 'email' as const,
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice@x.fr',
  phone: null,
}

describe('assertMergeDuplicateAllowed', () => {
  const input = {
    keptId: 'kept',
    data: {
      firstName: 'Alice',
      lastName: 'Martin',
      email: 'alice@x.fr',
      jobTitleId: 'jt1',
      referentId: 'u1',
      mobilityRadiusKm: 20,
      softwareIds: [],
      contractTypes: [],
    },
  }

  it('allows merge when kept id matches duplicate detection', async () => {
    await expect(
      assertMergeDuplicateAllowed(input, async () => [match]),
    ).resolves.toBeUndefined()
  })

  it('rejects merge when kept id is not a duplicate match', async () => {
    await expect(
      assertMergeDuplicateAllowed(input, async () => [{ ...match, candidateId: 'other' }]),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })
})
