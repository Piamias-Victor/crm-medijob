import { describe, it, expect } from 'vitest'
import { buildRadiusBcc } from '@/lib/present-candidate-radius/build-radius-bcc'

const pharmacies = [
  { id: 'p1', name: 'A', city: 'Lyon', distanceKm: 1, email: 'a@example.com', contactId: null },
  { id: 'p2', name: 'B', city: 'Lyon', distanceKm: 2, email: 'b@example.com', contactId: null },
]

describe('buildRadiusBcc', () => {
  it('joins selected pharmacy emails', () => {
    expect(buildRadiusBcc(pharmacies, ['p1', 'p2'])).toBe('a@example.com,b@example.com')
  })

  it('updates when selection changes without regenerating draft content', () => {
    expect(buildRadiusBcc(pharmacies, ['p2'])).toBe('b@example.com')
  })
})
