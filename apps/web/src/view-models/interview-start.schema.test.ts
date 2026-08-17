import { describe, expect, it } from 'vitest'
import { interviewStartSchema } from '@/view-models/interview-start.schema'

const valid = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  jobTitleId: 'jt1',
  mode: 'INTERIM' as const,
}

describe('interviewStartSchema', () => {
  it('accepts identity with email and mode', () => {
    expect(interviewStartSchema.parse(valid)).toMatchObject(valid)
  })

  it('accepts phone instead of email', () => {
    expect(
      interviewStartSchema.parse({
        firstName: 'Camille',
        lastName: 'Durand',
        phone: '0601020304',
        jobTitleId: 'jt1',
        mode: 'CDD_CDI',
      }).phone,
    ).toBe('0601020304')
  })

  it('rejects missing email and phone', () => {
    expect(interviewStartSchema.safeParse({ ...valid, email: undefined }).success).toBe(false)
  })

  it('rejects missing first name', () => {
    expect(interviewStartSchema.safeParse({ ...valid, firstName: '  ' }).success).toBe(false)
  })
})
