import { describe, it, expect } from 'vitest'
import { activityLogScopesFromContext } from '@/components/molecules/email-button/activity-log-context'

describe('activityLogScopesFromContext', () => {
  it('deduplicates pharmacy scopes when pharmacyId and pharmacyIds overlap', () => {
    const scopes = activityLogScopesFromContext({
      candidateId: 'c1',
      pharmacyId: 'p1',
      pharmacyIds: ['p1', 'p2'],
    })
    expect(scopes).toEqual([
      { entityType: 'CANDIDATE', entityId: 'c1' },
      { entityType: 'PHARMACY', entityId: 'p1' },
      { entityType: 'PHARMACY', entityId: 'p2' },
    ])
  })
})
