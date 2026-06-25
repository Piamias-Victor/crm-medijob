import { describe, expect, it } from 'vitest'
import {
  buildPharmacyReturnPath,
  parsePharmacyBackHref,
  pharmacyDetailHref,
} from '@/lib/pharmacy-href'

describe('pharmacy href helpers', () => {
  it('builds return path with search params', () => {
    expect(buildPharmacyReturnPath('/pharmacies', 'statut=ACTIF')).toBe('/pharmacies?statut=ACTIF')
  })

  it('builds detail href with encoded back path', () => {
    expect(pharmacyDetailHref('p1', '/pharmacies?statut=ACTIF')).toBe(
      '/pharmacies/p1?back=%2Fpharmacies%3Fstatut%3DACTIF',
    )
  })

  it('parses safe pharmacy back hrefs only', () => {
    expect(parsePharmacyBackHref(encodeURIComponent('/pharmacies?statut=ACTIF'))).toBe(
      '/pharmacies?statut=ACTIF',
    )
    expect(parsePharmacyBackHref(undefined)).toBe('/pharmacies')
    expect(parsePharmacyBackHref('%')).toBe('/pharmacies')
    expect(parsePharmacyBackHref(encodeURIComponent('/admin'))).toBe('/pharmacies')
  })
})
