// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { mockProvider } from './mock-provider'
import { parseAssistantResponse } from './parse'
import { RESPONSE_KINDS } from './schemas'

describe('mockProvider', () => {
  it.each(RESPONSE_KINDS)('returns JSON that validates for kind "%s"', async (kind) => {
    const raw = await mockProvider.complete({ kind, prompt: 'whatever' })
    expect(() => parseAssistantResponse(kind, raw)).not.toThrow()
  })

  it('echoes part of the prompt so context is observable', async () => {
    const raw = await mockProvider.complete({ kind: 'chat', prompt: 'Pharmacie du Centre' })
    expect(raw).toContain('Pharmacie du Centre')
  })
})
