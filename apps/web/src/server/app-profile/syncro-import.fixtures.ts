import { vi } from 'vitest'
import type { SyncroImportDeps } from './syncro-import.types'

export function stubSyncroDeps(
  overrides: Partial<SyncroImportDeps> = {},
): SyncroImportDeps {
  return {
    findByBadakanId: async () => ({ id: 'p1', candidateId: 'c1', status: 'EN_ATTENTE' }),
    upsertPending: vi.fn().mockResolvedValue({ id: 'p1' }),
    updateIntake: vi.fn(),
    markStatus: vi.fn(),
    resolveUserIdByName: async () => null,
    findJobTitleIdByName: async () => null,
    createAppCandidate: vi.fn().mockResolvedValue({ id: 'c-new' }),
    linkCandidate: vi.fn(),
    findCandidateByBadakanId: async () => null,
    muteOutbound: vi.fn(),
    ...overrides,
  }
}
