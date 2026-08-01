import type { PharmacyQuickViewRepoRow } from '@/view-models/pharmacy-quick-view-entity'

export const pharmacyQuickViewRepoRow: PharmacyQuickViewRepoRow = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  address: '10 rue de la Paix',
  postalCode: '75002',
  city: 'Paris',
  phone: '0102030405',
  email: 'contact@pharma.fr',
  contacts: [
    {
      id: 'c1',
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie@pharma.fr',
      phone: null,
      isPrimary: true,
    },
  ],
  missions: [
    {
      id: 'm1',
      title: 'CDI',
      status: 'A_POURVOIR',
      jobTitle: { name: 'Pharmacien' },
    },
  ],
  activities: [
    {
      id: 'a1',
      type: 'NOTE',
      content: 'Fiche créée',
      date: new Date('2026-07-01T09:00:00Z'),
      createdAt: new Date('2026-07-01T09:00:00Z'),
      author: { name: 'Système' },
    },
  ],
}
