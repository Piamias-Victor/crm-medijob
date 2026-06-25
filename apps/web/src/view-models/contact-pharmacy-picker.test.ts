import { describe, it, expect } from 'vitest'
import {
  defaultContactPharmacyPickerId,
  mapContactPharmacyPickerRows,
} from '@/view-models/contact-pharmacy-picker'

describe('contact-pharmacy-picker', () => {
  it('filters contacts without email and sorts primary first', () => {
    const rows = mapContactPharmacyPickerRows([
      { id: 'c1', firstName: 'Paul', lastName: 'Bert', email: null, isPrimary: false },
      { id: 'c2', firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com', isPrimary: true },
      { id: 'c3', firstName: 'Anne', lastName: 'Martin', email: 'anne@example.com', isPrimary: false },
    ])

    expect(rows.map((row) => row.id)).toEqual(['c2', 'c3'])
  })

  it('defaults to primary contact id', () => {
    const rows = mapContactPharmacyPickerRows([
      { id: 'c2', firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com', isPrimary: true },
      { id: 'c3', firstName: 'Anne', lastName: 'Martin', email: 'anne@example.com', isPrimary: false },
    ])

    expect(defaultContactPharmacyPickerId(rows)).toBe('c2')
  })
})
