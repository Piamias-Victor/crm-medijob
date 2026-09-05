import { describe, expect, it } from 'vitest'
import { matchesPersonSearch } from '@/view-models/person-search'

const marie = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@officine.fr',
  phone: '06 24 17 47 24',
  city: 'Lyon',
}

describe('matchesPersonSearch', () => {
  it('matches empty query', () => {
    expect(matchesPersonSearch(marie, '  ')).toBe(true)
  })

  it('matches name, email, city and phone digits', () => {
    expect(matchesPersonSearch(marie, 'marie du')).toBe(true)
    expect(matchesPersonSearch(marie, 'officine')).toBe(true)
    expect(matchesPersonSearch(marie, 'lyon')).toBe(true)
    expect(matchesPersonSearch(marie, '062417')).toBe(true)
  })

  it('rejects a miss', () => {
    expect(matchesPersonSearch(marie, 'Marseille')).toBe(false)
  })
})
