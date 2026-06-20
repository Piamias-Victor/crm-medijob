// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { activityEntityData, activityEntityFilter, entityFilter } from './entity-scope'

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
