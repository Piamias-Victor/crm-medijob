import { vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import type { SyncValidatedDeps } from './sync-validated.types'

export const marieValidated = mapBadakanRecipient({
  id: 'bk-marie',
  firstName: 'Marie',
  lastName: 'App',
  email: 'marie@app.fr',
  phone: '0600000001',
})!

export function stubValidatedDeps(
  overrides: Partial<SyncValidatedDeps> = {},
): SyncValidatedDeps {
  return {
    findByBadakanId: async () => null,
    findMatch: async () => null,
    createAppCandidate: vi.fn().mockResolvedValue({ id: 'c-new' }),
    linkAppOrigin: vi.fn(),
    findAppProfileByBadakanId: async () => null,
    markAppValidated: vi.fn(),
    resolveJobTitleId: async () => 'jt1',
    ...overrides,
  }
}
