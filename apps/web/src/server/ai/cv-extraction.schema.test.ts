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
})
