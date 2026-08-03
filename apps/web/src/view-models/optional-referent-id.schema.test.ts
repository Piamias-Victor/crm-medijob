import { describe, expect, it } from 'vitest'
import {
  optionalReferentIdSchema,
  toReferentIdOrNull,
} from '@/view-models/optional-referent-id.schema'

describe('optionalReferentIdSchema', () => {
  it('accepte id valide', () => {
    expect(optionalReferentIdSchema.parse('u1')).toBe('u1')
  })

  it('accepte null / omit', () => {
    expect(optionalReferentIdSchema.parse(null)).toBeNull()
    expect(optionalReferentIdSchema.parse(undefined)).toBeUndefined()
  })

  it('rejette chaîne vide', () => {
    expect(optionalReferentIdSchema.safeParse('').success).toBe(false)
  })
})

describe('toReferentIdOrNull', () => {
  it('coerce undefined → null', () => {
    expect(toReferentIdOrNull(undefined)).toBeNull()
    expect(toReferentIdOrNull('u1')).toBe('u1')
  })
})
