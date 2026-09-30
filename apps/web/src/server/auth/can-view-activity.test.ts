import { describe, expect, it } from 'vitest'
import { canViewActivity } from './can-view-activity'

describe('canViewActivity', () => {
  it('allows Direction and RH_ADMIN only', () => {
    expect(canViewActivity('DIRECTION')).toBe(true)
    expect(canViewActivity('RH_ADMIN')).toBe(true)
    expect(canViewActivity('RECRUTEUR')).toBe(false)
    expect(canViewActivity('COMMUNICATION')).toBe(false)
    expect(canViewActivity(null)).toBe(false)
  })
})
