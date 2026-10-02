import { describe, expect, it } from 'vitest'
import { isPublicApplyHoneypotFilled } from '@/view-models/public-apply.schema'

describe('isPublicApplyHoneypotFilled', () => {
  it('is false when empty', () => {
    expect(isPublicApplyHoneypotFilled('')).toBe(false)
    expect(isPublicApplyHoneypotFilled(undefined)).toBe(false)
  })

  it('is true when bots fill the field', () => {
    expect(isPublicApplyHoneypotFilled('http://spam')).toBe(true)
  })
})
