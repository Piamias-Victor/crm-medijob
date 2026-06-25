import { describe, it, expect } from 'vitest'
import { isDuplicateProbeReady, toDetectDuplicateInput } from '@/lib/candidate-duplicate-probe'

describe('isDuplicateProbeReady', () => {
  it('is ready with valid email', () => {
    expect(
      isDuplicateProbeReady({ firstName: 'A', lastName: 'B', email: 'a@x.fr' }),
    ).toBe(true)
  })

  it('is ready with prénom nom téléphone', () => {
    expect(
      isDuplicateProbeReady({ firstName: 'Alice', lastName: 'Martin', phone: '0600000001' }),
    ).toBe(true)
  })

  it('is not ready with partial identity', () => {
    expect(isDuplicateProbeReady({ firstName: 'Alice', lastName: 'Martin' })).toBe(false)
  })
})

describe('toDetectDuplicateInput', () => {
  it('trims identity fields', () => {
    expect(
      toDetectDuplicateInput({
        firstName: ' Alice ',
        lastName: ' Martin ',
        email: ' a@x.fr ',
        phone: ' 0600 ',
      }),
    ).toEqual({
      firstName: 'Alice',
      lastName: 'Martin',
      email: 'a@x.fr',
      phone: '0600',
    })
  })

  it('allows email-only payload for detectDuplicate API', () => {
    expect(toDetectDuplicateInput({ firstName: '', lastName: '', email: 'a@x.fr' })).toEqual({
      email: 'a@x.fr',
    })
  })
})
