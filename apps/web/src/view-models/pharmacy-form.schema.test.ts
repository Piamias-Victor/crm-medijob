import { describe, expect, it } from 'vitest'
import { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'

const base = { name: 'Pharmacie Test' }

describe('pharmacyInputSchema referent', () => {
  it('accepte création sans référent', () => {
    expect(pharmacyInputSchema.parse(base).referentId).toBeUndefined()
  })

  it('accepte referentId ou null', () => {
    expect(pharmacyInputSchema.parse({ ...base, referentId: 'u1' }).referentId).toBe('u1')
    expect(pharmacyInputSchema.parse({ ...base, referentId: null }).referentId).toBeNull()
  })
})
