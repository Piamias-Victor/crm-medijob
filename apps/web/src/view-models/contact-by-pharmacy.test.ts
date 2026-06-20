// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { groupContactsByPharmacy } from '@/view-models/contact-by-pharmacy'

describe('groupContactsByPharmacy', () => {
  it('indexe contacts par pharmacyId', () => {
    const grouped = groupContactsByPharmacy([
      { id: 'c1', firstName: 'Marie', lastName: 'Curie', pharmacyId: 'p1' },
      { id: 'c2', firstName: 'Paul', lastName: 'Bert', pharmacyId: 'p2' },
      { id: 'c3', firstName: 'Jean', lastName: 'Dupont', pharmacyId: 'p1' },
    ])

    expect(grouped.p1).toEqual([
      { id: 'c1', label: 'Marie Curie' },
      { id: 'c3', label: 'Jean Dupont' },
    ])
    expect(grouped.p2).toEqual([{ id: 'c2', label: 'Paul Bert' }])
  })

  it('respecte limitPerPharmacy', () => {
    const grouped = groupContactsByPharmacy(
      [
        { id: 'c1', firstName: 'A', lastName: 'One', pharmacyId: 'p1' },
        { id: 'c2', firstName: 'B', lastName: 'Two', pharmacyId: 'p1' },
      ],
      1,
    )
    expect(grouped.p1).toHaveLength(1)
  })
})
