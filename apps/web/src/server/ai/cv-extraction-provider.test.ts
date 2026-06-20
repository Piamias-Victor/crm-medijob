// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCvExtractionProvider } from '@/server/ai/cv-extraction-provider'
import { mockProvider } from '@/server/ai/mock-provider'

describe('createCvExtractionProvider', () => {
  it('returns mock extraction when EXTRACTION_PROVIDER=mock', async () => {
    const provider = createCvExtractionProvider({ EXTRACTION_PROVIDER: 'mock' })
    const raw = await provider.extract({
      filename: 'cv.pdf',
      mimeType: 'application/pdf',
      dataBase64: 'abc',
    })
    expect(raw).toBe(await mockProvider.complete({ kind: 'cv', prompt: 'cv.pdf' }))
  })

  it('selects a different provider when OpenRouter is configured', () => {
    const mock = createCvExtractionProvider({ EXTRACTION_PROVIDER: 'mock' })
    const openrouter = createCvExtractionProvider({
      EXTRACTION_PROVIDER: 'openrouter',
      OPENROUTER_API_KEY: 'sk-test',
    })
    expect(openrouter).not.toBe(mock)
  })
})
