import { describe, expect, it } from 'vitest'
import { parisDayStartFromYmd } from '@/lib/paris-day-bounds'
import { buildActiviteSeries } from './activite-series'
import type { ActivitePeriod } from './activite-period'

const period: ActivitePeriod = {
  fromYmd: '2026-03-01',
  toYmd: '2026-03-03',
  fromInclusive: parisDayStartFromYmd('2026-03-01'),
  toExclusive: parisDayStartFromYmd('2026-03-04'),
}

describe('buildActiviteSeries', () => {
  it('fills zero days and never sums CRM with Badakan on same tile semantics', () => {
    const bags = {
      candidatesCrm: [parisDayStartFromYmd('2026-03-01')],
      candidatesApp: [],
      appValidated: [parisDayStartFromYmd('2026-03-02')],
      qualifies: [],
      applications: [parisDayStartFromYmd('2026-03-03')],
      missionsCreated: [parisDayStartFromYmd('2026-03-01')],
      missionsFilled: [],
      badakanCreated: [parisDayStartFromYmd('2026-03-01'), parisDayStartFromYmd('2026-03-01')],
      badakanStaffed: [],
    }
    const { entrants, missions } = buildActiviteSeries(period, bags)
    expect(entrants).toHaveLength(3)
    expect(entrants[0]).toMatchObject({ label: '2026-03-01', candidatesCrm: 1, applications: 0 })
    expect(entrants[1]).toMatchObject({ label: '2026-03-02', appValidated: 1, candidatesCrm: 0 })
    expect(entrants[2]).toMatchObject({ label: '2026-03-03', applications: 1 })
    expect(missions[0]).toMatchObject({
      label: '2026-03-01',
      missionsCreated: 1,
      badakanCreated: 2,
    })
    expect(missions[0]!.missionsCreated + missions[0]!.badakanCreated).toBe(3)
  })
})
