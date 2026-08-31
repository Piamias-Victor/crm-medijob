import { describe, expect, it } from 'vitest'
import { toAvailabilityFilterRow } from '@/view-models/weekly-availability-filter-row'
import type { AvailabilityFilterPoolRow } from '@/server/weekly-availability/filter-pool'

const row: AvailabilityFilterPoolRow = {
  id: 'marie',
  firstName: 'Marie',
  lastName: 'Dupont',
  phone: '06 12 34 56 78',
  city: 'Lyon',
  postalCode: '69003',
  jobTitleName: 'Préparateur',
}

describe('toAvailabilityFilterRow', () => {
  it('exposes tel and sms contact without a MissionCandidate id', () => {
    const mapped = toAvailabilityFilterRow(row)
    expect(mapped.telHref).toBe('tel:06 12 34 56 78')
    expect(mapped.smsHref).toBe('sms:+33612345678')
    expect(mapped).not.toHaveProperty('missionCandidateId')
    expect(Object.keys(mapped)).toEqual([
      'id',
      'fullName',
      'jobTitleName',
      'city',
      'phone',
      'telHref',
      'smsHref',
    ])
  })
})
