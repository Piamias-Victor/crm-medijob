// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { runAssistantChat, type AssistantDeps } from './chat-handler'
import type { AssistantRequest } from './provider'

function fakeProvider(raw: string, capture?: (req: AssistantRequest) => void) {
  return {
    complete: vi.fn(async (req: AssistantRequest) => {
      capture?.(req)
      return raw
    }),
  }
}

function repos(overrides = {}) {
  return {
    candidate: { findById: vi.fn().mockResolvedValue(null) },
    pharmacy: { findById: vi.fn().mockResolvedValue(null) },
    mission: { findById: vi.fn().mockResolvedValue(null) },
    ...overrides,
  }
}

function deps(raw: string, capture?: (req: AssistantRequest) => void, repoOverrides = {}): AssistantDeps {
  return { provider: fakeProvider(raw, capture), repos: repos(repoOverrides) }
}

describe('runAssistantChat', () => {
  it('returns a validated chat reply', async () => {
    const result = await runAssistantChat({ message: 'Salut' }, deps('{"reply":"Bonjour"}'))
    expect(result).toEqual({ kind: 'chat', text: 'Bonjour' })
  })

  it('attaches the loaded entity context to the prompt for a shortcut', async () => {
    let seen: AssistantRequest | undefined
    const d = deps('{"subject":"S","body":"B"}', (req) => (seen = req), {
      candidate: { findById: vi.fn().mockResolvedValue({ firstName: 'Marie', lastName: 'Curie' }) },
    })
    const result = await runAssistantChat(
      { shortcutId: 'candidate-email', context: { entityType: 'candidate', entityId: 'c1' } },
      d,
    )
    expect(result.kind).toBe('email')
    expect(seen?.kind).toBe('email')
    expect(seen?.prompt).toContain('Marie Curie')
  })

  it('throws when the AI response is malformed (never rendered as truth)', async () => {
    await expect(runAssistantChat({ message: 'hi' }, deps('not json'))).rejects.toThrow()
  })

  it('throws on an unknown shortcut id', async () => {
    await expect(runAssistantChat({ shortcutId: 'nope' }, deps('{"reply":"x"}'))).rejects.toThrow()
  })
})
