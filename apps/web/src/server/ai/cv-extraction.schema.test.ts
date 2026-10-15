// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { parseCvExtraction } from '@/server/ai/cv-extraction.schema'

describe('parseCvExtraction', () => {
  it('accepts messy AI output after normalization', () => {
    expect(
      parseCvExtraction(
        JSON.stringify({
          firstName: 'Jean',
          email: 'bad-email',
          availableFrom: '2026-08-15',
          preferredContractTypes: ['CDI', 'STAGE'],
        }),
      ),
    ).toMatchObject({
      firstName: 'Jean',
      lastName: '',
      email: undefined,
      availableFrom: '2026-08-15T00:00:00.000Z',
      preferredContractTypes: ['CDI'],
    })
  })

  it('throws AI_RESPONSE_NOT_JSON for non-JSON', () => {
    expect(() => parseCvExtraction('not json')).toThrow('AI_RESPONSE_NOT_JSON')
  })

  it('accepts messy optionals without throwing schema error', () => {
    expect(
      parseCvExtraction(
        JSON.stringify({
          firstName: 'Camille',
          lastName: 'Martin',
          availableFrom: 'immédiat',
          softwares: 'LGPI',
          email: 'not-an-email',
        }),
      ),
    ).toMatchObject({
      firstName: 'Camille',
      lastName: 'Martin',
      availableFrom: undefined,
      softwares: undefined,
      email: undefined,
    })
  })
})
