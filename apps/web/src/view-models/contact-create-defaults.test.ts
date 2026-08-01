import { describe, expect, it } from 'vitest'
import {
  buildContactCreateDefaults,
  resolveContactCreatePharmacy,
  resolveContactCreateReferent,
  resolveDefaultContactRoleId,
} from '@/view-models/contact-create-defaults'

describe('buildContactCreateDefaults', () => {
  it('returns isPrimary false without pharmacy', () => {
    expect(buildContactCreateDefaults()).toEqual({
      isPrimary: false,
      referentId: null,
    })
  })

  it('pre-fills pharmacyId, referent and contactRoleId when provided', () => {
    expect(
      buildContactCreateDefaults({
        pharmacyId: 'p1',
        referentId: 'u1',
        contactRoleId: 'r-autre',
      }),
    ).toEqual({
      isPrimary: false,
      referentId: 'u1',
      pharmacyId: 'p1',
      contactRoleId: 'r-autre',
    })
  })
})

describe('resolveDefaultContactRoleId', () => {
  it('prefers Autre then first role', () => {
    expect(
      resolveDefaultContactRoleId([
        { id: 'r1', name: 'Titulaire' },
        { id: 'r2', name: 'Autre' },
      ]),
    ).toBe('r2')
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

describe('resolveContactCreateReferent', () => {
  it('préfère le référent pharmacie au user courant', () => {
    expect(resolveContactCreateReferent('pharma-ref', 'session-user')).toBe('pharma-ref')
  })

  it('fallback user courant si pharmacie sans référent', () => {
    expect(resolveContactCreateReferent(null, 'session-user')).toBe('session-user')
  })
})
