import { describe, expect, it } from 'vitest'
import { inAvailabilitySmsZone } from './availability-sms-zone'

describe('inAvailabilitySmsZone', () => {
  it('accepts Var (83) and rejects Lyon (69)', () => {
    expect(inAvailabilitySmsZone('83000')).toBe(true)
    expect(inAvailabilitySmsZone('69001')).toBe(false)
  })

  it('accepts 06, 13 and Île-de-France', () => {
    expect(inAvailabilitySmsZone('06000')).toBe(true)
    expect(inAvailabilitySmsZone('13008')).toBe(true)
    expect(inAvailabilitySmsZone('75001')).toBe(true)
    expect(inAvailabilitySmsZone('77000')).toBe(true)
    expect(inAvailabilitySmsZone('78000')).toBe(true)
    expect(inAvailabilitySmsZone('91000')).toBe(true)
    expect(inAvailabilitySmsZone('92000')).toBe(true)
    expect(inAvailabilitySmsZone('93000')).toBe(true)
    expect(inAvailabilitySmsZone('94000')).toBe(true)
    expect(inAvailabilitySmsZone('95000')).toBe(true)
  })

  it('rejects a missing postal code', () => {
    expect(inAvailabilitySmsZone(null)).toBe(false)
    expect(inAvailabilitySmsZone('  ')).toBe(false)
  })
})
