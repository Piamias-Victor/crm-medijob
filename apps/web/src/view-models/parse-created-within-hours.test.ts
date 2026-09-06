// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { parseCreatedWithinHours } from '@/view-models/parse-created-within-hours'

describe('parseCreatedWithinHours', () => {
  it('accepts 1–168 hour windows', () => {
    expect(parseCreatedWithinHours('24')).toBe(24)
    expect(parseCreatedWithinHours('0')).toBeUndefined()
    expect(parseCreatedWithinHours('abc')).toBeUndefined()
  })
})
