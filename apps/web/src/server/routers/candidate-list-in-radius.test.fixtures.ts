// @vitest-environment node
import { vi } from 'vitest'
import type { Coords } from '@/server/matching/distance'
import type { handleListPharmaciesInRadius } from '@/server/routers/candidate-list-in-radius'

const center: Coords = { lat: 45.75, lon: 4.85 }
const near: Coords = { lat: 45.76, lon: 4.86 }
const far: Coords = { lat: 48.85, lon: 2.35 }

function geoLookup(coordsByKey: Record<string, Coords | null>) {
  return vi.fn(async (key: string) => coordsByKey[key.trim()] ?? null)
}

export function makeListInRadiusDeps(
  overrides: Partial<Parameters<typeof handleListPharmaciesInRadius>[0]> = {},
) {
  const lookupPostal = geoLookup({
    '69001': center,
    '69002': near,
    '75001': far,
  })
  return {
    findCandidateGeo: vi.fn().mockResolvedValue({
      postalCode: '69001',
      address: '12 rue Test',
      city: 'Lyon',
    }),
    listPharmaciesForRadius: vi.fn().mockResolvedValue([
      {
        id: 'p-near',
        name: 'Pharmacie proche',
        city: 'Lyon',
        postalCode: '69002',
        email: 'officine@example.com',
        contacts: [{ id: 'ct1', email: 'titulaire@example.com' }],
      },
      {
        id: 'p-far',
        name: 'Pharmacie loin',
        city: 'Paris',
        postalCode: '75001',
        email: 'paris@example.com',
        contacts: [],
      },
      {
        id: 'p-no-email',
        name: 'Sans email',
        city: 'Lyon',
        postalCode: '69002',
        email: null,
        contacts: [],
      },
    ]),
    lookupPostal,
    lookupQuery: vi.fn(),
    ...overrides,
  }
}
