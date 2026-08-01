import { describe, it, expect } from 'vitest'
import { formatDateFr } from '@/view-models/format-date-fr'
import { toPharmacyListRow, type PharmacyListEntity } from '@/view-models/pharmacy-list'

const createdAt = new Date('2026-03-15T12:00:00Z')

const base: PharmacyListEntity = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  city: 'Paris',
  postalCode: '69001',
  createdAt,
  status: 'ACTIF',
  groupement: { name: 'Giphar' },
  software: { name: 'Winpharma' },
  referent: { name: 'Alice Martin' },
  contacts: [
    { firstName: 'Marie', lastName: 'Curie', isPrimary: true },
    { firstName: 'Paul', lastName: 'Bert', isPrimary: false },
  ],
  _count: { missions: 3 },
}

describe('toPharmacyListRow', () => {
  it('maps list columns including CSV postal code, date and referent', () => {
    expect(toPharmacyListRow(base)).toEqual({
      id: 'p1',
      name: 'Pharmacie du Centre',
      city: 'Paris',
      postalCode: '69001',
      createdAtLabel: formatDateFr(createdAt),
      groupementName: 'Giphar',
      status: 'ACTIF',
      primaryContactName: 'Marie Curie',
      missionCount: 3,
      softwareName: 'Winpharma',
      referentName: 'Alice Martin',
    })
  })

  it('uses null placeholders when optional CSV fields are absent', () => {
    const row = toPharmacyListRow({
      ...base,
      city: null,
      postalCode: null,
      groupement: null,
      software: null,
      referent: null,
      contacts: [{ firstName: 'Paul', lastName: 'Bert', isPrimary: false }],
    })

    expect(row.groupementName).toBeNull()
    expect(row.primaryContactName).toBeNull()
    expect(row.city).toBeNull()
    expect(row.postalCode).toBeNull()
    expect(row.softwareName).toBeNull()
    expect(row.referentName).toBeNull()
  })
})
