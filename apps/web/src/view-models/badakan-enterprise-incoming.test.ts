import { describe, expect, it } from 'vitest'
import { toIncomingPharmacyRow } from './badakan-enterprise-incoming'
import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'

const row: EnterpriseVerifyRow = {
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

describe('toIncomingPharmacyRow', () => {
  it('maps Badakan fields onto the pharmacy merge incoming side', () => {
    expect(toIncomingPharmacyRow(row)).toMatchObject({
      name: 'Pharmacie Hermes',
      siret: '12345678901234',
      address: '1 rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      email: 'd.litzler@hermes.fr',
      phone: '0601020304',
      status: 'PROSPECT',
    })
  })
})
