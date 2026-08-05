// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { runAssistantChat } from './chat-handler'
import type { AssistantRequest } from './provider'
import { deps, repos } from './chat-handler.test.fixtures'

describe('runAssistantChat', () => {
  it('returns a validated chat reply', async () => {
    const result = await runAssistantChat({ message: 'Salut' }, deps('{"reply":"Bonjour"}'))
    expect(result).toEqual({ kind: 'chat', text: 'Bonjour' })
  })

  it('attaches the loaded entity context to the prompt for a shortcut', async () => {
    let seen: AssistantRequest | undefined
    const d = deps('{"subject":"S","body":"B"}', (req) => (seen = req), {
      repos: repos({
        candidate: {
          findById: vi.fn().mockResolvedValue({ firstName: 'Marie', lastName: 'Curie' }),
        },
      }),
    })
    const result = await runAssistantChat(
      { shortcutId: 'candidate-email', context: { entityType: 'candidate', entityId: 'c1' } },
      d,
    )
    expect(result.kind).toBe('email')
    expect(seen?.prompt).toContain('Marie Curie')
  })

  it('throws when the AI response is malformed (never rendered as truth)', async () => {
    await expect(runAssistantChat({ message: 'hi' }, deps('not json'))).rejects.toThrow()
  })

  it('throws on an unknown shortcut id', async () => {
    await expect(runAssistantChat({ shortcutId: 'nope' }, deps('{"reply":"x"}'))).rejects.toThrow()
  })

  it('attaches recent chat history to the free-chat prompt', async () => {
    let seen: AssistantRequest | undefined
    const d = deps('{"reply":"Suite"}', (req) => (seen = req))
    await runAssistantChat(
      {
        message: 'c’est tout ?',
        history: [
          { role: 'user', content: 'résume Camille' },
          { role: 'assistant', content: 'Camille est préparatrice à Lille.' },
        ],
      },
      d,
    )
    expect(seen?.prompt).toContain('résume Camille')
    expect(seen?.prompt).toContain('Camille est préparatrice à Lille.')
    expect(seen?.prompt).toContain('c’est tout ?')
  })
})
