import { describe, expect, it } from 'vitest'
import { ACTIVITY_TYPE_FORM_OPTIONS, ACTIVITY_TYPE_LABELS } from './activity-log.labels'
import { createActivityLogSchema } from './activity-log.schema'

describe('ActivityType SMS', () => {
  it('labels SMS for the timeline filter', () => {
    expect(ACTIVITY_TYPE_LABELS.SMS).toBe('SMS')
  })

  it('hides SMS from the recruiter form', () => {
    expect(ACTIVITY_TYPE_FORM_OPTIONS.some((option) => option.value === 'SMS')).toBe(false)
  })

  it('rejects recruiter-created SMS entries', () => {
    const parsed = createActivityLogSchema.safeParse({
      entityType: 'CANDIDATE',
      entityId: 'c1',
      type: 'SMS',
      date: new Date('2026-09-10'),
    })
    expect(parsed.success).toBe(false)
  })
})
