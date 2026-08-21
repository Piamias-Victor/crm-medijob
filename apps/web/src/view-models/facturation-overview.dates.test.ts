import { describe, expect, it } from 'vitest'
import { buildFacturationOverview } from '@/view-models/facturation-overview'
import { sliceMission, wonSliceMission } from '@/view-models/facturation-slices.test.fixtures'

const julyWon = sliceMission({
  id: 'm-july',
  marge: 100,
  devis: [
    {
      ...wonSliceMission.devis[0]!,
      id: 'd-july',
      missionId: 'm-july',
      sentAt: new Date('2026-08-20T00:00:00Z'),
      acceptedAt: new Date('2026-07-04T00:00:00Z'),
      amountHt: 900,
    },
  ],
})

describe('buildFacturationOverview acceptedAt', () => {
  it('filters CA by acceptedAt range not sentAt', () => {
    const overview = buildFacturationOverview([wonSliceMission, julyWon], {
      acceptedFrom: '2026-08-01',
      acceptedTo: '2026-08-31',
    })
    expect(overview.ca).toBe(4000)
    expect(overview.marge).toBe(800)
    expect(overview.counts.ACCEPTE).toBe(1)
    expect(overview.slices.byMonth).toEqual([
      { key: '2026-08', label: 'Août 2026', ca: 4000, marge: 800 },
    ])
  })
})
