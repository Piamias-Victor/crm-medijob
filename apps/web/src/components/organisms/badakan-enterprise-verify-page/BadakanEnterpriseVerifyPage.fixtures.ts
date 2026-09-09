import { toIncomingPharmacyRow } from '@/view-models/badakan-enterprise-incoming'
import type { BadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'
import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'

export const verifyRow: EnterpriseVerifyRow = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  siret: '12345678901234',
  address: '1 rue de la Paix',
  city: 'Paris',
  postalCode: '75001',
  principalFirstName: 'Dominique',
  principalLastName: 'Litzler',
  principalEmail: 'd.litzler@hermes.fr',
  principalPhone: '0601020304',
  pharmacyId: null,
  verifiedAt: null,
}

export const existingVerifyPreview: BadakanEnterprisePreview = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  statusLabel: 'Pharmacie déjà dans le CRM',
  contactActionLabel: 'Fusionner par email',
  confirmLabel: 'Fusionner',
  existingPharmacyId: 'p-exist',
  existingPharmacyHref: '/pharmacies/p-exist',
  existingPharmacyName: 'Hermes CRM',
  siret: '12345678901234',
  blockHint: 'Ce SIRET est déjà dans le CRM. Comparez les fiches puis fusionnez.',
  incomingPharmacy: toIncomingPharmacyRow(verifyRow),
  fields: [{ label: 'Nom', value: 'Pharmacie Hermes' }],
}

export const newVerifyPreview: BadakanEnterprisePreview = {
  ...existingVerifyPreview,
  statusLabel: 'Nouvelle pharmacie',
  confirmLabel: 'Créer la pharmacie',
  existingPharmacyId: null,
  existingPharmacyHref: null,
  existingPharmacyName: null,
  blockHint: null,
}
