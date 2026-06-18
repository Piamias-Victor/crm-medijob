import { describe, it, expect } from 'vitest'
import { toPharmacyListRow, type PharmacyListEntity } from '@/view-models/pharmacy-list'

const base: PharmacyListEntity = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  city: 'Paris',
  status: 'ACTIF',
  groupement: { name: 'Giphar' },
  contacts: [
    { firstName: 'Marie', lastName: 'Curie', isPrimary: true },
    { firstName: 'Paul', lastName: 'Bert', isPrimary: false },
  ],
  _count: { missions: 3 },
}

describe('toPharmacyListRow', () => {
  it('maps the entity to the SPEC_V2 §6.649 list columns', () => {
    expect(toPharmacyListRow(base)).toEqual({
      id: 'p1',
      name: 'Pharmacie du Centre',
      city: 'Paris',
      groupementName: 'Giphar',
      status: 'ACTIF',
      primaryContactName: 'Marie Curie',
      missionCount: 3,
    })
  })

  it('uses null placeholders when groupement and primary contact are absent', () => {
    const row = toPharmacyListRow({
      ...base,
      city: null,
      groupement: null,
      contacts: [{ firstName: 'Paul', lastName: 'Bert', isPrimary: false }],
    })

    expect(row.groupementName).toBeNull()
    expect(row.primaryContactName).toBeNull()
    expect(row.city).toBeNull()
  })
})
