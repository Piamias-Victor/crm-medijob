import { describe, expect, it } from 'vitest'
import { REFERENT_NONE, REFERENT_NONE_OPTION } from '@/lib/constants/referent-none'
import { buildFacturationSlices } from '@/view-models/facturation-slices'
import {
  cancelledSliceMission,
  sliceMission,
  wonSliceMission,
} from '@/view-models/facturation-slices.test.fixtures'

describe('buildFacturationSlices', () => {
  it('sums accepted HT as CA and excludes cancelled missions', () => {
    expect(buildFacturationSlices([wonSliceMission, cancelledSliceMission]).byReferent).toEqual([
      { key: 'u-alice', label: 'Alice', ca: 4000, marge: 800 },
    ])
  })

  it('buckets missions without referent as Sans référent', () => {
    const orphan = sliceMission({
      id: 'm-orphan',
      referentId: null,
      referentName: null,
      marge: 200,
      devis: [{ ...wonSliceMission.devis[0]!, id: 'd-orphan', missionId: 'm-orphan', amountHt: 1000 }],
    })
    expect(buildFacturationSlices([wonSliceMission, orphan]).byReferent).toEqual([
      { key: 'u-alice', label: 'Alice', ca: 4000, marge: 800 },
      { key: REFERENT_NONE, label: REFERENT_NONE_OPTION.label, ca: 1000, marge: 200 },
    ])
  })

  it('slices CA by Pharmacy', () => {
    const other = sliceMission({
      id: 'm-sud',
      pharmacyId: 'p-sud',
      pharmacyName: 'Pharma Sud',
      marge: 100,
      devis: [{ ...wonSliceMission.devis[0]!, id: 'd-sud', missionId: 'm-sud', amountHt: 500 }],
    })
    expect(buildFacturationSlices([wonSliceMission, other]).byPharmacy).toEqual([
      { key: 'p-nord', label: 'Pharma Nord', ca: 4000, marge: 800 },
      { key: 'p-sud', label: 'Pharma Sud', ca: 500, marge: 100 },
    ])
  })

  it('slices CA by contract type', () => {
    const interim = sliceMission({
      id: 'm-int',
      contractType: 'INTERIM',
      marge: 50,
      devis: [{ ...wonSliceMission.devis[0]!, id: 'd-int', missionId: 'm-int', amountHt: 200 }],
    })
    expect(buildFacturationSlices([wonSliceMission, interim]).byContract).toEqual([
      { key: 'CDD', label: 'CDD', ca: 4000, marge: 800 },
      { key: 'INTERIM', label: 'Intérim', ca: 200, marge: 50 },
    ])
  })

  it('buckets CA by acceptedAt month not invoicedAt', () => {
    const invoicedLater = sliceMission({
      id: 'm-won',
      devis: [{ ...wonSliceMission.devis[0]!, invoicedAt: new Date('2026-10-01T00:00:00Z') }],
    })
    const september = sliceMission({
      id: 'm-sep',
      marge: 70,
      devis: [
        {
          ...wonSliceMission.devis[0]!,
          id: 'd-sep',
          missionId: 'm-sep',
          acceptedAt: new Date('2026-09-03T00:00:00Z'),
          invoicedAt: new Date('2026-10-15T00:00:00Z'),
          amountHt: 700,
        },
      ],
    })
    expect(buildFacturationSlices([invoicedLater, september]).byMonth).toEqual([
      { key: '2026-08', label: 'Août 2026', ca: 4000, marge: 800 },
      { key: '2026-09', label: 'Septembre 2026', ca: 700, marge: 70 },
    ])
  })
})
