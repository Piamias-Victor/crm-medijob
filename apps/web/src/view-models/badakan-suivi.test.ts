// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toSuiviBuckets } from './badakan-suivi'

const base = {
  id: 'm1',
  pharmacyName: 'Cygne',
  city: 'Strasbourg',
  postalCode: '67000',
  periods: [{ start: '2026-09-10', end: '2026-09-12' }],
  expectedRecipients: 1,
  staffedRecipients: 0,
  jobTitle: { name: 'Pharmacien' },
  software: { name: 'LGPI' },
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

  it('marks staffed as crm when VALIDE but Badakan step not STAFFED', () => {
    const buckets = toSuiviBuckets([
      {
        ...base,
        id: 'crm',
        step: 'CREATED',
        proposals: [{ status: 'VALIDE' }],
      },
      {
        ...base,
        id: 'bk',
        step: 'STAFFED',
        proposals: [{ status: 'VALIDE', amountHt: 450 }],
      },
    ])
    expect(buckets.staffed.map((row) => [row.id, row.staffingOrigin, row.hasAmount])).toEqual([
      ['crm', 'crm', false],
      ['bk', 'badakan', true],
    ])
  })
})
