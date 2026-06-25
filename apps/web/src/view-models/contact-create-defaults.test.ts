import { describe, expect, it } from 'vitest'
import {
  buildContactCreateDefaults,
  resolveContactCreatePharmacy,
} from '@/view-models/contact-create-defaults'

describe('buildContactCreateDefaults', () => {
  it('returns role AUTRE and isPrimary false without pharmacy', () => {
    expect(buildContactCreateDefaults()).toEqual({
      role: 'AUTRE',
      isPrimary: false,
    })
  })

  it('pre-fills pharmacyId when provided', () => {
    expect(buildContactCreateDefaults('p1')).toEqual({
      role: 'AUTRE',
      isPrimary: false,
      pharmacyId: 'p1',
    })
  })
})

describe('resolveContactCreatePharmacy', () => {
  const pharmacies = [{ id: 'p1', name: 'Pharmacie du Centre' }]

  it('returns pharmacyId when it exists in referentials', () => {
    expect(resolveContactCreatePharmacy('p1', pharmacies)).toBe('p1')
  })

  it('ignores unknown pharmacyId', () => {
    expect(resolveContactCreatePharmacy('missing', pharmacies)).toBeUndefined()
  })

  it('ignores empty pharmacyId', () => {
    expect(resolveContactCreatePharmacy(undefined, pharmacies)).toBeUndefined()
  })
})
