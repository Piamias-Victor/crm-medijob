import { vi } from 'vitest'

export function mockPharmacyApplyEmailDb() {
  return {
    badakanSearchApplied: { findMany: vi.fn() },
    badakanPharmacyApplyEmail: { findMany: vi.fn(), upsert: vi.fn() },
    badakanEnterprise: { findMany: vi.fn() },
    pharmacy: { findMany: vi.fn() },
    contact: { findMany: vi.fn() },
  }
}

export const appliedHermes = {
  recipientId: 'rec-1',
  mission: { badakanId: 'm-hermes', enterpriseId: 'ent-hermes' },
}

export const enterpriseLinked = {
  badakanId: 'ent-hermes',
  pharmacyId: 'p1',
  principalEmail: 'd.litzler@hermes.fr',
  principalFirstName: 'Dominique',
}

export const enterpriseUnlinked = {
  ...enterpriseLinked,
  pharmacyId: null,
}
