import { describe, expect, it } from 'vitest'
import { toContactQuickView } from '@/view-models/contact-quick-view'

describe('toContactQuickView', () => {
  it('maps identity, role, pharmacy and coords for triage', () => {
    expect(
      toContactQuickView({
        id: 'c1',
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie@example.com',
        phone: '0102030405',
        isPrimary: true,
        contactRole: { name: 'Titulaire' },
        pharmacy: { id: 'p1', name: 'Pharmacie du Centre', city: 'Lyon' },
      }),
    ).toEqual({
      id: 'c1',
      fullName: 'Marie Curie',
      roleName: 'Titulaire',
      isPrimary: true,
      email: 'marie@example.com',
      phone: '0102030405',
      pharmacyName: 'Pharmacie du Centre',
      city: 'Lyon',
    })
  })
})
