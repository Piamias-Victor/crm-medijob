import { describe, it, expect } from 'vitest'
import { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'
import { toPharmacyFormValues } from '@/view-models/pharmacy-form'

describe('pharmacyInputSchema', () => {
  it('accepts minimal valid create input with PROSPECT default', () => {
    const parsed = pharmacyInputSchema.parse({ name: 'Pharmacie Test' })
    expect(parsed).toMatchObject({ name: 'Pharmacie Test', status: 'PROSPECT' })
  })

  it('rejects an invalid email', () => {
    const result = pharmacyInputSchema.safeParse({ name: 'Test', email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('toPharmacyFormValues', () => {
  it('maps nullable Pharmacy fields to form defaults', () => {
    const values = toPharmacyFormValues({
      name: 'Pharmacie Centrale',
      siret: null,
      numeroTVA: 'FR123',
      address: null,
      city: 'Lyon',
      postalCode: '69001',
      phone: null,
      email: null,
      website: null,
      status: 'ACTIF',
      groupementId: 'g1',
      softwareId: null,
    })
    expect(values).toEqual({
      name: 'Pharmacie Centrale',
      numeroTVA: 'FR123',
      city: 'Lyon',
      postalCode: '69001',
      status: 'ACTIF',
      groupementId: 'g1',
    })
  })
})
