import { describe, it, expect } from 'vitest'
import { toContactListRow, type ContactListEntity } from '@/view-models/contact-list'

const entity: ContactListEntity = {
  id: 'c1',
  firstName: 'Marie',
  lastName: 'Curie',
  phone: '0102030405',
  email: 'marie@example.com',
  isPrimary: true,
  createdAt: new Date('2026-01-15'),
  contactRole: { id: 'r1', name: 'Titulaire' },
  pharmacy: { name: 'Pharmacie du Centre', city: 'Lyon', postalCode: '69003' },
}

describe('toContactListRow', () => {
  it('maps SPEC list columns with split name and role label', () => {
    const row = toContactListRow(entity)
    expect(row).toMatchObject({
      firstName: 'Marie',
      lastName: 'Curie',
      roleName: 'Titulaire',
      pharmacyName: 'Pharmacie du Centre',
      phone: '0102030405',
      email: 'marie@example.com',
      isPrimary: true,
      city: 'Lyon',
      department: '69',
    })
    expect(row.createdAtLabel).toBe('15/01/2026')
  })
})
