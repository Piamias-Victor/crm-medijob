import { describe, expect, it } from 'vitest'
import { buildFacturationSlices } from '@/view-models/facturation-slices'
import { sliceMission, wonSliceMission } from '@/view-models/facturation-slices.test.fixtures'
import {
  FACTURATION_PHARMACY_OTHERS_KEY,
  FACTURATION_PHARMACY_OTHERS_LABEL,
} from '@/view-models/limit-pharmacy-slices'

describe('buildFacturationSlices pharmacy limit', () => {
  it('keeps top 8 pharmacies and folds the rest into Autres', () => {
    const missions = Array.from({ length: 9 }, (_, index) =>
      sliceMission({
        id: `m-${index}`,
        pharmacyId: `p-${index}`,
        pharmacyName: `Pharma ${index}`,
        marge: 10,
        devis: [
          {
            ...wonSliceMission.devis[0]!,
            id: `d-${index}`,
            missionId: `m-${index}`,
            amountHt: 1000 - index * 100,
          },
        ],
      }),
    )
    const pharmacies = buildFacturationSlices(missions).byPharmacy
    expect(pharmacies).toHaveLength(9)
    expect(pharmacies.at(-1)).toEqual({
      key: FACTURATION_PHARMACY_OTHERS_KEY,
      label: FACTURATION_PHARMACY_OTHERS_LABEL,
      ca: 200,
      marge: 10,
    })
  })

  it('does not expose a Candidate slice', () => {
    expect(buildFacturationSlices([wonSliceMission])).not.toHaveProperty('byCandidate')
  })
})
