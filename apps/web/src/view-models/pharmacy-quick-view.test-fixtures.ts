import type { PharmacyQuickViewEntity } from '@/view-models/pharmacy-quick-view.types'

export const pharmacyQuickViewEntity: PharmacyQuickViewEntity = {
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
      phone: '0601020304',
      isPrimary: true,
    },
    {
      id: 'c2',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: null,
      phone: null,
      isPrimary: false,
    },
  ],
  missions: [
    {
      id: 'm1',
      title: 'Remplacement été',
      status: 'A_POURVOIR',
      jobTitle: { name: 'Pharmacien' },
    },
    {
      id: 'm2',
      title: 'Ancienne',
      status: 'POURVU',
      jobTitle: { name: 'Préparateur' },
    },
  ],
  lastActivity: {
    id: 'a1',
    type: 'APPEL',
    content: 'Rappel titulaire',
    date: new Date('2026-07-15T10:00:00Z'),
    createdAt: new Date('2026-07-15T10:00:00Z'),
    author: { name: 'Alice' },
  },
}
