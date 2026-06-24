import { describe, expect, it } from 'vitest'
import { candidateCreateInputSchema } from '@/view-models/candidate-profile.schema'

const validBase = {
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  referentId: 'u1',
  mobilityRadiusKm: 20,
  softwareIds: [] as string[],
  contractTypes: [] as ('CDI' | 'CDD' | 'INTERIM')[],
}

describe('candidateCreateInputSchema', () => {
  it('accepts minimal valid create input with empty optional collections', () => {
    expect(candidateCreateInputSchema.parse(validBase)).toMatchObject(validBase)
  })

  it('rejects missing identity fields', () => {
    expect(candidateCreateInputSchema.safeParse({ ...validBase, firstName: '' }).success).toBe(false)
    expect(candidateCreateInputSchema.safeParse({ ...validBase, lastName: '   ' }).success).toBe(
      false,
    )
  })

  it('rejects invalid email', () => {
    expect(
      candidateCreateInputSchema.safeParse({ ...validBase, email: 'not-an-email' }).success,
    ).toBe(false)
  })

  it('rejects VACATION contract type on create', () => {
    expect(
      candidateCreateInputSchema.safeParse({ ...validBase, contractTypes: ['VACATION'] }).success,
    ).toBe(false)
  })

  it('accepts CDI, CDD and INTERIM contract types', () => {
    expect(
      candidateCreateInputSchema.parse({ ...validBase, contractTypes: ['CDI', 'INTERIM'] })
        .contractTypes,
    ).toEqual(['CDI', 'INTERIM'])
  })
})
