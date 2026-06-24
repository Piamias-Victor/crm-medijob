import { describe, it, expect } from 'vitest'
import { defaultFieldValuesEqual, fieldValuesDiffer } from '@/lib/merge/field-values-equal'

describe('defaultFieldValuesEqual', () => {
  it('treats equal dates as equal', () => {
    const left = new Date('2026-01-15T10:00:00.000Z')
    const right = new Date('2026-01-15T10:00:00.000Z')

    expect(defaultFieldValuesEqual(left, right)).toBe(true)
  })

  it('treats different dates as different', () => {
    const left = new Date('2026-01-15T10:00:00.000Z')
    const right = new Date('2026-01-16T10:00:00.000Z')

    expect(defaultFieldValuesEqual(left, right)).toBe(false)
  })
})

describe('fieldValuesDiffer', () => {
  it('uses a custom equals function when provided', () => {
    const equals = (left: string, right: string) => left.toLowerCase() === right.toLowerCase()

    expect(fieldValuesDiffer('Marie', 'marie', equals)).toBe(false)
  })
})
