// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toSuiviBuckets } from './badakan-suivi'

const base = {
  id: 'm1',
  pharmacyName: 'Cygne',
  city: 'Strasbourg',
  periods: [{ start: '2026-09-10', end: '2026-09-12' }],
  expectedRecipients: 1,
  staffedRecipients: 0,
  jobTitle: { name: 'Pharmacien' },
  activityLabel: null,
}

describe('toSuiviBuckets', () => {
  it('keeps only CREATED missions in À pourvoir', () => {
    const buckets = toSuiviBuckets([
      { ...base, id: 'open', step: 'CREATED', proposals: [] },
      { ...base, id: 'draft', step: 'DRAFT', proposals: [] },
      { ...base, id: 'cancel', step: 'CANCELLED', proposals: [] },
      { ...base, id: 'prop', step: 'CREATED', proposals: [{ status: 'PROPOSE' }] },
      {
        ...base,
        id: 'ok',
        step: 'CREATED',
        staffedRecipients: 1,
        proposals: [{ status: 'VALIDE' }],
      },
    ])
    expect(buckets.counts).toEqual({ open: 1, proposed: 1, staffed: 1 })
    expect(buckets.open[0]?.id).toBe('open')
  })
})
