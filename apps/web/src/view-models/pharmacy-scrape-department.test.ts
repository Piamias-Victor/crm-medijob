import { describe, expect, it } from 'vitest'
import { toScrapeDepartment } from '@/view-models/pharmacy-scrape-department'

describe('toScrapeDepartment', () => {
  it('keeps a 2-digit department as-is', () => {
    expect(toScrapeDepartment('69')).toBe('69')
    expect(toScrapeDepartment('06')).toBe('06')
  })

  it('derives department from a 5-digit postal code', () => {
    expect(toScrapeDepartment('69001')).toBe('69')
  })

  it('normalizes excel numeric department strings', () => {
    expect(toScrapeDepartment('44.0')).toBe('44')
  })

  it('returns null for empty or unusable values', () => {
    expect(toScrapeDepartment('')).toBeNull()
    expect(toScrapeDepartment('AB')).toBeNull()
  })
})
