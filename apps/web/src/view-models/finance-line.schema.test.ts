import { describe, expect, it } from 'vitest'
import { createFinanceLineSchema } from '@/view-models/finance-line.schema'

const placementBase = {
  pharmacyId: 'p1',
  candidateId: 'c1',
  kind: 'PLACEMENT' as const,
  occurredAt: '2026-08-01',
}

describe('createFinanceLineSchema', () => {
  it('allows Placement CA 0', () => {
    const parsed = createFinanceLineSchema.parse({
      ...placementBase,
      amountHt: 0,
      placementContractType: 'CDI',
    })
    expect(parsed.amountHt).toBe(0)
  })

  it('rejects Placement without CDD or CDI', () => {
    expect(() => createFinanceLineSchema.parse({ ...placementBase, amountHt: 1000 })).toThrow()
  })

  it('allows Intérim without CDD or CDI', () => {
    const parsed = createFinanceLineSchema.parse({
      pharmacyId: 'p1',
      candidateId: 'c1',
      kind: 'INTERIM',
      amountHt: 400,
      occurredAt: '2026-08-01',
    })
    expect(parsed.kind).toBe('INTERIM')
  })

  it('keeps Referent optional and stores the User id', () => {
    const withReferent = createFinanceLineSchema.parse({
      ...placementBase,
      amountHt: 0,
      placementContractType: 'CDI',
      referentId: 'u-alice',
    })
    const without = createFinanceLineSchema.parse({
      ...placementBase,
      amountHt: 0,
      placementContractType: 'CDD',
    })
    expect(withReferent.referentId).toBe('u-alice')
    expect(without.referentId).toBeUndefined()
  })
})
