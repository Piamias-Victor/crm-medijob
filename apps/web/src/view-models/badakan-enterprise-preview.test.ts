import { describe, expect, it } from 'vitest'
import { toBadakanEnterprisePreview } from './badakan-enterprise-preview'
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

describe('toBadakanEnterprisePreview', () => {
  it('labels an existing SIRET match as Pharmacy existante', () => {
    const vm = toBadakanEnterprisePreview(row, {
      existingPharmacy: { id: 'p-exist', name: 'Hermes CRM', siret: '12345678901234' },
      contactMatch: { id: 'c-dom', email: 'd.litzler@hermes.fr', phone: null, reason: 'email' },
    })
    expect(vm.statusLabel).toBe('Pharmacy existante')
    expect(vm.contactActionLabel).toBe('Fusionner par email')
    expect(vm.existingPharmacyHref).toBe('/pharmacies/p-exist')
  })

  it('labels a new SIRET as Nouvelle Pharmacy', () => {
    const vm = toBadakanEnterprisePreview(row, {
      existingPharmacy: null,
      contactMatch: null,
    })
    expect(vm.statusLabel).toBe('Nouvelle Pharmacy')
    expect(vm.contactActionLabel).toBe('Créer le Contact principal')
  })
})
