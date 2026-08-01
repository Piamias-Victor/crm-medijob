import { describe, expect, it } from 'vitest'
import { contactInputSchema } from '@/view-models/contact-form.schema'

const base = {
  pharmacyId: 'p1',
  firstName: 'Marie',
  lastName: 'Curie',
}

describe('contactInputSchema referent', () => {
  it('accepte création sans référent', () => {
    expect(contactInputSchema.parse(base).referentId).toBeUndefined()
  })

  it('accepte referentId', () => {
    expect(contactInputSchema.parse({ ...base, referentId: 'u1' }).referentId).toBe('u1')
  })
})
