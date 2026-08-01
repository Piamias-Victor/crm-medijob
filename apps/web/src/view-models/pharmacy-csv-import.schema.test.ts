import { describe, expect, it } from 'vitest'
import {
  mapPharmacyCsvRows,
  pharmacyCsvColumnMapSchema,
} from '@/view-models/pharmacy-csv-import.schema'

describe('mapPharmacyCsvRows', () => {
  const headers = ['Nom', 'SIRET', 'Ville', 'CP', 'Statut']
  const map = pharmacyCsvColumnMapSchema.parse({
    name: 'Nom',
    siret: 'SIRET',
    city: 'Ville',
    postalCode: 'CP',
    status: 'Statut',
  })

  it('maps valid rows including Client → ACTIF', () => {
    const result = mapPharmacyCsvRows(headers, [['Pharma A', '12345678901234', 'Paris', '75001', 'Client']], map)
    expect(result.errors).toEqual([])
    expect(result.rows).toEqual([
      expect.objectContaining({
        name: 'Pharma A',
        siret: '12345678901234',
        city: 'Paris',
        postalCode: '75001',
        status: 'ACTIF',
      }),
    ])
  })

  it('returns blocking row errors without silent rows', () => {
    const result = mapPharmacyCsvRows(headers, [['', '', 'Paris', '75001', 'Client']], map)
    expect(result.rows).toEqual([])
    expect(result.errors).toEqual([
      expect.objectContaining({ row: 2, message: expect.stringContaining('Nom') }),
    ])
  })

  it('defaults missing status to PROSPECT', () => {
    const noStatus = pharmacyCsvColumnMapSchema.parse({
      name: 'Nom',
      city: 'Ville',
      postalCode: 'CP',
    })
    const headers2 = ['Nom', 'Ville', 'CP']
    const result = mapPharmacyCsvRows(headers2, [['Pharma B', 'Lyon', '69001']], noStatus)
    expect(result.rows[0]?.status).toBe('PROSPECT')
  })
})
