// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { normalizeCvExtractionJson } from '@/server/ai/cv-extraction-normalize'

describe('normalizeCvExtractionJson', () => {
  it('drops invalid emails and keeps valid contact fields', () => {
    expect(
      normalizeCvExtractionJson({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'not-an-email',
        phone: '06 12 34 56 78',
        availableFrom: '2026-08-15',
      }),
    ).toMatchObject({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: undefined,
      phone: '06 12 34 56 78',
      availableFrom: '2026-08-15T00:00:00.000Z',
    })
  })

  it('filters unknown contract types and defaults missing names', () => {
    expect(
      normalizeCvExtractionJson({
        firstName: null,
        preferredContractTypes: ['CDI', 'STAGE'],
      }),
    ).toMatchObject({
      firstName: '',
      lastName: '',
      preferredContractTypes: ['CDI'],
    })
  })

  it('converts FR dates and drops non-ISO availableFrom', () => {
    expect(normalizeCvExtractionJson({ availableFrom: '15/08/2026' })).toMatchObject({
      availableFrom: '2026-08-15T00:00:00.000Z',
    })
    expect(normalizeCvExtractionJson({ availableFrom: 'immédiat' })).toMatchObject({
      availableFrom: undefined,
    })
    expect(normalizeCvExtractionJson({ availableFrom: 'ASAP' })).toMatchObject({
      availableFrom: undefined,
    })
  })
})
