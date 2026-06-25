import { describe, it, expect } from 'vitest'
import { detectDuplicateInputSchema } from '@/view-models/candidate-duplicate.schema'

describe('detectDuplicateInputSchema', () => {
  it('accepts email-only probe', () => {
    const parsed = detectDuplicateInputSchema.safeParse({ email: 'alice@x.fr' })
    expect(parsed.success).toBe(true)
  })

  it('accepts prénom nom téléphone probe', () => {
    const parsed = detectDuplicateInputSchema.safeParse({
      firstName: 'Alice',
      lastName: 'Martin',
      phone: '0600000001',
    })
    expect(parsed.success).toBe(true)
  })

  it('rejects empty probe', () => {
    expect(detectDuplicateInputSchema.safeParse({}).success).toBe(false)
  })
})
