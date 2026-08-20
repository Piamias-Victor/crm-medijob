// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { activityEntityData, activityEntityFilter, entityFilter } from './entity-scope'

describe('entity-scope PHARMACY', () => {
  it('lists own documents and Mission DEVIS for that Pharmacy', () => {
    expect(entityFilter('PHARMACY', 'p1')).toEqual({
      OR: [
        { pharmacyId: 'p1' },
        {
          entityType: 'MISSION',
          category: 'DEVIS',
          mission: { pharmacyId: 'p1', deletedAt: null },
        },
      ],
    })
  })
})

describe('entity-scope MISSION', () => {
  it('filters documents by missionId', () => {
    expect(entityFilter('MISSION', 'm1')).toEqual({ missionId: 'm1' })
  })

  it('filters activity logs by missionId and entityType', () => {
    expect(activityEntityFilter('MISSION', 'm1')).toEqual({
      missionId: 'm1',
      entityType: 'MISSION',
    })
  })

  it('maps mission create data with missionId', () => {
    expect(activityEntityData('MISSION', 'm1')).toEqual({
      entityType: 'MISSION',
      missionId: 'm1',
    })
  })
})
