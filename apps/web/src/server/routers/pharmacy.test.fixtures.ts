import type { PharmacyDetailEntity } from '@/view-models/pharmacy-detail.types'
import type { PharmacyListEntity } from '@/view-models/pharmacy-list'

export const pharmacyListEntity: PharmacyListEntity = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  city: 'Paris',
  status: 'ACTIF',
  groupement: { name: 'Giphar' },
  software: { name: 'Winpharma' },
  contacts: [{ firstName: 'Marie', lastName: 'Curie', isPrimary: true }],
  _count: { missions: 2 },
}

export const pharmacyDetailEntity: PharmacyDetailEntity = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  siret: null,
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
      email: null,
      phone: null,
      role: 'TITULAIRE',
      isPrimary: true,
    },
  ],
  missions: [
    {
      id: 'm1',
      title: 'CDI',
      status: 'A_POURVOIR',
      contractType: 'CDI',
      startDate: new Date(),
      jobTitle: { name: 'Pharmacien' },
      referent: { name: 'Réf' },
    },
  ],
}
