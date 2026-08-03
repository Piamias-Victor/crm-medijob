import { describe, expect, it, vi } from 'vitest'
import { commitCandidateImport } from '@/server/candidate/commit-candidate-import'
import type { CandidateCsvImportRow } from '@/view-models/candidate-csv-import.schema'

const row = (overrides: Partial<CandidateCsvImportRow> = {}): CandidateCsvImportRow => ({
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  status: 'NOUVEAU',
  mobilityRadiusKm: 20,
  softwareIds: [],
  contractTypes: [],
  ...overrides,
})

describe('commitCandidateImport', () => {
  it('creates rows without duplicates', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'new-1' })
    const result = await commitCandidateImport([row({ email: 'new@x.fr' })], {
      detectDuplicates: async () => [],
      create,
    })
    expect(result.createdIds).toEqual(['new-1'])
    expect(result.duplicates).toEqual([])
    expect(create).toHaveBeenCalledOnce()
  })

  it('queues email duplicates for merge instead of creating', async () => {
    const create = vi.fn()
    const result = await commitCandidateImport([row({ email: 'exist@x.fr' })], {
      detectDuplicates: async () => [
        {
          candidateId: 'exist-1',
          reason: 'email',
          firstName: 'Camille',
          lastName: 'Durand',
          email: 'exist@x.fr',
          phone: null,
        },
      ],
      create,
    })
    expect(result.createdIds).toEqual([])
    expect(result.duplicates).toHaveLength(1)
    expect(result.duplicates[0]?.matches[0]?.candidateId).toBe('exist-1')
    expect(create).not.toHaveBeenCalled()
  })
})
