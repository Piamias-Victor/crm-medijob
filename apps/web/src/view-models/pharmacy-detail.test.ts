import { describe, it, expect } from 'vitest'
import { toPharmacyDetail, toPharmacyContactRows, toPharmacyMissionRows } from '@/view-models/pharmacy-detail'
import type { PharmacyDetailEntity } from '@/view-models/pharmacy-detail.types'

const entity: PharmacyDetailEntity = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  siret: '123',
  numeroTVA: null,
  address: null,
  city: 'Paris',
  postalCode: null,
  phone: null,
  email: null,
  website: null,
  status: 'ACTIF',
  groupementId: 'g1',
  softwareId: null,
  paymentConditions: null,
  notes: null,
  updatedAt: new Date('2026-01-15'),
  groupement: { id: 'g1', name: 'Giphar' },
  software: null,
  contacts: [
    {
      id: 'c1',
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie@example.com',
      phone: '0102030405',
      role: 'TITULAIRE',
      isPrimary: true,
    },
  ],
  missions: [
    {
      id: 'm1',
      title: 'Titulaire CDI',
      status: 'A_POURVOIR',
      contractType: 'CDI',
      startDate: new Date('2026-02-01'),
      jobTitle: { name: 'Pharmacien' },
      referent: { name: 'Réf Demo' },
    },
    {
      id: 'm2',
      title: 'Pourvu',
      status: 'POURVU',
      contractType: 'CDD',
      startDate: new Date('2026-01-01'),
      jobTitle: { name: 'Préparateur' },
      referent: { name: 'Réf Demo' },
    },
  ],
}

describe('toPharmacyDetail', () => {
  it('maps pharmacy detail with primary contact and active missions only', () => {
    const payload = toPharmacyDetail(entity)
    expect(payload.primaryContactName).toBe('Marie Curie')
    expect(payload.groupementName).toBe('Giphar')
    expect(payload.activeMissions).toHaveLength(1)
    expect(payload.activeMissions[0]?.title).toBe('Titulaire CDI')
  })
})

describe('toPharmacyContactRows', () => {
  it('maps contact list rows for pharmacy tab', () => {
    const rows = toPharmacyContactRows(entity.contacts)
    expect(rows[0]?.fullName).toBe('Marie Curie')
    expect(rows[0]?.isPrimary).toBe(true)
  })
})

describe('toPharmacyMissionRows', () => {
  it('excludes terminal mission statuses', () => {
    const rows = toPharmacyMissionRows(entity.missions)
    expect(rows.map((r) => r.id)).toEqual(['m1'])
  })
})
