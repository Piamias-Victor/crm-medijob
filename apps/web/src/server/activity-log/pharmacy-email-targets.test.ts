import { describe, expect, it } from 'vitest'
import { pharmacyEmailLogTargets } from './pharmacy-email-targets'

describe('pharmacyEmailLogTargets', () => {
  it('attaches Pharmacy and Contact when both exist', () => {
    expect(pharmacyEmailLogTargets({ pharmacyId: 'p1', contactId: 'ct1' })).toEqual([
      { entityType: 'PHARMACY', entityId: 'p1' },
      { entityType: 'CONTACT', entityId: 'ct1' },
    ])
  })

  it('attaches Pharmacy only when there is no Contact', () => {
    expect(pharmacyEmailLogTargets({ pharmacyId: 'p1', contactId: null })).toEqual([
      { entityType: 'PHARMACY', entityId: 'p1' },
    ])
  })
})
