import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { buildFacturationSlices } from '@/view-models/facturation-slices'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'
import { PHARMACY_UNLINKED_KEY, PHARMACY_UNLINKED_LABEL } from '@/view-models/finance-line-unlinked'

describe('pilotage unlinked excel lines', () => {
  it('includes unlinked lines in CA/Marge and Non liée pharmacy slice', () => {
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
    const pilotage = buildPilotage([line], [], {})
    expect(pilotage.kpis.ca).toBe(1234)
    expect(pilotage.kpis.marge).toBe(100)
    const slices = buildFacturationSlices([], [line])
    const unlinked = slices.byPharmacy.find((b) => b.key === PHARMACY_UNLINKED_KEY)
    expect(unlinked).toMatchObject({
      key: PHARMACY_UNLINKED_KEY,
      label: 'Label Excel Pharma',
      ca: 1234,
    })
    expect(PHARMACY_UNLINKED_LABEL).toBe('Non liée')
  })
})
