import { describe, it, expect } from 'vitest'
import { buildRadiusBcc } from '@/lib/present-candidate-radius/build-radius-bcc'

const pharmacies = [
  {
    id: 'p1',
    name: 'A',
    city: 'Lyon',
    distanceKm: 1,
    email: 'a@example.com',
    contactId: 'ct1',
    contactFirstName: 'Sophie',
    contactLastName: 'Moreau',
  },
  {
    id: 'p2',
    name: 'B',
    city: 'Lyon',
    distanceKm: 2,
    email: 'b@example.com',
    contactId: null,
    contactFirstName: null,
    contactLastName: null,
  },
]

describe('buildRadiusBcc', () => {
  it('joins selected emails with contact names when known', () => {
    expect(buildRadiusBcc(pharmacies, ['p1', 'p2'])).toBe(
      'Sophie Moreau <a@example.com>,b@example.com',
    )
  })

  it('updates when selection changes without regenerating draft content', () => {
    expect(buildRadiusBcc(pharmacies, ['p2'])).toBe('b@example.com')
  })
})
