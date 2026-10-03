import { describe, expect, it } from 'vitest'
import { publicApplyFormSchema } from '@/view-models/public-apply.schema'

const valid = {
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice@example.com',
  phone: '06 12 34 56 78',
  city: 'Lyon',
  postalCode: '69001',
  message: '',
  consentGiven: true as const,
}

describe('publicApplyFormSchema', () => {
  it('parses valid FR payload and normalizes phone', () => {
    const parsed = publicApplyFormSchema.parse(valid)
    expect(parsed.phone).toBe('33612345678')
    expect(parsed.postalCode).toBe('69001')
  })

  it('rejects missing consent', () => {
    const result = publicApplyFormSchema.safeParse({ ...valid, consentGiven: false })
    expect(result.success).toBe(false)
  })

  it('rejects invalid postal code', () => {
    const result = publicApplyFormSchema.safeParse({ ...valid, postalCode: '6900' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = publicApplyFormSchema.safeParse({ ...valid, email: 'nope' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid phone', () => {
    const result = publicApplyFormSchema.safeParse({ ...valid, phone: '123' })
    expect(result.success).toBe(false)
  })
})
