import type { PharmacyDetailEntity } from '@/view-models/pharmacy-detail.types'
import type { PharmacyListEntity } from '@/view-models/pharmacy-list'

export { pharmacyQuickViewRepoRow } from '@/server/routers/pharmacy-quick-view.test.fixtures'

export const pharmacyListEntity: PharmacyListEntity = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  city: 'Paris',
  postalCode: '75001',
  createdAt: new Date('2026-03-15T12:00:00Z'),
  status: 'ACTIF',
  groupement: { name: 'Giphar' },
  software: { name: 'Winpharma' },
  referent: { name: 'Alice' },
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
  referentId: null,
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
      isPrimary: true,
      contactRole: { name: 'Titulaire' },
    },
  ],
  missions: [
    {
      id: 'm1',
      title: 'CDI',
      status: 'A_POURVOIR',
      contractType: 'CDI',
      startDate: new Date(),
      updatedAt: new Date(),
      jobTitle: { name: 'Pharmacien' },
      referent: { name: 'Réf' },
    },
  ],
}
