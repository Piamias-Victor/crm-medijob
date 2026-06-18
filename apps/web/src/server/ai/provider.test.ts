// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createAssistantProvider } from './provider'
import { mockProvider } from './mock-provider'

describe('createAssistantProvider', () => {
  it('returns the mock provider when EXTRACTION_PROVIDER=mock (even with a key)', () => {
    expect(
      createAssistantProvider({ EXTRACTION_PROVIDER: 'mock', OPENROUTER_API_KEY: 'k' }),
    ).toBe(mockProvider)
  })

  it('falls back to the mock provider when no OpenRouter key is set', () => {
    expect(createAssistantProvider({ EXTRACTION_PROVIDER: 'gemini' })).toBe(mockProvider)
  })

  it('returns a real (non-mock) provider when an OpenRouter key is set', () => {
    const provider = createAssistantProvider({
      EXTRACTION_PROVIDER: 'gemini',
      OPENROUTER_API_KEY: 'sk-or-123',
      EXTRACTION_MODEL: 'google/gemini-2.5-flash-lite',
    })
    expect(provider).not.toBe(mockProvider)
    expect(typeof provider.complete).toBe('function')
  })
})
