// @vitest-environment node
import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makePharmacyRouter, type PharmacyDeps } from '@/server/routers/pharmacy'
import { pharmacyDetailEntity, pharmacyListEntity } from '@/server/routers/pharmacy.test.fixtures'

export function makeDeps(overrides: Partial<PharmacyDeps> = {}): PharmacyDeps {
  return {
    pharmacies: {
      list: vi.fn().mockResolvedValue([pharmacyListEntity]),
      findDetailById: vi.fn().mockResolvedValue(pharmacyDetailEntity),
      create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 'new', ...data })),
      update: vi.fn().mockResolvedValue({ id: 'p1' }),
      softDelete: vi.fn().mockResolvedValue({ id: 'p1' }),
    },
    referentials: {
      listGroupements: vi.fn().mockResolvedValue([]),
      listSoftwares: vi.fn().mockResolvedValue([]),
    },
    createGroupement: vi.fn().mockResolvedValue({ id: 'g1', name: 'Giphar' }),
    createSoftware: vi.fn().mockResolvedValue({ id: 's1', name: 'Winpharma' }),
    searchSiret: vi.fn().mockResolvedValue([{ siret: '1', name: 'X', address: '', city: '', postalCode: '' }]),
    ...overrides,
  }
}

export const recruteurSession = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

export function pharmacyCaller(deps: PharmacyDeps, session = recruteurSession) {
  return createCallerFactory(makePharmacyRouter(deps))({ session })
}
