import { describe, expect, it } from 'vitest'
import { candidateCreateInputSchema } from '@/view-models/candidate-profile.schema'

const validBase = {
  firstName: 'Camille',
  lastName: 'Durand',
  jobTitleId: 'jt1',
  referentId: 'u1',
  status: 'NOUVEAU' as const,
  salaryMin: null,
  salaryMax: null,
  mobilityRadiusKm: 20,
  softwareIds: [] as string[],
  contractTypes: [] as ('CDI' | 'CDD' | 'INTERIM')[],
}

describe('candidateCreateInputSchema', () => {
  it('accepts minimal valid create input with empty optional collections', () => {
    expect(candidateCreateInputSchema.parse(validBase)).toMatchObject(validBase)
  })

  it('accepte création sans référent', () => {
    expect(candidateCreateInputSchema.parse({ ...validBase, referentId: null }).referentId).toBeNull()
    const withoutReferent = {
      firstName: validBase.firstName,
      lastName: validBase.lastName,
      jobTitleId: validBase.jobTitleId,
      status: validBase.status,
      salaryMin: validBase.salaryMin,
      salaryMax: validBase.salaryMax,
      mobilityRadiusKm: validBase.mobilityRadiusKm,
      softwareIds: validBase.softwareIds,
      contractTypes: validBase.contractTypes,
    }
    expect(candidateCreateInputSchema.parse(withoutReferent).referentId).toBeUndefined()
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

  it('accepts optional cvUrl on allowed blob domain', () => {
    const cvUrl = 'https://abc123.public.blob.vercel-storage.com/candidate/import/cv.pdf'
    expect(candidateCreateInputSchema.parse({ ...validBase, cvUrl }).cvUrl).toBe(cvUrl)
  })

  it('rejects cvUrl outside allowed blob domain', () => {
    expect(
      candidateCreateInputSchema.safeParse({
        ...validBase,
        cvUrl: 'https://evil.example.com/cv.pdf',
      }).success,
    ).toBe(false)
  })
})
