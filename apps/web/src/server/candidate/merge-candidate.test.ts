// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { mergeCandidate } from '@/server/candidate/merge-candidate'
import { CandidateMergeError } from '@/server/candidate/validate-merge-candidates'

describe('mergeCandidate', () => {
  const data = {
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice@x.fr',
    phone: '0600000001',
    jobTitleId: 'jt1',
    referentId: 'u1',
    mobilityRadiusKm: 20,
    softwareIds: [] as string[],
    contractTypes: [] as ('CDI' | 'CDD' | 'INTERIM' | 'VACATION')[],
  }

  const payload = { keptId: 'kept', absorbedId: 'absorbed', data }

  it('rejects merge when kept candidate is not a duplicate match', async () => {
    await expect(
      mergeCandidate(payload, {
        detectDuplicates: vi.fn().mockResolvedValue([{ candidateId: 'other' }]),
        mergeCandidates: vi.fn(),
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })

  it('maps missing candidate to NOT_FOUND', async () => {
    await expect(
      mergeCandidate(
        { keptId: 'kept', data },
        {
          detectDuplicates: vi.fn().mockResolvedValue([{ candidateId: 'kept' }]),
          mergeCandidates: vi.fn().mockRejectedValue(new CandidateMergeError('NOT_FOUND')),
        },
      ),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
