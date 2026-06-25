import { describe, it, expect } from 'vitest'
import { buildPharmacyPickerOptions } from '@/lib/present-candidate-pharmacy/pharmacy-picker-options'

describe('buildPharmacyPickerOptions', () => {
  it('keeps the selected pharmacy visible when it is missing from search results', () => {
    expect(
      buildPharmacyPickerOptions([{ id: 'p2', label: 'Autre' }], 'p1', 'Grande pharmacie'),
    ).toEqual([
      { value: 'p1', label: 'Grande pharmacie' },
      { value: 'p2', label: 'Autre' },
    ])
  })
})
