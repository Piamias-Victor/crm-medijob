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

export const marieMoved = mapBadakanRecipient({
  id: 'bk-marie',
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'new@app.fr',
  phone: '0611111111',
  address: { address1: '12 rue Test', city: 'Lyon', zipCode: '69001' },
  activity: 'Pharmacien',
})!

export const existingLinked = {
  id: 'c-existing',
  status: 'NOUVEAU' as const,
  statusBeforeInactive: null,
}

export function stubValidatedDeps(
  overrides: Partial<SyncValidatedDeps> = {},
): SyncValidatedDeps {
  return {
    findByBadakanId: async () => null,
    findMatch: async () => null,
    createAppCandidate: vi.fn().mockResolvedValue({ id: 'c-new' }),
    linkAppOrigin: vi.fn(),
    patchIdentity: vi.fn(),
    applyLifecycle: vi.fn(),
    findAppProfileByBadakanId: async () => null,
    markAppValidated: vi.fn(),
    linkAppProfileCandidate: vi.fn(),
    resolveJobTitleId: async () => 'jt1',
    mapJobTitleId: async () => null,
    syncDossier: vi.fn(),
    enrichFromComments: async () => ({}),
    ...overrides,
  }
}
