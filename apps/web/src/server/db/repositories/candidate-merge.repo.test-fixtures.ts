import { vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { makeCandidateMergeRepository } from './candidate-merge.repo'

export const mergeProfile = {
  firstName: 'Alice',
  lastName: 'Martin',
  jobTitleId: 'jt1',
  referentId: 'u1',
  mobilityRadiusKm: 20,
  softwareIds: [] as string[],
  contractTypes: ['CDI'] as ('CDI' | 'CDD' | 'INTERIM' | 'VACATION')[],
}

export function makeMergeRepo(db: Pick<PrismaClient, '$transaction'>) {
  return makeCandidateMergeRepository(db as PrismaClient)
}

export function makeMergeTx(overrides: Record<string, unknown> = {}) {
  return {
    missionCandidate: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    activityLog: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
    document: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
    application: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
    candidateSoftware: { deleteMany: vi.fn() },
    candidateContractPreference: { deleteMany: vi.fn() },
    candidate: {
      findFirst: vi.fn(async ({ where }: { where: { id: string } }) =>
        ['kept', 'absorbed'].includes(where.id) ? { id: where.id } : null,
      ),
      update: vi.fn(),
    },
    ...overrides,
  }
}

export function runMergeTx(tx: ReturnType<typeof makeMergeTx>) {
  return vi.fn(async (fn: (inner: typeof tx) => Promise<void>) => fn(tx))
}
