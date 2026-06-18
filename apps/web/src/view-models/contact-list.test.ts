import { describe, it, expect } from 'vitest'
import { toContactListRow, type ContactListEntity } from '@/view-models/contact-list'

const entity: ContactListEntity = {
  id: 'c1',
  firstName: 'Marie',
  lastName: 'Curie',
  role: 'TITULAIRE',
  phone: '0102030405',
  email: 'marie@example.com',
  createdAt: new Date('2026-01-15'),
  pharmacy: { name: 'Pharmacie du Centre' },
}

describe('toContactListRow', () => {
  it('maps SPEC list columns', () => {
    const row = toContactListRow(entity)
    expect(row).toMatchObject({
      fullName: 'Marie Curie',
      role: 'TITULAIRE',
      pharmacyName: 'Pharmacie du Centre',
      phone: '0102030405',
      email: 'marie@example.com',
    })
    expect(row.createdAtLabel).toBe('15/01/2026')
  })
})
