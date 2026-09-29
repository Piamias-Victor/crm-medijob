import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { buildFacturationSlices } from '@/view-models/facturation-slices'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'
import { financeLinePharmacyKey } from '@/view-models/finance-line-pharmacy-key'
import { PHARMACY_UNLINKED_LABEL } from '@/view-models/finance-line-unlinked'

describe('pilotage unlinked excel lines', () => {
  it('includes unlinked lines in CA/Marge and keeps Excel pharmacy labels distinct', () => {
    const line = pilotageLine({
      id: 'x1',
      pharmacyId: null,
      pharmacyName: 'Label Excel Pharma',
      pharmacyLabel: 'Label Excel Pharma',
      candidateId: null,
      candidateName: 'Label Excel Cand',
      candidateLabel: 'Label Excel Cand',
      amountHt: 1234,
      marge: 100,
      source: 'EXCEL_IMPORT',
    })
    const other = pilotageLine({
      id: 'x2',
      pharmacyId: null,
      pharmacyName: 'Autre Excel',
      pharmacyLabel: 'Autre Excel',
      candidateId: null,
      amountHt: 100,
      marge: 10,
      source: 'EXCEL_IMPORT',
    })
    const pilotage = buildPilotage([line], [], {})
    expect(pilotage.kpis.ca).toBe(1234)
    expect(pilotage.kpis.marge).toBe(100)
    const slices = buildFacturationSlices([], [line, other])
    expect(slices.byPharmacy).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: financeLinePharmacyKey(null, 'Label Excel Pharma'),
          label: 'Label Excel Pharma',
          ca: 1234,
        }),
        expect.objectContaining({
          key: financeLinePharmacyKey(null, 'Autre Excel'),
          label: 'Autre Excel',
          ca: 100,
        }),
      ]),
    )
    expect(PHARMACY_UNLINKED_LABEL).toBe('Non liée')
  })
})
