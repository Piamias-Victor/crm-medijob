export const missionFilterRow = {
  id: 'm1',
  pharmacyName: 'Pharmacie Hermès',
  step: 'CANCELLED',
  stepLabel: 'Annulée',
  periodLabel: '03/03/2026',
  href: '/interim/missions/m1',
}

export const needFilterRow = {
  id: 'n1',
  pharmacyName: 'Pharmacie du Cygne',
  cityLabel: 'Strasbourg',
  postalCode: '67000',
  jobTitleLabel: 'Pharmacien',
  softwareLabel: 'LGPI',
  gapLabel: '0/1 pourvus',
  periodLabel: '10/09/2026',
  periods: [{ start: '2026-09-10', end: '2026-09-12' }],
  expectedRecipients: 1,
  staffedRecipients: 0,
  step: 'CANCELLED',
  stepLabel: 'Annulée',
  href: '/interim/missions/n1',
}

export const contractFilterRow = {
  id: 'c1',
  recipientName: 'Margo Rié',
  pharmacyName: 'Pharmacie du Parc',
  status: 'VALIDATED',
  statusLabel: 'Validé',
  pdfHref: null,
  dpaeHref: null,
}

export const enterpriseFilterRow = {
  id: 'e1',
  name: 'MLM Investissements',
  siretLabel: '12345678900011',
  cityLabel: 'Paris',
  href: '/interim/officines/e1',
  blockKind: 'ready' as const,
  blockLabel: 'Prêt',
}

export const emptyNeedFilter = {
  q: '',
  steps: [] as string[],
  week: '',
  ville: '',
  departement: [] as string[],
  metier: '',
}
